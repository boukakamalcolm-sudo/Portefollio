import Image from 'next/image';
import { AVAILABILITY, LOCATION } from '@/lib/config';

// Accueil : une phrase en très grand, centrée, et une invitation à faire défiler
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero-badge">
        <Image src="/3d/asterisque.png" alt="" width={28} height={28} priority />
        {AVAILABILITY} · {LOCATION}
      </p>
      <h1 id="hero-title" className="hero-title">
        <span>Moi, c’est</span> <span className="accent">Malcolm.</span>
      </h1>
      <p className="hero-role">Malcolm Boukaka-Massengo, chef de projet SI et product builder.</p>
      <a className="hero-scroll" href="#methode">
        Faites défiler pour voir<br />comment je travaille
        <span aria-hidden="true" />
      </a>
    </section>
  );
}
