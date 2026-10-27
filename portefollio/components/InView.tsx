'use client';

import { useEffect, useRef, useState } from 'react';

// Ajoute « is-in » quand le bloc entre à l'écran (une seule fois), pour lancer ses animations CSS.
// Rendu serveur et sans JavaScript : tout est visible. Un bloc déjà à l'écran au chargement s'anime aussitôt ;
// un bloc plus bas passe en attente (« is-wait ») jusqu'à ce qu'on y arrive.
export default function InView({ as: Tag = 'div', className = '', children, ...rest }: {
  as?: 'div' | 'section' | 'ol' | 'ul';
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'' | 'is-wait' | 'is-in'>('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setState('is-in');
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.9) setState('is-wait');
    else requestAnimationFrame(() => setState('is-in'));
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setState('is-in'); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as React.ElementType;
  return <Comp ref={ref} className={`${className} ${state}`.trim()} {...rest}>{children}</Comp>;
}
