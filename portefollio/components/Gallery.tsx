'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import type { ProjectFile } from '@/lib/types';

// Captures d'un projet, agrandies dans une <dialog> (focus, Échap et retour du focus gérés par le navigateur)
export default function Gallery({ images, title }: { images: ProjectFile[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState<{ url: string; alt: string } | null>(null);
  const single = images.length === 1;

  return (
    <>
      <div className={`gallery${single ? ' single' : ''}`}>
        {images.map((f, i) => {
          const alt = `${title}, capture ${i + 1} sur ${images.length}`;
          return (
            <button
              key={f.url}
              onClick={() => { setZoom({ url: f.url, alt }); dialog.current?.showModal(); }}
              aria-label={`Agrandir : ${alt}`}
            >
              <Image src={f.url} alt={alt} width={1200} height={800} sizes={single ? '(max-width: 1300px) 90vw, 1150px' : '(max-width: 900px) 90vw, 400px'} />
            </button>
          );
        })}
      </div>
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
