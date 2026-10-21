'use client';

import { useEffect, useState } from 'react';

// liens absolus : la barre sert aussi sur les pages projet
const LINKS = [
  ['/#projets', 'Projets'],
  ['/#parcours', 'Parcours'],
  ['/#contact', 'Contact'],
] as const;

export default function Nav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav">
      <a className="skip" href="#contenu">Aller au contenu</a>
      <a className="brand" href="/" aria-label="Malcolm Boukaka-Massengo, accueil">MB<span>.</span></a>
      <nav id="menu" className={`nav-links${open ? ' open' : ''}`} aria-label="Navigation principale" onClick={() => setOpen(false)}>
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} className={active === label ? 'is-active' : undefined}>{label}</a>
        ))}
      </nav>
      <button
        className={`nav-toggle${open ? ' open' : ''}`}
        aria-expanded={open}
        aria-controls="menu"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        onClick={() => setOpen(!open)}
      >
        <span /><span />
      </button>
    </header>
  );
}
