import { readFile } from 'fs/promises';
import { join } from 'path';
import { ImageResponse } from 'next/og';

export const alt = 'Malcolm Boukaka · Outils sur mesure pour PME';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const font = await readFile(
    join(process.cwd(), 'node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff'),
  );
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#f5efdc', color: '#ad180e', padding: '64px 72px', fontFamily: 'Barlow' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: 4 }}>
          <span>OUTILS SUR MESURE POUR PME</span>
          <span>MALCOLM BOUKAKA</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 170, fontWeight: 800, lineHeight: 0.82, letterSpacing: -3 }}>
          <span>MOINS D’EXCEL.</span>
          <span style={{ color: '#151313' }}>PLUS DE TEMPS.</span>
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#151313', maxWidth: 900 }}>
          Stock, caisse, clients, suivi : un outil simple que votre équipe utilise vraiment.
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Barlow', data: font, weight: 800, style: 'normal' }] },
  );
}
