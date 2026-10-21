import { readFile } from 'fs/promises';
import { join } from 'path';
import { ImageResponse } from 'next/og';

export const alt = 'Malcolm Boukaka-Massengo · Chef de projet SI & Product builder';
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
  const label = { fontFamily: 'Mono', fontSize: 20, letterSpacing: 1.5 } as const;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#151514', fontFamily: 'Outfit', color: '#f4f3ee' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 64px' }}>
          <span style={{ ...label, color: '#e5764d' }}>CHEF DE PROJET SI · PRODUCT BUILDER</span>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 86, lineHeight: 1, letterSpacing: -3.5 }}>
            <span>Malcolm</span>
            <div style={{ display: 'flex' }}>
              <span>Boukaka-Massengo</span>
              <span style={{ color: '#e5764d' }}>.</span>
            </div>
            <div style={{ width: 120, height: 6, background: '#e5764d', marginTop: 34 }} />
          </div>
          <span style={{ fontSize: 30, color: '#a9a8a1', lineHeight: 1.35 }}>
            Processus, automatisation, intégration et IA, du cadrage au déploiement.
          </span>
        </div>
        <div style={{ width: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, background: '#1d1d1b' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc} width={230} height={230} style={{ borderRadius: 115 }} alt="" />
          <span style={{ ...label, fontSize: 17, color: '#f4f3ee' }}>PARIS · DISPONIBLE</span>
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
