import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';
import { projectHref } from '@/lib/format';
import { getProjects } from '@/lib/store';
import { onFreelance } from '@/lib/visuals';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    ...projects.filter(onFreelance).map((p) => ({ url: SITE_URL + projectHref(p.id), changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${SITE_URL}/parcours`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/mentions-legales`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
