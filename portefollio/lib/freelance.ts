// Contenu de la page d'accueil, adressée aux clients.

import type { Step } from './profile';

export const FREELANCE_NAME = 'Malcolm';
// adresse pro : reçoit les demandes de devis et s'affiche sur la page
export const FREELANCE_EMAIL = 'boukakamalcolm.pro@gmail.com';
export const FREELANCE_ROLE = 'Product builder';
export const FREELANCE_PITCH =
  'Je suis Malcolm, product builder. Je conçois et je construis les applications et les outils dont votre activité a besoin, du premier échange à la mise en ligne.';

// Ce que je construis : [icône de components/Icon.tsx, titre, phrase]
export const BUILDS: [string, string, string][] = [
  ['panier', 'Applications métier', 'Stock, caisse, ventes, suivi d’activité : une application web pensée pour votre façon de travailler, utilisable sur téléphone.'],
  ['carte', 'Tableaux de bord', 'Vos chiffres au même endroit, à jour et lisibles en un coup d’œil.'],
  ['engrenages', 'Automatisations', 'Relances, facturation, remontées de données : ce qui se fait à la main se fait tout seul, entre vos outils.'],
  ['ia', 'Assistants IA', 'Un assistant qui répond à partir de vos propres documents, pour les questions qui reviennent sans cesse.'],
];

// Les étapes de la méthode, racontées du point de vue du client
export const FREELANCE_METHOD: Record<Step, string> = {
  Cartographier: 'On part de votre activité : vos outils, vos habitudes et ce qui vous fait perdre du temps.',
  Simplifier: 'On garde l’essentiel, pour un outil que votre équipe utilisera vraiment.',
  Construire: 'Je développe votre application et vous la testez au fur et à mesure, sur téléphone ou sur ordinateur.',
  Ancrer: 'Mise en ligne, prise en main et suivi, pour que l’outil reste utile dans la durée.',
};

export const FREELANCE_ABOUT =
  'Avant de construire mes propres applications, j’ai piloté des projets SI au Ministère de la Culture, chez Covéa et chez Beekast. Je sais ce qui fait qu’une équipe adopte un outil, ou le laisse de côté.';

// Demande de devis en plusieurs étapes : choix proposés (vérifiés aussi côté serveur)
export const QUOTE_TYPES: [string, string][] = [
  ['panier', 'Une application métier'],
  ['carte', 'Un tableau de bord'],
  ['engrenages', 'Une automatisation'],
  ['ia', 'Un assistant IA'],
  ['asterisque', 'Autre chose'],
];
export const QUOTE_DEADLINES = ['Dès que possible', 'D’ici 1 à 3 mois', 'Plus tard', 'Je ne sais pas encore'];
