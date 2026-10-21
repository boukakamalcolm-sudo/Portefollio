// Contenu du parcours, repris du CV.

export const PITCH =
  'Je pars de la façon dont les équipes travaillent vraiment : je cartographie les outils et les processus, je repère ce qui fait perdre du temps, puis je construis la solution — automatisation, intégration, IA ou application sur mesure.';

export const ABOUT =
  'Du SaaS au service public, je pilote des projets SI de bout en bout : cadrage, intégration, déploiement et adoption. Je m’occupe aussi de la suite — formation, guides et suivi — pour que les nouvelles méthodes tiennent dans la durée.';

export const FIGURES: [string, string][] = [
  ['18', 'directions régionales cartographiées'],
  ['≈ 50', 'musées équipés d’un outil d’indicateurs'],
  ['550', 'collaborateurs passés à Microsoft 365'],
  ['180', 'clients SaaS dont j’ai recueilli les besoins'],
];

export const METHOD: [string, string][] = [
  ['Cartographier', 'Les outils, les flux et la façon dont les équipes travaillent vraiment.'],
  ['Simplifier', 'Repérer les doublons et les tâches qui font perdre du temps.'],
  ['Construire', 'Automatisations, connexions entre applications, IA et outils sur mesure.'],
  ['Ancrer', 'Formation, guides et suivi pour que les nouvelles méthodes tiennent.'],
];

export const SKILLS: { title: string; items: string[] }[] = [
  {
    title: 'IA et automatisation',
    items: [
      'Microsoft 365 Copilot',
      'Copilot Studio',
      'IA générative (RAG, assistants, prompting)',
      'API Claude',
      'Power Automate',
      'No-code / low-code',
      'Développement assisté par IA',
    ],
  },
  {
    title: 'Intégration et données',
    items: ['API REST', 'Échanges CSV', 'SQL', 'Metabase', 'Supabase', 'Salesforce', 'Zoho', 'Jira'],
  },
  {
    title: 'Pilotage',
    items: [
      'Cartographie SI',
      'Analyse de processus (BPMN)',
      'Cadrage',
      'Recette',
      'Déploiement',
      'Formation',
      'Conduite du changement',
      'Suivi des indicateurs',
    ],
  },
];

export const XP = [
  {
    period: 'sept. 2025 – sept. 2026',
    role: 'Chef de projet SI',
    org: 'Ministère de la Culture · Service du numérique, Paris',
    text: 'Programme de rationalisation et de digitalisation des outils des services régionaux : étude stratégique, cartographie des applications et des processus de 18 directions régionales. Au cœur du programme, cadrage et déploiement d’un outil de remontée d’indicateurs auprès d’une cinquantaine de musées.',
    projects: ['indicateurs-musees', 'cartographie-si'],
  },
  {
    period: 'sept. 2024 – sept. 2025',
    role: 'Chef de projet transformation digitale',
    org: 'Covéa, Paris',
    text: 'Implémentation de l’IA générative (Microsoft 365 Copilot, assistant RAG sous Copilot Studio, Power Automate), charte d’usage et formation des équipes. Déploiement de Microsoft 365 auprès de 550 collaborateurs et intégration d’une GED avec Salesforce Service Cloud.',
    projects: ['ia-generative-covea', 'ged-salesforce'],
  },
  {
    period: 'sept. 2022 – sept. 2024',
    role: 'Proxy Product Owner',
    org: 'Beekast · éditeur SaaS, Paris',
    text: 'Besoins de 180 clients traduits en user stories (backlog Jira), automatisations CRM sous Zoho, tableaux de bord SQL sous Metabase, support et MCO. Formation de 150 agents lors d’un déploiement national dans une administration belge.',
    projects: ['crm-saas-beekast'],
  },
  {
    period: 'oct. 2021 – août 2022',
    role: 'Conseiller relation client',
    org: 'Groupama Épargne Salariale · Docaposte, Paris',
    text: 'Traitement des demandes et des dossiers clients en environnement réglementé, reportings d’activité.',
    projects: [],
  },
];

export const EDUCATION: [string, string, string][] = [
  ['2026', 'Mastère Spécialisé Conseil et Management des SI', 'Institut Mines-Télécom'],
  ['2025', 'Master 1 Gestion de projet', 'INSEEC'],
  ['2023', 'Bachelor Gestion de projet web', 'INSEEC'],
  ['2021', 'DUT Techniques de commercialisation', 'IUT de Saint-Denis'],
];

export const LANGUAGES = 'Français natif · anglais courant (C1)';
