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

// l'astérisque sert d'objet neutre aux projets sans illustration choisie
export const visualSrc = (v?: string) => `/3d/${isVisual(v) ? v : 'asterisque'}.png`;
