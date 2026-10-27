import type { Metadata, Viewport } from 'next';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/archivo/500.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/700.css';
import '@fontsource/archivo/800.css';
import './globals.css';
import { SITE_URL } from '@/lib/config';
import { FREELANCE_NAME, FREELANCE_PITCH, FREELANCE_ROLE } from '@/lib/freelance';

const title = `${FREELANCE_NAME} · ${FREELANCE_ROLE}`;
const description = FREELANCE_PITCH;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${FREELANCE_NAME}` },
  description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'fr_FR', url: '/', siteName: FREELANCE_NAME, title, description },
  twitter: { card: 'summary_large_image', title, description },
};

// barre du navigateur mobile aux couleurs du site
export const viewport: Viewport = { themeColor: '#dc1230', colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
