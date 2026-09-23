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
      'Le stock, les ventes et la caisse sont consultables à tout moment, y compris à distance. À compléter avec les chiffres réels : temps gagné, écarts de caisse, ruptures évitées.',
    files: [],
  },
  {
    id: 'deploiement-saas',
    title: 'Déploiement SaaS',
    subtitle: 'Faire adopter un nouvel outil par les équipes',
    sector: 'Éditeur SaaS · Customer Success',
    tags: ['DÉPLOIEMENT', 'FORMATION', 'ADOPTION'],
    problem:
      'Un outil acheté mais peu utilisé : les équipes gardaient leurs anciennes habitudes et le logiciel ne tenait pas ses promesses.',
    solution:
      'Ateliers avec les métiers, paramétrage adapté aux usages réels, formation et supports simples, suivi de l’utilisation.',
    result: 'Un déploiement structuré avec des indicateurs d’usage pour voir qui utilise l’outil et où ça bloque.',
    files: [],
  },
  {
    id: 'cartographie-si',
    title: 'Cartographie des outils',
    subtitle: 'Y voir clair dans les logiciels d’une organisation',
    sector: 'Secteur public · 18 entités',
    tags: ['AUDIT', 'OUTILS', 'PILOTAGE'],
    problem:
      'Des dizaines d’outils utilisés sans vue d’ensemble, des doublons, des fichiers maison que personne ne maîtrise.',
    solution:
      'Recensement des applications sur 18 sites, repérage des outils « officieux », restitution claire pour décider quoi garder, remplacer ou supprimer.',
    result: 'Une carte lisible des outils, qui sert de base aux décisions d’investissement.',
    files: [],
  },
];
