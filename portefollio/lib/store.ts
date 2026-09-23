import 'server-only';
import { list, put, del } from '@vercel/blob';
import { unstable_cache, revalidateTag } from 'next/cache';
import type { Project } from './types';
import { seedProjects } from './seed';

const PREFIX = 'data/projects-';
const TAG = 'projects';

async function readLatest(): Promise<Project[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return seedProjects;
  const { blobs } = await list({ prefix: PREFIX });
  if (!blobs.length) return seedProjects;
  const latest = blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))[0];
  const res = await fetch(latest.url, { cache: 'no-store' });
  if (!res.ok) return seedProjects;
  return (await res.json()) as Project[];
}

export const getProjects = unstable_cache(readLatest, ['projects'], { tags: [TAG] });

export async function saveProjects(projects: Project[]) {
  const { blobs: old } = await list({ prefix: PREFIX });
  await put(`${PREFIX}${Date.now()}.json`, JSON.stringify(projects), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true,
  });
  // on garde les 5 dernières versions comme historique
  const toDelete = old
    .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
    .slice(4)
    .map((b) => b.url);
  if (toDelete.length) await del(toDelete);
  revalidateTag(TAG);
}

export async function deleteFiles(urls: string[]) {
  if (urls.length) await del(urls).catch(() => {});
}
