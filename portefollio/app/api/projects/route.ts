import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getProjects, saveProjects, deleteFiles } from '@/lib/store';
import type { Project } from '@/lib/types';

const readJson = (req: Request) => req.json().catch(() => null);
const str = (v: unknown, max = 4000) => (typeof v === 'string' ? v.slice(0, max).trim() : '');

function clean(input: Partial<Project>): Project {
  input = input && typeof input === 'object' ? input : {};
  return {
    id: str(input.id, 80) || crypto.randomUUID(),
    title: str(input.title, 120),
    subtitle: str(input.subtitle, 200),
    sector: str(input.sector, 120),
    tags: Array.isArray(input.tags) ? input.tags.map((t) => str(t, 40)).filter(Boolean).slice(0, 8) : [],
    problem: str(input.problem),
    solution: str(input.solution),
    result: str(input.result),
    files: Array.isArray(input.files)
      ? input.files
          .filter((f) => f && typeof f.url === 'string' && /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(f.url))
          .map((f) => ({ url: f.url, name: str(f.name, 200), kind: f.kind === 'pdf' ? 'pdf' : 'image' }))
      : [],
  };
}

const deny = () => NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

// Liste à jour (sans cache), pour l'admin
export async function GET() {
  if (!(await isAdmin())) return deny();
  return NextResponse.json({ projects: await getProjects() }, { headers: { 'Cache-Control': 'no-store' } });
}

// Créer ou mettre à jour un projet
export async function PUT(req: Request) {
  if (!(await isAdmin())) return deny();
  const project = clean(await readJson(req));
  if (!project.title) return bad('Titre obligatoire');
  const projects = [...(await getProjects())];
  const i = projects.findIndex((p) => p.id === project.id);
  if (i >= 0) {
    const removed = projects[i].files.filter((f) => !project.files.some((n) => n.url === f.url));
    projects[i] = project;
    await saveProjects(projects);
    await deleteFiles(removed.map((f) => f.url));
  } else {
    projects.push(project);
    await saveProjects(projects);
  }
  return NextResponse.json({ projects });
}

// Supprimer un projet
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return deny();
  const id = (await readJson(req))?.id;
  if (typeof id !== 'string' || !id) return bad('Projet introuvable');
  const projects = await getProjects();
  const target = projects.find((p) => p.id === id);
  const next = projects.filter((p) => p.id !== id);
  await saveProjects(next);
  if (target) await deleteFiles(target.files.map((f) => f.url));
  return NextResponse.json({ projects: next });
}

// Réordonner
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return deny();
  const order: unknown = (await readJson(req))?.order;
  const projects = await getProjects();
  // l'ordre doit contenir chaque projet exactement une fois
  const valid =
    Array.isArray(order) &&
    order.length === projects.length &&
    new Set(order).size === order.length &&
    projects.every((p) => order.includes(p.id));
  if (!valid) return bad('Ordre invalide');
  const next = (order as string[]).map((id) => projects.find((p) => p.id === id)!);
  await saveProjects(next);
  return NextResponse.json({ projects: next });
}
