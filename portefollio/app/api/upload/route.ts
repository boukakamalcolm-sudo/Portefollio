import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { deleteFiles, getProjects } from '@/lib/store';

const BLOB_URL = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/projets\//i;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error('Non autorisé');
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'application/pdf'],
          maximumSizeInBytes: 25 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

// Supprime les fichiers envoyés puis abandonnés (éditeur annulé, fichier retiré avant enregistrement).
// Un fichier encore utilisé par un projet enregistré n'est jamais supprimé.
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const urls: unknown = (await req.json().catch(() => null))?.urls;
  if (!Array.isArray(urls)) return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  const used = new Set((await getProjects()).flatMap((p) => p.files.map((f) => f.url)));
  const orphans = urls.filter((u): u is string => typeof u === 'string' && BLOB_URL.test(u) && !used.has(u)).slice(0, 50);
  await deleteFiles(orphans);
  return NextResponse.json({ deleted: orphans.length });
}
