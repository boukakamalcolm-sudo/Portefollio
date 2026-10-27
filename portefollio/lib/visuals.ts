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
export const seedFor = (project: Pick<Project, 'id' | 'title'>) =>
  seedProjects.find((s) => s.id === project.id || norm(s.title) === norm(project.title));

// Réalisation montrée sur la page freelance : case cochée dans l'admin, sinon contenu de départ
export const onFreelance = (project: Project) => project.freelance ?? seedFor(project)?.freelance ?? false;

// Objet choisi dans l'admin ; sinon celui du contenu de départ ; sinon l'astérisque, objet neutre.
export function visualSrc(project: Pick<Project, 'id' | 'title' | 'visual'>) {
  const v = [project.visual, seedFor(project)?.visual].find(isVisual) ?? 'asterisque';
  return `/3d/${v}.png`;
}

// Visuels d'un projet : icône de l'application, écrans, couleur et statut.
// Un projet enregistré avant ces champs (sans champ visual) reprend ceux du contenu de départ tant
// qu'il n'a pas d'image ; une fois enregistré depuis l'admin, ses propres données font foi, même vides.
export function projectMedia(project: Project) {
  const seed = project.visual === undefined ? seedFor(project) : undefined;
  const own = project.files.filter((f) => f.kind === 'image');
  // images livrées avec le site (public/) et non envoyées depuis l'admin : on suit toujours le contenu de départ,
  // pour qu'un changement de visuels dans lib/seed.ts s'affiche sans réimporter
  const shippedOnly = own.length > 0 && own.every((f) => !f.url.startsWith('/api/file/'));
  const base = shippedOnly ? seedFor(project) : seed;
  const fromSeed = base?.files.filter((f) => f.kind === 'image') ?? [];
  const images = own.length && !shippedOnly ? own : fromSeed.length ? fromSeed : own;
  const screens = images.filter((f) => !f.icon);
  return {
    icon: images.find((f) => f.icon)?.url,
    screens,
    // visuels de présentation en paysage plutôt qu'écrans de téléphone
    wide: (screens[0]?.width ?? 0) > (screens[0]?.height ?? Infinity),
    color: project.color ?? seed?.color ?? '',
    status: project.status ?? seed?.status ?? '',
  };
}
