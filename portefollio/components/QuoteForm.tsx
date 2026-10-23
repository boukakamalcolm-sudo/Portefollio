'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FREELANCE_EMAIL, QUOTE_DEADLINES, QUOTE_TYPES } from '@/lib/freelance';

// espace insécable avant « ? » : le point d'interrogation ne part jamais seul à la ligne
const STEPS = [
  'Qu’aimeriez-vous construire\u00a0?',
  'Parlez-moi de votre besoin',
  'Pour quand\u00a0?',
  'Comment vous répondre\u00a0?',
];

const EMPTY = { type: '', message: '', deadline: '', name: '', email: '', company: '', website: '' };

type Status = { status: 'idle' | 'sending' | 'sent' | 'error'; error?: string };

// Demande de devis en plusieurs étapes, une question par écran, envoyée par e-mail via /api/contact.
// Chaque étape est vérifiée par le navigateur (champs requis) avant de passer à la suivante.
export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [state, setState] = useState<Status>({ status: 'idle' });
  const title = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const last = step === STEPS.length - 1;

  // à chaque changement d'étape, le focus va sur la question (annoncée par les lecteurs d'écran)
  useEffect(() => {
    if (moved.current) title.current?.focus();
    moved.current = true;
  }, [step, state.status === 'sent']);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    if (!last) return setStep(step + 1);
    setState({ status: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'L’envoi a échoué.');
      setState({ status: 'sent' });
    } catch (err) {
      setState({ status: 'error', error: (err as Error).message });
    }
  }

  if (state.status === 'sent') {
    return (
      <div className="quote quote-sent" role="status">
        <Image src="/3d/asterisque.png" alt="" width={120} height={120} />
        <h3 ref={title} tabIndex={-1}>Merci, je reviens vers vous très vite.</h3>
        <p>Votre demande est bien partie. Je vous réponds à {data.email}.</p>
        <button className="link" onClick={() => { setData(EMPTY); setStep(0); setState({ status: 'idle' }); }}>
          Faire une autre demande
        </button>
      </div>
    );
  }

  return (
    <form id="devis" className="quote" onSubmit={submit}>
      <div className="quote-progress" aria-hidden="true">
        {STEPS.map((s, i) => <span key={s} className={i <= step ? 'is-done' : undefined} />)}
      </div>
      <p className="label">Étape {step + 1} sur {STEPS.length}</p>
      <h3 ref={title} tabIndex={-1} className="quote-question">{STEPS[step]}</h3>

      <div className="quote-step" key={step}>
        {step === 0 && (
          <fieldset className="quote-choices types">
            <legend className="sr-only">{STEPS[0]}</legend>
            {QUOTE_TYPES.map(([visual, label]) => (
              <label key={label} className="quote-choice">
                <input type="radio" name="type" value={label} required checked={data.type === label} onChange={set('type')} />
                <Image src={`/3d/${visual}.png`} alt="" width={120} height={120} />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
        )}

        {step === 1 && (
          <label className="quote-field">
            <span className="sr-only">{STEPS[1]}</span>
            <textarea
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={6}
              value={data.message}
              onChange={set('message')}
              placeholder="Votre activité, ce qui vous fait perdre du temps aujourd’hui, les outils que vous utilisez…"
            />
          </label>
        )}

        {step === 2 && (
          <fieldset className="quote-choices">
            <legend className="sr-only">{STEPS[2]}</legend>
            {QUOTE_DEADLINES.map((label) => (
              <label key={label} className="quote-choice">
                <input type="radio" name="deadline" value={label} required checked={data.deadline === label} onChange={set('deadline')} />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
        )}

        {step === 3 && (
          <div className="quote-fields">
            <div className="quote-row">
              <label className="quote-field">Nom *<input name="name" required maxLength={120} autoComplete="name" value={data.name} onChange={set('name')} /></label>
              <label className="quote-field">E-mail *<input name="email" type="email" required maxLength={200} autoComplete="email" value={data.email} onChange={set('email')} /></label>
            </div>
            <label className="quote-field">Entreprise<input name="company" maxLength={160} autoComplete="organization" value={data.company} onChange={set('company')} /></label>
            {/* champ piège pour les robots, invisible pour les visiteurs */}
            <label className="quote-hp" aria-hidden="true">Site web<input name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={set('website')} /></label>
          </div>
        )}
      </div>

      {state.status === 'error' && (
        <p className="quote-error" role="alert">
          {state.error} <a href={`mailto:${FREELANCE_EMAIL}`}>{FREELANCE_EMAIL}</a>
        </p>
      )}

      <div className="quote-actions">
        {step > 0 && <button type="button" className="quote-back" onClick={() => setStep(step - 1)}>← Retour</button>}
        <button className="btn pill" disabled={state.status === 'sending'}>
          {last
            ? (state.status === 'sending' ? 'Envoi…' : <>Envoyer ma demande <span aria-hidden="true">→</span></>)
            : <>Continuer <span aria-hidden="true">→</span></>}
        </button>
      </div>
      {last && <small className="quote-note">* obligatoire. Vos informations servent uniquement à vous répondre.</small>}
    </form>
  );
}
