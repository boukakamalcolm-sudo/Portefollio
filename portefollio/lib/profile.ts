// Contenu du parcours, repris du CV.

export const PITCH =
  'Je pars de la façon dont les équipes travaillent vraiment. Je cartographie les outils et les processus, je repère ce qui fait perdre du temps, puis je construis la solution adaptée : automatisation, intégration, IA ou application sur mesure.';

export const ABOUT =
  'Du SaaS au service public, je pilote des projets SI de bout en bout : cadrage, intégration, déploiement et adoption. Je m’occupe aussi de la suite (formation, guides et suivi) pour que les nouvelles méthodes tiennent dans la durée.';

// Ma façon de travailler : les étapes reprises dans le détail de chaque expérience
export const METHOD = ['Cartographier', 'Simplifier', 'Construire', 'Ancrer'] as const;

export type Step = (typeof METHOD)[number];

// Une phrase par étape, affichée sous les mots de la méthode sur l'accueil
export const METHOD_TEXT: Record<Step, string> = {
  Cartographier: 'Comprendre comment les équipes travaillent vraiment : les outils, les processus, ce qui fait perdre du temps.',
  Simplifier: 'Retirer les doublons et les étapes inutiles avant d’ajouter quoi que ce soit.',
  Construire: 'La solution adaptée : automatisation, intégration, IA ou application sur mesure.',
  Ancrer: 'Formation, guides et suivi, pour que les nouvelles méthodes tiennent dans la durée.',
};

export type Experience = {
  id: string;
  period: string;
  role: string;
  org: string;
  place: string;
  visual: string;
  figure?: [string, string];
  summary: string;
  steps: [Step, string][];
  skills: string[];
  projects: string[];
};

export const XP: Experience[] = [
  {
    id: 'culture',
    period: 'sept. 2025 – sept. 2026',
    role: 'Chef de projet SI',
    org: 'Ministère de la Culture',
    place: 'Service du numérique, Paris',
    visual: 'musee',
    figure: ['18', 'directions régionales cartographiées'],
    summary: 'Un programme de rationalisation et de digitalisation des outils des services régionaux.',
    steps: [
      ['Cartographier', 'Les applications et les processus de 18 directions régionales, après une étude stratégique.'],
      ['Simplifier', 'Repérer les outils utilisés hors cadre et les doublons.'],
      ['Construire', 'Cadrer et déployer un outil de remontée d’indicateurs : processus en BPMN, modèle de données, échanges CSV, recette sous Jira.'],
      ['Ancrer', 'Guides utilisateurs et accompagnement de chaque musée, une cinquantaine au total.'],
    ],
    skills: ['Cartographie SI', 'BPMN', 'Modélisation de données', 'Échanges CSV', 'Jira', 'Recette', 'Déploiement', 'Conduite du changement'],
    projects: ['indicateurs-musees'],
  },
  {
    id: 'covea',
    period: 'sept. 2024 – sept. 2025',
    role: 'Chef de projet transformation digitale',
    org: 'Covéa',
    place: 'Paris',
    visual: 'ia',
    figure: ['550', 'collaborateurs passés à Microsoft 365'],
    summary: 'L’arrivée de l’IA générative et de Microsoft 365 dans le quotidien des équipes.',
    steps: [
      ['Cartographier', 'Des ateliers avec les services pour identifier les cas d’usage de l’IA générative.'],
      ['Construire', 'Un assistant IA dans Copilot Studio branché sur les bases de connaissances internes (RAG), des automatisations Power Automate et l’intégration d’une GED avec Salesforce Service Cloud par API REST.'],
      ['Ancrer', 'Microsoft 365 déployé auprès de 550 collaborateurs, un réseau d’ambassadeurs, une charte et une formation à un usage responsable de l’IA.'],
    ],
    skills: ['Microsoft 365 Copilot', 'Copilot Studio', 'IA générative (RAG)', 'Power Automate', 'API REST', 'Salesforce', 'Formation', 'Conduite du changement'],
    projects: ['ia-generative-covea', 'ged-salesforce'],
  },
  {
    id: 'beekast',
    period: 'sept. 2022 – sept. 2024',
    role: 'Proxy Product Owner',
    org: 'Beekast',
    place: 'Éditeur SaaS, Paris',
    visual: 'engrenages',
    figure: ['180', 'clients dont j’ai recueilli les besoins'],
    summary: 'Le lien entre les clients d’un éditeur SaaS et son équipe produit.',
    steps: [
      ['Cartographier', 'Recueillir les besoins de 180 clients.'],
      ['Construire', 'User stories et backlog Jira, workflows d’automatisation sous Zoho (relances, campagnes, facturation) et tableaux de bord SQL sous Metabase.'],
      ['Ancrer', 'Support, MCO et formation de 150 agents lors d’un déploiement national dans une administration belge.'],
    ],
    skills: ['Jira', 'User stories', 'Zoho CRM', 'Zoho Billing', 'SQL', 'Metabase', 'Support et MCO', 'Formation'],
    projects: ['crm-saas-beekast'],
  },
  {
    id: 'groupama',
    period: 'oct. 2021 – août 2022',
    role: 'Conseiller relation client',
    org: 'Groupama Épargne Salariale',
    place: 'Docaposte, Paris',
    visual: 'dossier',
    summary: 'Le traitement des demandes et des dossiers clients en environnement réglementé, avec des reportings d’activité.',
    steps: [],
    skills: ['Relation client', 'Environnement réglementé', 'Reporting'],
    projects: [],
  },
  {
    id: 'perso',
    period: 'En parallèle',
    role: 'Product builder',
    org: 'Projets personnels',
    place: 'Développement assisté par IA',
    visual: 'panier',
    summary: 'Des applications conçues et construites de bout en bout, avec l’IA comme copilote de développement.',
    steps: [
      ['Construire', 'Marché ya Cina, une application de gestion de stock et de caisse pour un commerce alimentaire, sur Next.js, Supabase et Vercel, construite avec Claude.'],
    ],
    skills: ['Next.js', 'Supabase', 'Vercel', 'API Claude', 'Développement assisté par IA', 'No-code / low-code'],
    projects: ['marche-ya-cina'],
  },
];

export const EDUCATION: [string, string, string][] = [
  ['2026', 'Mastère Spécialisé Conseil et Management des SI', 'Institut Mines-Télécom'],
  ['2025', 'Master 1 Gestion de projet', 'INSEEC'],
  ['2023', 'Bachelor Gestion de projet web', 'INSEEC'],
  ['2021', 'DUT Techniques de commercialisation', 'IUT de Saint-Denis'],
];

export const LANGUAGES = 'Français natif · anglais courant (C1)';
