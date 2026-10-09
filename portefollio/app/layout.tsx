import type { Metadata, Viewport } from 'next';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.css';
import { SITE_NAME, SITE_URL } from '@/lib/config';

const title = `${SITE_NAME} · Product Manager & Product Owner`;
const description =
  'Portfolio de Malcolm Boukaka-Massengo : Product Management, Product Ownership, discovery, priorisation, delivery et transformation des organisations.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${SITE_NAME}` },
  description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'fr_FR', url: '/', siteName: SITE_NAME, title, description },
  twitter: { card: 'summary_large_image', title, description },
};

export const viewport: Viewport = { themeColor: '#f5f4ef' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        {/* active les animations seulement si le JavaScript tourne (sinon tout reste visible) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
