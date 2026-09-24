import { readFile } from 'fs/promises';
import { join } from 'path';
import { ImageResponse } from 'next/og';

export const alt = 'Malcolm Boukaka · Outils sur mesure pour PME';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const font = (file: string) => readFile(join(process.cwd(), 'node_modules/@fontsource', file));

export default async function OgImage() {
  const [outfit, mono, photo] = await Promise.all([
    font('outfit/files/outfit-latin-500-normal.woff'),
    font('ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff'),
    readFile(join(process.cwd(), 'public/malcolm.jpg')),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString('base64')}`;
  const label = { fontFamily: 'Mono', fontSize: 20, letterSpacing: 1, color: '#6b6763' } as const;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#f4f2f1', fontFamily: 'Outfit', color: '#2b2b2b' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px 60px', borderRight: '1px solid #cfc9c3' }}>
          <span style={label}>OUTILS SUR MESURE POUR PME</span>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 104, lineHeight: 1, letterSpacing: -4 }}>
            <span>Moins d’Excel.</span>
            <div style={{ display: 'flex' }}>
              <span>Plus de&nbsp;</span>
              <span style={{ background: '#feffa7', padding: '0 8px' }}>temps.</span>
            </div>
          </div>
          <span style={{ fontSize: 28, color: '#494949' }}>Devis, commandes, plannings, suivi clients.</span>
        </div>
        <div style={{ width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, background: '#feffa7' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc} width={250} height={250} style={{ borderRadius: 125, border: '1px solid #2b2b2b', filter: 'grayscale(1)' }} alt="" />
          <span style={{ ...label, color: '#2b2b2b' }}>PAPIER → EXCEL → OUTIL</span>
          <span style={{ fontSize: 26 }}>Malcolm Boukaka</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Outfit', data: outfit, weight: 500, style: 'normal' },
        { name: 'Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );
}
