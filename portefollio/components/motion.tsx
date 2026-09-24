'use client';

import { useEffect, useRef, useState } from 'react';

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// true dès que l'élément entre à l'écran (une seule fois)
export function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

const format = (n: number) => n.toLocaleString('fr-FR');

// Compteur de 0 à `value` quand il devient visible. Le rendu serveur affiche la valeur finale.
export function CountUp({ value, duration = 1200, suffix = '', onDone }: {
  value: number;
  duration?: number;
  suffix?: string;
  onDone?: () => void;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5);
  const [n, setN] = useState(value);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion()) {
      done.current?.();
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else done.current?.();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return <span ref={ref}>{format(n)}{suffix}</span>;
}
