'use client';

import { useEffect, useRef, useState } from 'react';
import type { Experience } from '@/lib/profile';
import InView from './InView';

export type TimelineItem = Experience;

const MONTHS: Record<string, number> = { janv: 0, févr: 1, mars: 2, avr: 3, mai: 4, juin: 5, juil: 6, août: 7, sept: 8, oct: 9, nov: 10, déc: 11 };
const FROM = 2021;
const TO = 2027; // fin de l'axe (exclue)

// « sept. 2025 – sept. 2026 » → mois depuis janvier 2021 ; null si la période n'a pas de dates
function span(period: string): [number, number] | null {
  const m = [...period.matchAll(/([a-zéû]+)\.?\s+(\d{4})/gi)].map(([, mo, y]) => (+y - FROM) * 12 + (MONTHS[mo.toLowerCase()] ?? 0));
  return m.length === 2 ? [m[0], m[1] + 1] : null;
}

// Frise des expériences : une barre par poste, à l'échelle du temps, qui se déroule quand on arrive dessus.
// Un clic ouvre le détail (<dialog> : focus, Échap et retour du focus gérés par le navigateur).
export default function Timeline({ items }: { items: TimelineItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<TimelineItem | null>(null);
  const total = (TO - FROM) * 12;
  const years = Array.from({ length: TO - FROM }, (_, i) => FROM + i);
  // les plus récents en haut, les projets personnels (sans dates) en dernier
  const rows = [...items].sort((a, b) => (span(b.period)?.[0] ?? -1) - (span(a.period)?.[0] ?? -1));

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
  }, [open]);

  return (
    <>
      <InView className="tl">
        <div className="tl-years" aria-hidden="true">
          {years.map((y) => <span key={y}>{y}</span>)}
        </div>
        <ol className="tl-rows">
          {rows.map((x, i) => {
            const s = span(x.period);
            const style = (s
              ? { '--from': `${(s[0] / total) * 100}%`, '--to': `${(s[1] / total) * 100}%`, '--i': i }
              : { '--from': '62%', '--to': '100%', '--i': i }) as React.CSSProperties;
            return (
              <li key={x.id} className={`tl-row${s ? '' : ' is-side'}`} style={style}>
                <button className="tl-hit" onClick={() => setOpen(x)} aria-haspopup="dialog">
                  <span className="tl-meta">
                    <strong>{x.role}</strong>
                    <span>{x.org} · {x.period.toLowerCase()}</span>
                  </span>
                  <span className="tl-track" aria-hidden="true"><span className="tl-bar">{x.figure && <b>{x.figure[0]}</b>}</span></span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="label tl-hint">Cliquez sur une ligne pour le détail</p>
      </InView>

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
            <p className="label">{open.period}</p>
            <h3 id="xp-dialog-title">{open.role}</h3>
            <p className="xp-org">{open.org}{open.place && ` · ${open.place}`}</p>
            {open.figure && <p className="xp-figure"><strong>{open.figure[0]}</strong><span>{open.figure[1]}</span></p>}
            <div className="xp-story">{open.story.map((t) => <p key={t}>{t}</p>)}</div>
            <h4 className="label">Compétences</h4>
            <ul className="bubbles">{open.skills.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        )}
      </dialog>
    </>
  );
}
