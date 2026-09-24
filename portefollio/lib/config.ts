export const SITE_NAME = 'Malcolm Boukaka';
export const LEGAL_NAME = 'Malcolm Boukaka-Massengo';
export const CONTACT_EMAIL = 'boukakamalcolm@gmail.com';

// URL publique du site (Vercel > Settings > Environment Variables : NEXT_PUBLIC_SITE_URL).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
).replace(/\/$/, '');

// Laisser vide pour masquer le lien.
export const LINKEDIN_URL = 'https://www.linkedin.com/in/malcolm-b-401a35178/';
// Lien de prise de rendez-vous (Calendly, Cal.com…). Vide : seul le mail est proposé.
export const BOOKING_URL = '';

// Mentions légales : à compléter avec les informations de l'entreprise.
export const LEGAL = {
  status: '', // ex. « Entrepreneur individuel (micro-entreprise) »
  siret: '', // ex. « 123 456 789 00012 »
  address: '', // adresse de domiciliation
};
