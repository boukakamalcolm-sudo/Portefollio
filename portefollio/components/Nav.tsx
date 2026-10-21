'use client';

import { useEffect, useState } from 'react';

// liens absolus : la barre sert aussi sur les pages projet
const LINKS = [
  ['/#projets', 'Projets'],
  ['/#parcours', 'Parcours'],
  ['/#competences', 'Compétences'],
] as const;

export default function Nav() {
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
        {LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        <a className="nav-cta" href="/#contact">Contact</a>
      </nav>
      <button className="nav-toggle" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
        {open ? 'Fermer' : 'Menu'}
      </button>
    </header>
  );
}
