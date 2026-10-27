// Astérisque plat de la page freelance : trois barres arrondies, couleur héritée du texte (currentColor).
// `spin` le fait tourner lentement en continu (coupé avec « réduire les animations »).
export default function Asterisk({ className = '', spin = false }: { className?: string; spin?: boolean }) {
  return (
    <svg
      className={`asterisk${spin ? ' is-spinning' : ''}${className ? ` ${className}` : ''}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        <rect x="40" y="2" width="20" height="96" rx="5" />
        <rect x="40" y="2" width="20" height="96" rx="5" transform="rotate(60 50 50)" />
        <rect x="40" y="2" width="20" height="96" rx="5" transform="rotate(120 50 50)" />
      </g>
    </svg>
  );
}
