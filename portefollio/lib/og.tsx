import { readFile } from 'fs/promises';
import { join } from 'path';
import { ImageResponse } from 'next/og';

export const shareSize = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), 'node_modules/@fontsource', file));

// Image de partage : libellé, nom en grand, accroche, et la photo à droite
export async function shareImage({ label: kicker, name, tagline, side }: {
  label: string;
  name: string[];
  tagline: string;
  side: string;
}) {
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
          <span style={{ ...label, color: '#e5764d' }}>{kicker}</span>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 86, lineHeight: 1, letterSpacing: -3.5 }}>
            {name.map((line, i) => (
              <div key={line} style={{ display: 'flex' }}>
                <span>{line}</span>
                {i === name.length - 1 && <span style={{ color: '#e5764d' }}>.</span>}
              </div>
            ))}
            <div style={{ width: 120, height: 6, background: '#e5764d', marginTop: 34 }} />
          </div>
          <span style={{ fontSize: 30, color: '#a9a8a1', lineHeight: 1.35 }}>{tagline}</span>
        </div>
        <div style={{ width: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, background: '#1d1d1b' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc} width={230} height={230} style={{ borderRadius: 115 }} alt="" />
          <span style={{ ...label, fontSize: 17, color: '#f4f3ee' }}>{side}</span>
        </div>
      </div>
    ),
    {
      ...shareSize,
      fonts: [
        { name: 'Outfit', data: outfit, weight: 500, style: 'normal' },
        { name: 'Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );
}
