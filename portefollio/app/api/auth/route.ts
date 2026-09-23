import { NextResponse } from 'next/server';
import { COOKIE, checkPassword, cookieOptions, createSessionValue, isAdmin } from '@/lib/auth';

// Limite les essais par IP : 5 échecs en 15 minutes, puis blocage.
// En mémoire, donc par instance serveur : complète un mot de passe long, ne le remplace pas.
const WINDOW = 15 * 60 * 1000;
const MAX_FAILS = 5;
const fails = new Map<string, { count: number; since: number }>();

function clientIp(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'inconnu';
}

function blocked(ip: string) {
  const f = fails.get(ip);
  if (!f) return false;
  if (Date.now() - f.since > WINDOW) {
    fails.delete(ip);
    return false;
  }
  return f.count >= MAX_FAILS;
}

function recordFail(ip: string) {
  const f = fails.get(ip);
  if (!f || Date.now() - f.since > WINDOW) fails.set(ip, { count: 1, since: Date.now() });
  else f.count++;
  if (fails.size > 5000) fails.clear();
}

// Statut de la session, lu par la page publique pour afficher la roue crantée
export async function GET() {
  return NextResponse.json({ admin: await isAdmin() }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (blocked(ip)) {
    return NextResponse.json({ error: 'Trop de tentatives, réessayez dans 15 minutes' }, { status: 429 });
  }
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (typeof password !== 'string' || !checkPassword(password)) {
    recordFail(ip);
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }
  fails.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, createSessionValue(), cookieOptions());
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { ...cookieOptions(), maxAge: 0 });
  return res;
}
