import type { Project } from './types';

// Contenu de départ, affiché tant qu'aucun projet n'a été enregistré depuis l'admin.
export const seedProjects: Project[] = [
  {
    id: 'marche-ya-cina',
    title: 'Marché ya Cina',
    subtitle: 'Gestion de stock et de caisse pour un commerce alimentaire',
    sector: 'Commerce alimentaire · Brazzaville',
    tags: ['STOCK', 'CAISSE', 'APPLI WEB'],
    problem:
      'Un commerce familial qui suivait son stock et ses ventes à la main. Impossible de savoir rapidement ce qui restait en rayon, ce qui se vendait, ni combien il y avait réellement en caisse.',
    solution:
      'Une application web simple, utilisable sur téléphone : produits, approvisionnements, ventes, dépenses, caisse et alertes de stock. Des accès différents pour le gérant et les vendeurs.',
    result:
      'Le stock, les ventes et la caisse sont consultables à tout moment, y compris à distance. Le gérant sait chaque soir ce qui a été vendu, ce qui reste en rayon et ce qu’il y a réellement en caisse.',
    files: [],
  },
  {
    id: 'indicateurs-musees',
    title: 'Indicateurs des musées',
    subtitle: 'Un seul outil pour remonter les chiffres de 89 musées',
    sector: 'Secteur public · Hauts-de-France',
    tags: ['DÉPLOIEMENT', 'DONNÉES', 'ADOPTION'],
    problem:
      'Les musées d’une région transmettaient leurs indicateurs chacun à sa façon : fichiers différents, définitions différentes, relances permanentes pour obtenir les chiffres.',
    solution:
      'Définition commune des données à remonter, cadrage de l’outil, déploiement et accompagnement des équipes des musées jusqu’à la mise en service.',
    result: '89 musées équipés et 100 % d’utilisation : les chiffres arrivent au même endroit, dans le même format.',
    files: [],
  },
  {
    id: 'cartographie-si',
    title: 'Cartographie des outils',
    subtitle: 'Y voir clair dans les logiciels d’une organisation',
    sector: 'Secteur public · 18 directions régionales',
    tags: ['AUDIT', 'OUTILS', 'PILOTAGE'],
    problem:
      'Des dizaines d’outils utilisés sans vue d’ensemble, des doublons, des fichiers maison que personne ne maîtrise.',
    solution:
      'Recensement des applications dans les 18 directions régionales, repérage des outils « officieux », restitution claire pour décider quoi garder, remplacer ou supprimer.',
    result:
      '50 applications recensées, dont 30 % d’outils « officieux ». Les scénarios de simplification ont été arbitrés en comité de direction.',
    files: [],
  },
];
