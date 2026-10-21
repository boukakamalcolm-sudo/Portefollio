import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { blobReady, getProjects, saveProjects, deleteFiles } from '@/lib/store';
import { seedProjects } from '@/lib/seed';
import type { Project } from '@/lib/types';
import { isVisual } from '@/lib/visuals';

// fichiers servis par /api/file (Blob privé), captures livrées avec le site (public/captures),
// ou anciennes URL publiques Vercel Blob
const FILE_URL = /^(\/api\/file\/projets\/[\w.\-]+|\/captures\/(?:[\w-]+\/)*[\w.\-]+|https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/.+)$/i;
const COLOR = /^#[0-9a-f]{6}$/i;
const shipped = (url: string) => url.startsWith('/captures/');
const readJson = (req: Request) => req.json().catch(() => null);
const str = (v: unknown, max = 4000) => (typeof v === 'string' ? v.slice(0, max).trim() : '');
const strs = (v: unknown, count: number) => (Array.isArray(v) ? v.map((t) => str(t, 40)).filter(Boolean).slice(0, count) : []);
// comparaison de titres sans accents, casse ni ponctuation
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');

function clean(input: Partial<Project>): Project {
  input = input && typeof input === 'object' ? input : {};
  let icon = false; // une seule icône par projet
  return {
    id: str(input.id, 80) || crypto.randomUUID(),
    title: str(input.title, 120),
    subtitle: str(input.subtitle, 200),
    sector: str(input.sector, 120),
    role: str(input.role, 120),
    period: str(input.period, 60),
    tags: strs(input.tags, 8),
    stack: strs(input.stack, 12),
    visual: isVisual(input.visual) ? input.visual : '',
    color: typeof input.color === 'string' && COLOR.test(input.color) ? input.color.toLowerCase() : '',
    status: str(input.status, 60),
    problem: str(input.problem),
    solution: str(input.solution),
    result: str(input.result),
    files: Array.isArray(input.files)
      ? input.files
          .filter((f) => f && typeof f.url === 'string' && FILE_URL.test(f.url))
          .map((f) => {
            const kind = f.kind === 'pdf' ? 'pdf' : 'image';
            const isIcon = kind === 'image' && f.icon === true && !icon;
            if (isIcon) icon = true;
            return {
              url: f.url,
              name: str(f.name, 200),
              kind,
              ...(kind === 'image' ? { title: str(f.title, 80), caption: str(f.caption, 300) } : {}),
              ...(isIcon ? { icon: true } : {}),
            };
          })
      : [],
  };
}

const deny = () => NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });
const noStore = () =>
  NextResponse.json({ error: 'Stockage non branché : connectez un Blob store au projet dans Vercel.' }, { status: 503 });

// Liste à jour (sans cache), pour l'admin
export async function GET() {
  if (!(await isAdmin())) return deny();
  return NextResponse.json({ projects: await getProjects() }, { headers: { 'Cache-Control': 'no-store' } });
}

// Créer ou mettre à jour un projet
export async function PUT(req: Request) {
  if (!(await isAdmin())) return deny();
  if (!blobReady()) return noStore();
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

// Importer le contenu de départ (lib/seed.ts) : chaque projet est reconnu par son identifiant ou son titre.
// Les textes sont remplacés, les images et PDF déjà envoyés sont conservés (sinon ceux du contenu de départ).
// Les projets importés passent en tête, dans l'ordre du contenu de départ ; les autres suivent, inchangés.
export async function POST() {
  if (!(await isAdmin())) return deny();
  if (!blobReady()) return noStore();
  const current = await getProjects();
  const used = new Set<string>();
  const imported = seedProjects.map((seed) => {
    const free = current.filter((p) => !used.has(p.id));
    const match = free.find((p) => p.id === seed.id) ?? free.find((p) => norm(p.title) === norm(seed.title));
    if (!match) return seed;
    used.add(match.id);
    // les fichiers envoyés depuis l'admin restent ; les captures livrées avec le site sont remplacées
    const uploaded = match.files.some((f) => !shipped(f.url));
    return { ...seed, id: match.id, files: uploaded ? match.files : seed.files };
  });
  const next = [...imported, ...current.filter((p) => !used.has(p.id))];
  await saveProjects(next);
  return NextResponse.json({ projects: next });
}

// Supprimer un projet
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return deny();
  if (!blobReady()) return noStore();
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
  if (!blobReady()) return noStore();
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
