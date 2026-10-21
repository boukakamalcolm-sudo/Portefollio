import type { Metadata, Viewport } from 'next';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.css';
import { SITE_NAME, SITE_URL } from '@/lib/config';

const title = `${SITE_NAME} · Chef de projet SI & Product builder`;
const description =
  'Chef de projet SI et product builder à Paris : cartographie des outils et des processus, automatisation, intégration (API, données) et IA générative, du cadrage au déploiement.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${SITE_NAME}` },
  description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'fr_FR', url: '/', siteName: SITE_NAME, title, description },
  twitter: { card: 'summary_large_image', title, description },
};

export const viewport: Viewport = { themeColor: '#f7f6f2' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
