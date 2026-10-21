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

// Objet choisi dans l'admin ; sinon celui du contenu de départ (même identifiant ou même titre),
// pour les projets enregistrés avant l'ajout du champ ; sinon l'astérisque, objet neutre.
export function visualSrc(project: Pick<Project, 'id' | 'title' | 'visual'>) {
  const seed = seedProjects.find((s) => s.id === project.id || norm(s.title) === norm(project.title));
  const v = [project.visual, seed?.visual].find(isVisual) ?? 'asterisque';
  return `/3d/${v}.png`;
}
