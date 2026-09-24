import { NextResponse } from 'next/server';
import { CONTACT_EMAIL } from '@/lib/config';

// Sans domaine vérifié sur Resend, l'expéditeur doit être onboarding@resend.dev
// et le destinataire l'adresse du compte Resend.
const FROM = process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>';

// 5 messages par heure et par IP, en mémoire (par instance serveur)
const WINDOW = 60 * 60 * 1000;
const MAX = 5;
const sent = new Map<string, { count: number; since: number }>();

function allow(ip: string) {
  const now = Date.now();
  const s = sent.get(ip);
  if (!s || now - s.since > WINDOW) {
    if (sent.size > 5000) sent.clear();
    sent.set(ip, { count: 1, since: now });
    return true;
  }
  return ++s.count <= MAX;
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });

  // champ piège invisible : rempli uniquement par les robots
  if (str(body.website, 200)) return NextResponse.json({ ok: true });

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const company = str(body.company, 160);
  const message = str(body.message, 5000);
  if (!name || !EMAIL.test(email) || message.length < 10) {
    return NextResponse.json({ error: 'Merci de remplir votre nom, un e-mail valide et quelques mots sur votre besoin.' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'inconnu';
  if (!allow(ip)) return NextResponse.json({ error: 'Trop de messages envoyés, réessayez plus tard.' }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: 'Formulaire indisponible pour le moment.' }, { status: 503 });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [CONTACT_EMAIL],
      reply_to: email,
      subject: `Nouveau contact : ${name}${company ? ` (${company})` : ''}`,
      text: [`Nom : ${name}`, `E-mail : ${email}`, `Entreprise : ${company || '—'}`, '', message].join('\n'),
    }),
  }).catch(() => null);

  if (!res?.ok) {
    console.error('Resend', res?.status, await res?.text().catch(() => ''));
    return NextResponse.json({ error: 'L’envoi a échoué. Écrivez-moi directement par e-mail.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
