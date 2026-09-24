'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = '/#work';
        return;
      }
      const json = await res.json().catch(() => ({}));
      setError(json.error || 'Mot de passe incorrect');
    } catch {
      setError('Connexion impossible, réessayez');
    }
    setLoading(false);
  }

  return (
    <main className="login">
      <form onSubmit={submit} className="login-box">
        <a href="/" className="brand">MB<span>.</span></a>
        <h1>Espace<br /><em>admin</em></h1>
        <label htmlFor="pw">Mot de passe</label>
        <input id="pw" type="password" autoFocus autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn" disabled={loading || !password}>{loading ? 'Connexion…' : 'Se connecter'}</button>
      </form>
    </main>
  );
}
