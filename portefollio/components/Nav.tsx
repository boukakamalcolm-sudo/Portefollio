'use client';

import { useEffect, useState } from 'react';

// liens absolus : l'en-tête sert aussi sur les pages projet
const LINKS = [
  ['/#projets', 'Projets'],
  ['/#methode', 'Méthode'],
  ['/#parcours', 'Parcours'],
] as const;

// En-tête fixe : nom à gauche, liens discrets et pilule de contact à droite.
// Sur mobile, les liens s'ouvrent en plein écran.
export default function Nav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav${open ? ' is-open' : ''}`}>
      <a className="skip" href="#contenu">Aller au contenu</a>
      <a className="brand" href="/" aria-label="Malcolm Boukaka-Massengo, accueil">malcolm<span>.</span></a>
      <nav id="menu" className="nav-links" aria-label="Navigation principale" onClick={() => setOpen(false)}>
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} aria-current={active === label ? 'page' : undefined}>{label}</a>
        ))}
        <a className="nav-cta" href="/#contact">Me contacter</a>
      </nav>
      <button
        className="nav-toggle"
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
