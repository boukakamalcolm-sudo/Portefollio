import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { blobReady, deleteFiles, getProjects, uploadFile } from '@/lib/store';

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'application/pdf'];
// limite des requêtes vers une fonction Vercel (4,5 Mo), avec une marge
const MAX = 4.4 * 1024 * 1024;
const FILE_URL = /^\/api\/file\/projets\/[\w.\-]+$/;

const err = (error: string, status = 400) => NextResponse.json({ error }, { status });

// Envoi d'un fichier (corps brut), nom dans ?name=
export async function POST(req: Request) {
  if (!(await isAdmin())) return err('Non autorisé', 401);
  if (!blobReady()) return err('Stockage non branché', 503);
  const type = (req.headers.get('content-type') || '').split(';')[0];
  if (!TYPES.includes(type)) return err('Seuls les images (JPG, PNG, WebP, GIF, AVIF) et les PDF sont acceptés');
  if (Number(req.headers.get('content-length') || 0) > MAX) return err('Fichier trop lourd (4 Mo maximum)', 413);
  const data = await req.arrayBuffer();
  if (!data.byteLength) return err('Fichier vide');
  if (data.byteLength > MAX) return err('Fichier trop lourd (4 Mo maximum)', 413);
  const name = new URL(req.url).searchParams.get('name') || 'fichier';
  try {
    return NextResponse.json({ url: await uploadFile(name, data, type) });
  } catch (e) {
    console.error('upload', e);
    return err('L’envoi a échoué', 502);
  }
}

// Supprime les fichiers envoyés puis abandonnés (éditeur annulé, fichier retiré avant enregistrement).
// Un fichier encore utilisé par un projet enregistré n'est jamais supprimé.
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return err('Non autorisé', 401);
  const urls: unknown = (await req.json().catch(() => null))?.urls;
  if (!Array.isArray(urls)) return err('Requête invalide');
  const used = new Set((await getProjects()).flatMap((p) => p.files.map((f) => f.url)));
  const orphans = urls.filter((u): u is string => typeof u === 'string' && FILE_URL.test(u) && !used.has(u)).slice(0, 50);
  await deleteFiles(orphans);
  return NextResponse.json({ deleted: orphans.length });
}
