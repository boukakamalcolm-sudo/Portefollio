'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { ProjectFile } from '@/lib/types';

// Écrans d'un projet en carrousel, avec leur titre et leur explication dessous.
// Un clic agrandit l'écran dans une <dialog> (focus, Échap et retour du focus gérés par le navigateur).
export default function Gallery({ screens, title }: { screens: ProjectFile[]; title: string }) {
  const track = useRef<HTMLOListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState<{ url: string; alt: string } | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const many = screens.length > 1;
  const wide = (screens[0]?.width ?? 0) > (screens[0]?.height ?? Infinity);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const slide = el?.querySelector('li');
    el?.scrollBy({ left: dir * ((slide?.clientWidth ?? 260) + 16), behavior: 'smooth' });
  };

  return (
    <>
      <div className="screens-head">
        <p className="label">{wide ? 'L’application en images' : many ? 'L’application, écran par écran' : 'Capture'}</p>
        {many && (
          <div className="xp-arrows">
            <button onClick={() => go(-1)} disabled={edges.start} aria-label="Écrans précédents">←</button>
            <button onClick={() => go(1)} disabled={edges.end} aria-label="Écrans suivants">→</button>
          </div>
        )}
      </div>
      <ol className={`screens-track${many ? '' : ' single'}${wide ? ' wide' : ''}`} ref={track} onScroll={update}>
        {screens.map((s, i) => {
          // le nom d'un fichier envoyé depuis l'admin (« IMG_123.png ») ne décrit pas l'image
          const named = s.name && !/\.\w{3,4}$/.test(s.name);
          const alt = s.title ? `${title}, écran ${s.title}` : named ? `${title}, ${s.name}` : `${title}, capture ${i + 1} sur ${screens.length}`;
          return (
            <li key={s.url}>
              <button onClick={() => { setZoom({ url: s.url, alt }); dialog.current?.showModal(); }} aria-label={`Agrandir : ${alt}`}>
                <Image
                  src={s.url}
                  alt={alt}
                  width={s.width ?? 600}
                  height={s.height ?? 640}
                  sizes={wide ? '(max-width: 640px) 86vw, 900px' : many ? '(max-width: 640px) 72vw, 260px' : '(max-width: 980px) 90vw, 50vw'}
                />
              </button>
              {s.title && <h3>{s.title}</h3>}
              {s.caption && <p>{s.caption}</p>}
            </li>
          );
        })}
      </ol>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Image agrandie"
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        onClose={() => setZoom(null)}
      >
        <button className="lightbox-close" onClick={() => dialog.current?.close()} aria-label="Fermer l’image">×</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {zoom && <img src={zoom.url} alt={zoom.alt} />}
      </dialog>
    </>
  );
}
