import type { Project } from './types';

// Contenu de départ, repris du CV. Affiché tant qu'aucun projet n'a été enregistré depuis l'admin,
// et importable depuis l'admin (bouton « Importer le contenu du CV »).
export const seedProjects: Project[] = [
  {
    id: 'indicateurs-musees',
    visual: 'musee',
    title: 'Indicateurs des musées',
    subtitle: 'Un seul outil pour les chiffres d’une cinquantaine de musées',
    sector: 'Ministère de la Culture · Hauts-de-France',
    role: 'Chef de projet SI',
    period: '2025 – 2026',
    tags: ['CADRAGE', 'DONNÉES', 'DÉPLOIEMENT'],
    stack: ['BPMN', 'Modélisation de données', 'CSV', 'Jira'],
    problem:
      'Les musées de la région transmettaient leurs indicateurs chacun à sa façon : fichiers différents, définitions différentes, relances permanentes pour obtenir les chiffres. Le projet était au cœur d’un programme de rationalisation des outils des services régionaux.',
    solution: [
      'Analyse des processus de remontée des chiffres, modélisés en BPMN',
      'Modélisation des données et définition commune des indicateurs',
      'Mise en place des échanges de fichiers CSV',
      'Recette de l’outil sous Jira',
      'Guides utilisateurs et accompagnement de chaque musée jusqu’à la mise en service',
    ].join('\n'),
    result: 'Une cinquantaine de musées équipés : les indicateurs arrivent au même endroit, dans le même format.',
    files: [],
  },
  {
    id: 'ia-generative-covea',
    visual: 'ia',
    title: 'IA générative & assistant RAG',
    subtitle: 'Un assistant IA branché sur les connaissances internes',
    sector: 'Covéa · Assurance',
    role: 'Chef de projet transformation digitale',
    period: '2024 – 2025',
    tags: ['IA GÉNÉRATIVE', 'RAG', 'ADOPTION'],
    stack: ['Microsoft 365 Copilot', 'Copilot Studio', 'Power Automate'],
    problem:
      'Mettre l’IA générative au service des équipes : trouver les cas d’usage qui ont du sens, donner accès aux connaissances internes et encadrer un usage responsable des données.',
    solution: [
      'Ateliers avec les services pour identifier les cas d’usage',
      'Conception dans Copilot Studio d’un assistant IA branché sur les bases de connaissances internes (RAG) : choix et mise à jour des sources, droits d’accès',
      'Tests de fiabilité des réponses et suivi de l’usage',
      'Déploiement de Microsoft 365 Copilot et automatisations Power Automate',
      'Réseau d’ambassadeurs sur le terrain, formation à un usage responsable de l’IA et charte d’usage',
    ].join('\n'),
    result:
      'Un assistant IA alimenté par les sources internes, une charte d’usage et des équipes formées à vérifier les réponses et à protéger les données. Microsoft 365 a été déployé auprès de 550 collaborateurs.',
    files: [],
  },
  {
    id: 'marche-ya-cina',
    freelance: true,
    visual: 'panier',
    title: 'Marché ya Cina',
    subtitle: 'Stock, ventes et caisse d’un commerce, sur téléphone',
    sector: 'Projet personnel · Commerce alimentaire, Brazzaville',
    role: 'Product builder : cadrage, conception, développement assisté par IA, mise en ligne',
    period: '2026',
    status: 'En production',
    color: '#d6d4fc',
    tags: ['PRODUCT BUILDING', 'APPLI WEB', 'IA'],
    stack: ['Next.js', 'Supabase', 'Vercel', 'Claude'],
    problem:
      'Un commerce alimentaire familial à Brazzaville, tenu avec un cahier papier et un fichier Excel fragile. Le gérant, souvent à distance, n’avait pas de réponse fiable à deux questions : « combien j’ai vraiment gagné ce mois-ci ? » et « qu’est-ce que je dois racheter demain au marché ? ».',
    // une ligne par étape : affichées sous « Mon rôle » sur la page projet
    solution: [
      'Cadrage : je suis parti du cahier et de l’Excel du commerce pour comprendre comment la vendeuse et le gérant travaillent vraiment, et ce qui faussait le bénéfice (remises, arrondis, prix d’achat).',
      'Conception : deux profils dans la même application. La vendeuse saisit le cahier du soir au comptoir en quelques minutes ; le gérant consulte le lendemain matin, à distance, sa caisse, son stock et son bénéfice réel.',
      'Développement : j’ai piloté la construction en développement assisté par IA avec Claude (Next.js, Supabase, Vercel). Je définis chaque écran, je teste et je recette avant chaque mise en ligne.',
      'Données : chaque franc a une origine (soldes calculés, bon d’achat de marchandise, écarts de prix fournisseur) et chaque profil ne voit que ce qui le concerne, garanti par la base de données.',
      'Suivi : l’application est en production. Je la fais évoluer avec la famille, comme un chef de projet côté métier.',
    ].join('\n'),
    result:
      'Le cahier du soir se saisit en quelques minutes, même en cas de coupure réseau. Le lendemain matin, le gérant voit ce qui a été encaissé, ce qui manque en rayon et ce qu’il a réellement gagné, sans être sur place.',
    // couverture puis visuels de présentation (public/captures/marche-ya-cina) : le texte est dans l'image
    files: [
      { url: '/captures/marche-ya-cina/icone.png', name: 'Icône de Marché ya Cina', kind: 'image', icon: true },
      { url: '/captures/marche-ya-cina/couverture.webp', name: 'Marché ya Cina', kind: 'image', width: 1600, height: 1000 },
      { url: '/captures/marche-ya-cina/encaisse-mois.webp', name: 'Encaissé du mois, jour par jour', kind: 'image', width: 2400, height: 1350 },
      { url: '/captures/marche-ya-cina/presentation.webp', name: 'Présentation de l’application : profils, parcours, caisse et stock', kind: 'image', width: 2400, height: 1350 },
      { url: '/captures/marche-ya-cina/encaisse-jour.webp', name: 'Encaissé du jour et objectif', kind: 'image', width: 2400, height: 1350 },
    ],
  },
  {
    id: 'cartographie-si',
    visual: 'carte',
    title: 'Cartographie des outils',
    subtitle: 'Y voir clair dans les outils de 18 directions régionales',
    sector: 'Ministère de la Culture · Service du numérique',
    role: 'Chef de projet SI',
    period: '2025 – 2026',
    tags: ['ÉTUDE STRATÉGIQUE', 'CARTOGRAPHIE SI', 'RATIONALISATION'],
    stack: ['Cartographie SI', 'BPMN'],
    problem: 'Des dizaines d’outils utilisés sans vue d’ensemble, des doublons, des fichiers maison que personne ne maîtrise.',
    solution: [
      'Étude stratégique pour un programme de rationalisation et de digitalisation des outils des services régionaux',
      'Cartographie des applications et des processus de 18 directions régionales',
      'Repérage des outils utilisés hors cadre et des doublons',
    ].join('\n'),
    result:
      'Une vue d’ensemble des applications et des processus des 18 directions régionales, doublons et outils hors cadre compris : la base du programme de rationalisation.',
    files: [],
  },
  {
    id: 'ged-salesforce',
    visual: 'dossier',
    title: 'GED × Salesforce',
    subtitle: 'La gestion documentaire reliée à Salesforce par API',
    sector: 'Covéa · Assurance',
    role: 'Chef de projet transformation digitale',
    period: '2024 – 2025',
    tags: ['INTÉGRATION', 'API REST', 'RECETTE'],
    stack: ['Salesforce Service Cloud', 'API REST', 'GED'],
    problem: 'Relier la gestion électronique des documents (GED) à Salesforce Service Cloud, avec un intégrateur externe à piloter.',
    solution: ['Recueil des besoins et rédaction des spécifications', 'Suivi de l’intégrateur', 'Recette puis mise en production'].join(
      '\n',
    ),
    result: 'L’intégration entre la GED et Salesforce Service Cloud, par API REST, a été mise en production.',
    files: [],
  },
  {
    id: 'crm-saas-beekast',
    visual: 'engrenages',
    title: 'CRM automatisé & backlog produit',
    subtitle: 'Des workflows CRM et un backlog nourri par les clients',
    sector: 'Beekast · Éditeur SaaS',
    role: 'Proxy Product Owner',
    period: '2022 – 2024',
    tags: ['AUTOMATISATION', 'CRM', 'BACKLOG'],
    stack: ['Zoho CRM', 'Zoho Marketing', 'Zoho Billing', 'SQL', 'Metabase', 'Jira'],
    problem:
      'Automatiser les relances, les campagnes et la facturation des abonnements, et transformer les retours des clients en évolutions produit.',
    solution: [
      'Paramétrage de Zoho CRM, Zoho Marketing et Zoho Billing avec des workflows d’automatisation : relances, campagnes, facturation des abonnements',
      'Suivi des indicateurs dans des tableaux de bord SQL sous Metabase',
      'Recueil des besoins de 180 clients, traduits en user stories dans le backlog Jira',
      'Support, MCO et formation de 150 agents lors d’un déploiement national dans une administration belge',
    ].join('\n'),
    result:
      'Des workflows qui automatisent relances, campagnes et facturation, des indicateurs suivis sous Metabase, et les besoins de 180 clients intégrés au backlog produit.',
    files: [],
  },
];
