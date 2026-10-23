'use client';

import { useState } from 'react';
import { FREELANCE_EMAIL } from '@/lib/freelance';

type State = { status: 'idle' | 'sending' | 'sent' | 'error'; error?: string };

// Demande de devis de la page freelance, envoyée par e-mail via /api/contact
export default function QuoteForm() {
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
      <div className="quote quote-sent" role="status">
        <p className="label">Demande envoyée</p>
        <h3>Merci, je reviens vers vous très vite.</h3>
        <button className="link" onClick={() => setState({ status: 'idle' })}>Envoyer une autre demande</button>
      </div>
    );
  }

  return (
    <form id="devis" className="quote" onSubmit={submit}>
      <div className="quote-row">
        <label>Nom *<input name="name" required maxLength={120} autoComplete="name" /></label>
        <label>E-mail *<input name="email" type="email" required maxLength={200} autoComplete="email" /></label>
      </div>
      <label>Entreprise<input name="company" maxLength={160} autoComplete="organization" /></label>
      <label>
        Votre besoin *
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="Votre activité, ce qui vous fait perdre du temps aujourd’hui, les outils que vous utilisez…" />
      </label>
      {/* champ piège pour les robots, invisible pour les visiteurs */}
      <label className="quote-hp" aria-hidden="true">Site web<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {state.status === 'error' && (
        <p className="quote-error" role="alert">
          {state.error} <a href={`mailto:${FREELANCE_EMAIL}`}>{FREELANCE_EMAIL}</a>
        </p>
      )}
      <div className="quote-actions">
        <button className="btn pill" disabled={state.status === 'sending'}>
          {state.status === 'sending' ? 'Envoi…' : <>Envoyer ma demande <span aria-hidden="true">→</span></>}
        </button>
        <small>* obligatoire. Vos informations servent uniquement à vous répondre.</small>
      </div>
    </form>
  );
}
