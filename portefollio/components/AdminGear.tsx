'use client';

import { useEffect, useState } from 'react';

// Les pages publiques sont statiques : le statut admin est lu après chargement
export default function AdminGear() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/auth', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { admin: false }))
      .then((j) => setAdmin(!!j.admin))
      .catch(() => {});
  }, []);

  if (!admin) return null;
  return (
    <a className="gear" href="/admin" aria-label="Gérer les projets" title="Gérer les projets">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path fill="currentColor" d="M19.14 12.94c.04-.31.06-.62.06-.94s-.02-.63-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54A.48.48 0 0 0 13.92 2h-3.840a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.72 8.470a.48.48 0 0 0 .12.61l2.03 1.58c-.05.31-.07.63-.07.94s.02.63.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.620-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.48.48 0 0 0-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z" />
      </svg>
    </a>
  );
}
