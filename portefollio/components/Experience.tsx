'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { pad } from '@/lib/format';
import { METHOD, type Experience as Xp } from '@/lib/profile';

export type XpCard = Xp & { logo: string; related: { title: string; href: string }[] };

// Expériences en cartes horizontales sur une frise ; chaque carte s'ouvre dans une fenêtre de détail
// (<dialog> : focus, Échap et retour du focus gérés par le navigateur)
export default function Experience({ items, education, languages }: {
  items: XpCard[];
  education: [string, string, string][];
  languages: string;
}) {
  const track = useRef<HTMLOListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<XpCard | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
  }, [open]);

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
    const card = el?.querySelector('li');
    el?.scrollBy({ left: dir * ((card?.clientWidth ?? 280) + 16), behavior: 'smooth' });
  };

  return (
    <>
      <div className="xp-nav">
        <p className="label">Expériences · cliquez pour le détail</p>
        <div className="xp-arrows">
          <button onClick={() => go(-1)} disabled={edges.start} aria-label="Expériences précédentes">←</button>
          <button onClick={() => go(1)} disabled={edges.end} aria-label="Expériences suivantes">→</button>
        </div>
      </div>

      <ol className="xp-track" ref={track} onScroll={update}>
        {items.map((x, i) => (
          <li key={x.id} className={`xp-card tone-${i % 3}`}>
            <Image className="xp-logo" src={x.logo} alt="" width={160} height={160} />
            <p className="label">{x.period}</p>
            <h3>{x.role}</h3>
            <p className="xp-org">{x.org}</p>
            {x.figure
              ? <p className="xp-figure"><strong>{x.figure[0]}</strong><span>{x.figure[1]}</span></p>
              : <p className="xp-summary">{x.summary}</p>}
            <ul className="bubbles">{x.skills.slice(0, 3).map((s) => <li key={s}>{s}</li>)}</ul>
            {/* le bouton couvre toute la carte (voir .xp-open::after) */}
            <button className="xp-open" onClick={() => setOpen(x)} aria-haspopup="dialog">
              Voir le détail <span aria-hidden="true">+</span>
            </button>
          </li>
        ))}
        <li className="xp-card edu-card">
          <p className="label">Formation</p>
          <ul className="edu-list">
            {education.map(([year, degree, school]) => (
              <li key={degree}><span className="label">{year}</span><span><strong>{degree}</strong>{school}</span></li>
            ))}
          </ul>
          <p className="edu-lang"><span className="label">Langues</span>{languages}</p>
        </li>
      </ol>

      <dialog
        ref={dialog}
        className="xp-dialog"
        aria-labelledby="xp-dialog-title"
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      >
        {open && (
          <div className="xp-dialog-body">
            <button className="xp-close" onClick={() => dialog.current?.close()} aria-label="Fermer">×</button>
            <Image className="xp-dialog-logo" src={open.logo} alt="" width={160} height={160} />
            <p className="label">{open.period}</p>
            <h3 id="xp-dialog-title">{open.role}</h3>
            <p className="xp-org">{open.org}{open.place && ` · ${open.place}`}</p>
            <p className="xp-dialog-summary">{open.summary}</p>

            {open.steps.length > 0 && (
              <>
                <h4 className="label">Ma façon de travailler</h4>
                <ol className="xp-steps">
                  {METHOD.map((step, i) => {
                    const done = open.steps.find(([k]) => k === step);
                    return done && (
                      <li key={step}>
                        <span className="xp-step">{pad(i + 1)} · {step}</span>
                        <p>{done[1]}</p>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}

            <h4 className="label">Compétences</h4>
            <ul className="bubbles">{open.skills.map((s) => <li key={s}>{s}</li>)}</ul>

            {open.related.length > 0 && (
              <p className="xp-links">
                {open.related.map((p) => <a key={p.href} className="link" href={p.href}>{p.title} →</a>)}
              </p>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
