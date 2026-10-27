import type { Metadata, Viewport } from 'next';
// police de la DA rouge, chargée uniquement sur cette page
import '@fontsource/archivo/500.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/700.css';
import '@fontsource/archivo/800.css';
import Freelance from '@/components/Freelance';
import { FREELANCE_NAME, FREELANCE_PITCH, FREELANCE_ROLE } from '@/lib/freelance';
import { getProjects } from '@/lib/store';

// Page à lien discret : reliée nulle part, absente du plan du site et non indexée.
// Elle n'est pas non plus citée dans robots.txt, qui est public et révélerait son adresse.
const title = `${FREELANCE_NAME} · ${FREELANCE_ROLE}`;

export const metadata: Metadata = {
  title: { absolute: title },
  description: FREELANCE_PITCH,
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: { type: 'website', locale: 'fr_FR', url: '/freelance', siteName: FREELANCE_NAME, title, description: FREELANCE_PITCH },
  twitter: { card: 'summary_large_image', title, description: FREELANCE_PITCH },
};

// barre du navigateur mobile aux couleurs de la page
export const viewport: Viewport = { themeColor: '#dc1230', colorScheme: 'light' };

export const revalidate = 3600;

export default async function Page() {
  return <Freelance projects={await getProjects()} />;
}
