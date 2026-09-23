import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getProjects, saveProjects, deleteFiles } from '@/lib/store';
import type { Project } from '@/lib/types';

const str = (v: unknown, max = 4000) => (typeof v === 'string' ? v.slice(0, max).trim() : '');

function clean(input: Partial<Project>): Project {
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
          .filter((f) => f && typeof f.url === 'string' && /^https:\/\/[a-z0-9.-]+\.blob\.vercel-storage\.com\//i.test(f.url))
          .map((f) => ({ url: f.url, name: str(f.name, 200), kind: f.kind === 'pdf' ? 'pdf' : 'image' }))
      : [],
  };
}

const deny = () => NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

// Créer ou mettre à jour un projet
export async function PUT(req: Request) {
  if (!(await isAdmin())) return deny();
  const project = clean(await req.json());
  if (!project.title) return NextResponse.json({ error: 'Titre obligatoire' }, { status: 400 });
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
  const { id } = await req.json();
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
  const { order } = (await req.json()) as { order: string[] };
  const projects = await getProjects();
  const next = order.map((id) => projects.find((p) => p.id === id)).filter(Boolean) as Project[];
  if (next.length !== projects.length) return NextResponse.json({ error: 'Ordre invalide' }, { status: 400 });
  await saveProjects(next);
  return NextResponse.json({ projects: next });
}
