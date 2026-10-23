'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import type { ProjectFile } from '@/lib/types';
import Gallery from './Gallery';

export type Case = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  // icône de l'application ou objet 3D du projet
  icon: string;
  screens: ProjectFile[];
  bg: { className: string; style?: React.CSSProperties };
  problem: string;
  steps: string[];
  result: string;
};

// Réalisations de la page freelance : une pastille par projet au-dessus du titre (onglets),
// une pastille de plus à chaque projet coché « page freelance » dans l'admin.
export default function Cases({ cases }: { cases: Case[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const c = cases[active];

  // flèches gauche et droite entre les pastilles, comme des onglets
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + cases.length) % cases.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className="section" id="realisation" aria-labelledby="realisation-title">
      <div className="case-tabs" role="tablist" aria-label="Réalisations">
        {cases.map((x, i) => (
          <button
            key={x.id}
            ref={(el) => { tabs.current[i] = el; }}
            id={`case-tab-${x.id}`}
            className="case-tab"
            role="tab"
            aria-selected={i === active}
            aria-controls="case-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <Image src={x.icon} alt="" width={64} height={64} />
            {x.title}
          </button>
        ))}
      </div>

      <div id="case-panel" className="case-panel" role="tabpanel" aria-labelledby={`case-tab-${c.id}`} key={c.id}>
        <header className="section-head">
          <h2 id="realisation-title" className="title">{c.title}{/[.!?]$/.test(c.title) ? '' : '.'}{c.subtitle && <span> {c.subtitle}</span>}</h2>
          {c.status && <p className="label section-count">{c.status}</p>}
        </header>
        <div className={`stage ${c.bg.className}`} style={c.bg.style}>
          {c.screens.length > 0
            ? <Gallery screens={c.screens} title={c.title} />
            : <Image className="stage-3d" src={c.icon} alt="" width={640} height={640} sizes="360px" />}
        </div>
        <div className="case-story">
          {c.problem && <section><h3 className="label">Le besoin</h3><p>{c.problem}</p></section>}
          {c.steps.length > 0 && (
            <section>
              <h3 className="label">Ce que j’ai construit</h3>
              <ol className="steps">{c.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            </section>
          )}
          {c.result && <section><h3 className="label">Le résultat</h3><p>{c.result}</p></section>}
        </div>
      </div>
    </section>
  );
}
