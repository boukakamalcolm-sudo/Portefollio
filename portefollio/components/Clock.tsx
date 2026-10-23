'use client';

import { useEffect, useState } from 'react';

const format = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

// Heure de Paris, affichée après chargement (la page est statique)
export default function Clock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNow(format.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="clock" title="Heure à Paris">{now ?? '--:--:--'}</span>;
}
