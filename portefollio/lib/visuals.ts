import { seedProjects } from './seed';
import type { Project } from './types';

// Objets 3D (générés avec Canva, détourés, dans public/3d/) : couverture des projets sans image
export const VISUALS = {
  musee: 'Musée et graphique',
  ia: 'Bulle de discussion IA',
  panier: 'Panier et téléphone',
  carte: 'Carte et repère',
  dossier: 'Dossier relié à un nuage',
  engrenages: 'Engrenages et entonnoir',
  asterisque: 'Astérisque',
} as const;

export type Visual = keyof typeof VISUALS;

export const isVisual = (v: unknown): v is Visual =>
  typeof v === 'string' && Object.prototype.hasOwnProperty.call(VISUALS, v);

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');

// Le même projet dans le contenu de départ (même identifiant ou même titre), pour les projets
// enregistrés avant l'ajout des objets 3D et des captures
const seedFor = (project: Pick<Project, 'id' | 'title'>) =>
  seedProjects.find((s) => s.id === project.id || norm(s.title) === norm(project.title));

// Objet choisi dans l'admin ; sinon celui du contenu de départ ; sinon l'astérisque, objet neutre.
export function visualSrc(project: Pick<Project, 'id' | 'title' | 'visual'>) {
  const v = [project.visual, seedFor(project)?.visual].find(isVisual) ?? 'asterisque';
  return `/3d/${v}.png`;
}

// Capture de l'application : 1re image du projet. Pour un projet enregistré avant les captures
// (sans champ visual), celle du contenu de départ ; une fois le projet enregistré depuis l'admin,
// ses propres fichiers font foi, même vides.
export function coverFor(project: Pick<Project, 'id' | 'title' | 'files' | 'visual'>) {
  const first = (p?: Pick<Project, 'files'>) => p?.files.find((f) => f.kind === 'image')?.url;
  return first(project) ?? (project.visual === undefined ? first(seedFor(project)) : undefined);
}
