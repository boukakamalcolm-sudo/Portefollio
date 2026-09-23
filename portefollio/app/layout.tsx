import type { Metadata, Viewport } from 'next';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource-variable/inter';
import './globals.css';
import { SITE_NAME, SITE_URL } from '@/lib/config';

const title = `${SITE_NAME} · Outils sur mesure pour PME`;
const description =
  'Je transforme vos fichiers Excel et vos groupes WhatsApp en un outil simple que votre équipe utilise vraiment : stock, caisse, clients, suivi.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${SITE_NAME}` },
  description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'fr_FR', url: '/', siteName: SITE_NAME, title, description },
  twitter: { card: 'summary_large_image', title, description },
};

export const viewport: Viewport = { themeColor: '#f5efdc' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
