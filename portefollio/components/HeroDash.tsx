'use client';

import { useEffect, useState } from 'react';
import { CountUp, reducedMotion } from './motion';

// Faux tableau de bord de l'accueil : compteurs au chargement, puis quelques mises à jour « en direct ».
export default function HeroDash() {
  const [live, setLive] = useState(false);
  const [orders, setOrders] = useState(12);
  const [quotes, setQuotes] = useState(3);
  const [flash, setFlash] = useState<'orders' | 'quotes' | null>(null);

  useEffect(() => {
    if (!live || reducedMotion()) return;
    let step = 0;
    const id = setInterval(() => {
      step++;
      if (step % 2) {
        setOrders((o) => (o >= 19 ? 12 : o + 1));
        setFlash('orders');
      } else {
        setQuotes((q) => (q <= 1 ? 3 : q - 1));
        setFlash('quotes');
      }
      setTimeout(() => setFlash(null), 900);
    }, 3200);
    return () => clearInterval(id);
  }, [live]);

  return (
    <div className="dash">
      <div className="dash-top"><span /><span /><span /><em>Tableau de bord · exemple</em></div>
      <div className="dash-grid">
        <div className={flash === 'orders' ? 'flash' : ''}>
          <small>Commandes du jour</small>
          <strong>{live ? orders : <CountUp value={12} onDone={() => setLive(true)} />}</strong>
          <i>+{orders - 9} depuis hier</i>
        </div>
        <div className={flash === 'quotes' ? 'flash' : ''}>
          <small>Devis à relancer</small>
          <strong>{live ? quotes : <CountUp value={3} />}{flash === 'quotes' && <b className="dash-check">✓</b>}</strong>
          <i>{quotes > 1 ? 'dont 1 urgent' : 'plus rien d’urgent'}</i>
        </div>
        <div>
          <small>Planning équipe</small>
          <strong><CountUp value={5} /> / 5</strong>
          <i>tout le monde est placé</i>
        </div>
        <div>
          <small>Chiffre du mois</small>
          <strong><CountUp value={8450} duration={1500} suffix=" €" /></strong>
          <i>▲ 12 %</i>
        </div>
      </div>
      <div className="dash-chart"><span /><span /><span /><span /><span /><span /><span /></div>
    </div>
  );
}
