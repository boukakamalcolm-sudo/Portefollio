'use client';

import { useEffect, useRef, useState } from 'react';
import { pad } from '@/lib/format';
import { METHOD, METHOD_TEXT, type Step } from '@/lib/profile';

// Les quatre étapes de la méthode s'allument une à une pendant le défilement (section collante).
// Sans JavaScript ou avec « réduire les animations », tout est affiché d'un coup.
// La page freelance reprend les mêmes étapes avec des phrases adressées aux clients.
export default function Method({ title = 'Ma façon de travailler', texts = METHOD_TEXT }: {
  title?: string;
  texts?: Record<Step, string>;
}) {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLive(true);
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const progress = -top / Math.max(1, height - window.innerHeight);
      setStep(Math.max(0, Math.min(METHOD.length - 1, Math.floor(progress * METHOD.length))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={ref} id="methode" className={`method${live ? ' is-live' : ''}`} aria-labelledby="methode-title">
      <div className="method-stick">
        <h2 id="methode-title" className="label">{title}</h2>
        <ol className="method-words">
          {METHOD.map((m, i) => (
            <li key={m} className={!live || i <= step ? 'is-on' : undefined} aria-current={live && i === step ? 'step' : undefined}>
              <span className="method-word"><span className="method-num" aria-hidden="true">{pad(i + 1)}</span>{m}</span>
              <p className={`method-text${!live || i === step ? ' is-on' : ''}`}>{texts[m]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
