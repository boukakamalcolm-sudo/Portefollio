import 'server-only';
import { list, put, del, get } from '@vercel/blob';
import { unstable_cache, revalidateTag } from 'next/cache';
import type { Project } from './types';
import { seedProjects } from './seed';

const PREFIX = 'data/projects-';
const TAG = 'projects';
// Le Blob store est privé : les fichiers sont servis par /api/file/<chemin>
const ACCESS = 'private' as const;
export const FILE_PREFIX = '/api/file/';
export const UPLOAD_DIR = 'projets/';

// Nouvelle connexion Vercel (BLOB_STORE_ID + OIDC) ou ancien jeton
export const blobReady = () => !!(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

export const fileUrl = (pathname: string) => FILE_PREFIX + pathname;
const toPathname = (url: string) => (url.startsWith(FILE_PREFIX) ? url.slice(FILE_PREFIX.length) : url);

// null : rien d'enregistré depuis l'admin
async function readLatest(): Promise<Project[] | null> {
  if (!blobReady()) return null;
  const { blobs } = await list({ prefix: PREFIX });
  if (!blobs.length) return null;
  const latest = blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))[0];
  const res = await get(latest.pathname, { access: ACCESS });
  if (res?.statusCode !== 200) return null;
  return (await new Response(res.stream).json()) as Project[];
}

const readCached = unstable_cache(readLatest, ['projects-v3'], { tags: [TAG] });

// Le contenu de départ reste hors du cache : une modification de lib/seed.ts
// est visible dès le déploiement suivant (le cache de données survit aux déploiements).
// En cas de panne du stockage, on affiche le contenu de départ plutôt qu'une erreur
// (les erreurs ne sont pas mises en cache : nouvel essai à la requête suivante).
export async function getProjects(): Promise<Project[]> {
  try {
    return (await readCached()) ?? seedProjects;
  } catch (e) {
    console.error('Lecture des projets impossible', e);
    return seedProjects;
  }
}

export async function saveProjects(projects: Project[]) {
  const { blobs: old } = await list({ prefix: PREFIX });
  await put(`${PREFIX}${Date.now()}.json`, JSON.stringify(projects), {
    access: ACCESS,
    contentType: 'application/json',
    addRandomSuffix: true,
  });
  // on garde les 5 dernières versions comme historique
  const toDelete = old
    .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
    .slice(4)
    .map((b) => b.pathname);
  if (toDelete.length) await del(toDelete);
  revalidateTag(TAG);
}

export async function uploadFile(name: string, data: ArrayBuffer, contentType: string) {
  const safe = name.replace(/[^\w.\-]+/g, '-').slice(-80) || 'fichier';
  const blob = await put(UPLOAD_DIR + safe, Buffer.from(data), { access: ACCESS, contentType, addRandomSuffix: true });
  return fileUrl(blob.pathname);
}

export async function readFile(pathname: string) {
  const res = await get(pathname, { access: ACCESS });
  return res?.statusCode === 200 ? res : null;
}

export async function deleteFiles(urls: string[]) {
  if (urls.length) await del(urls.map(toPathname)).catch(() => {});
}
