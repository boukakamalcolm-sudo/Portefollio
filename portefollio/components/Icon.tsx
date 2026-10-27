import Asterisk from './Asterisk';

// Icônes plates des services et du formulaire de devis, dans le style de l'astérisque :
// traits épais arrondis, couleur héritée du texte. Les clés reprennent celles de lib/freelance.ts.
export type IconName = 'panier' | 'carte' | 'engrenages' | 'ia' | 'asterisque';

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 10, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function Icon({ name }: { name: string }) {
  switch (name as IconName) {
    // application métier : un téléphone
    case 'panier':
      return (
        <svg className="icon" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <rect x="28" y="8" width="44" height="84" rx="11" {...stroke} />
          <path d="M44 76h12" {...stroke} />
        </svg>
      );
    // tableau de bord : trois barres
    case 'carte':
      return (
        <svg className="icon" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <g fill="currentColor">
            <rect x="14" y="54" width="18" height="36" rx="5" />
            <rect x="41" y="32" width="18" height="58" rx="5" />
            <rect x="68" y="10" width="18" height="80" rx="5" />
          </g>
        </svg>
      );
    // automatisation : deux flèches qui tournent
    case 'engrenages':
      return (
        <svg className="icon" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <path d="M80 42A31 31 0 0 0 24 30" {...stroke} />
          <path d="M20 14v18h18" {...stroke} />
          <path d="M20 58a31 31 0 0 0 56 12" {...stroke} />
          <path d="M80 86V68H62" {...stroke} />
        </svg>
      );
    // assistant IA : une bulle avec une étincelle
    case 'ia':
      return (
        <svg className="icon" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <path d="M22 16h56a10 10 0 0 1 10 10v36a10 10 0 0 1-10 10H46L28 88V72h-6a10 10 0 0 1-10-10V26a10 10 0 0 1 10-10z" {...stroke} />
          <path d="M50 28l4.5 11.5L66 44l-11.5 4.5L50 60l-4.5-11.5L34 44l11.5-4.5z" fill="currentColor" />
        </svg>
      );
    default:
      return <Asterisk />;
  }
}
