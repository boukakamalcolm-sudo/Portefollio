import type { Metadata } from 'next';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource-variable/inter';
import './globals.css';

export const metadata: Metadata = {
  title: 'Malcolm Boukaka · Outils sur mesure pour PME',
  description:
    'Je transforme vos fichiers Excel et vos groupes WhatsApp en un outil simple que votre équipe utilise vraiment : stock, caisse, clients, suivi.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
