'use client';

import { useState } from 'react';
import { CONTACT_EMAIL } from '@/lib/config';
import { reducedMotion } from './motion';

// confettis jaunes et noirs, en CSS pur, retirés après l'animation
function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 36 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.25,
      x: (Math.random() - 0.5) * 240,
      r: Math.random() * 720 - 360,
      dark: i % 3 === 0,
    })),
  );
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          className={p.dark ? 'dark' : ''}
          style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, '--x': `${p.x}px`, '--r': `${p.r}deg` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

type State = { status: 'idle' | 'sending' | 'sent' | 'error'; error?: string };

export default function ContactForm() {
  const [state, setState] = useState<State>({ status: 'idle' });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ status: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'L’envoi a échoué.');
      form.reset();
      setState({ status: 'sent' });
    } catch (err) {
      setState({ status: 'error', error: (err as Error).message });
    }
  }

  if (state.status === 'sent') {
    return (
      <div className="contact-form sent" role="status">
        {!reducedMotion() && <Confetti />}
        <p className="label">Message envoyé</p>
        <h3>Merci, je reviens vers vous sous 48 h.</h3>
        <button className="btn-link" onClick={() => setState({ status: 'idle' })}>Envoyer un autre message</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>Nom *<input name="name" required maxLength={120} autoComplete="name" /></label>
        <label>E-mail *<input name="email" type="email" required maxLength={200} autoComplete="email" /></label>
      </div>
      <label>Entreprise<input name="company" maxLength={160} autoComplete="organization" /></label>
      <label>
        Votre besoin *
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="Ce qui vous fait perdre du temps aujourd’hui, les outils que vous utilisez…" />
      </label>
      {/* champ piège pour les robots, invisible pour les visiteurs */}
      <label className="hp" aria-hidden="true">Site web<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {state.status === 'error' && (
        <p className="form-error" role="alert">
          {state.error} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      )}
      <div className="form-actions">
        <button className="btn-primary" disabled={state.status === 'sending'}>
          {state.status === 'sending' ? 'Envoi…' : 'Envoyer mon message →'}
        </button>
        <small>Vos informations servent uniquement à vous répondre.</small>
      </div>
    </form>
  );
}
