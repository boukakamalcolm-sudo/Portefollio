'use client';

import { useEffect, useState } from 'react';

export type NavConfig = {
  home: string;
  links: readonly (readonly [string, string])[];
  cta: readonly [string, string];
};

// liens absolus : l'en-tête sert aussi sur les pages projet
const PORTFOLIO: NavConfig = {
  home: '/',
  links: [
    ['/#projets', 'Projets'],
    ['/#construire', 'Ce que je fais'],
    ['/#methode', 'Méthode'],
  ],
  cta: ['/#devis', 'Demander un devis'],
};

// En-tête fixe : nom à gauche, liens discrets et pilule de contact à droite.
// Sur mobile, les liens s'ouvrent en plein écran.
export default function Nav({ active, config = PORTFOLIO }: { active?: string; config?: NavConfig }) {
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
      <a className="brand" href={config.home} aria-label="Malcolm, accueil">malcolm<span>.</span></a>
      <nav id="menu" className="nav-links" aria-label="Navigation principale" onClick={() => setOpen(false)}>
        {config.links.map(([href, label]) => (
          <a key={href} href={href} aria-current={active === label ? 'page' : undefined}>{label}</a>
        ))}
        <a className="nav-cta" href={config.cta[0]}>{config.cta[1]}</a>
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
