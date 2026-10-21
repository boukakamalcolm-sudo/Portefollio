import Image from 'next/image';
import { AVAILABILITY, CONTACT_EMAIL, CV_URL, LINKEDIN_URL, LOCATION, ROLE } from '@/lib/config';
import { PITCH } from '@/lib/profile';
import Clock from './Clock';
import Nav from './Nav';

// Carte d'identité : colonne fixe sur ordinateur, en-tête de page sur mobile.
// Sur l'accueil le nom est le titre principal ; ailleurs la page a son propre <h1>.
export default function IntroCard({ home, active }: { home?: boolean; active?: string }) {
  const Name = home ? 'h1' : 'p';
  return (
    <div className="intro">
      <Nav active={active} />

      <div className="intro-hero">
        <p className="badge">
          <Image src="/3d/asterisque.png" alt="" width={30} height={30} priority />
          {AVAILABILITY} · {LOCATION}
        </p>
        <Name className="intro-name">Malcolm<br />Boukaka-Massengo<span className="dot">.</span></Name>
        <p className="label accent">{ROLE}</p>
        <p className="intro-pitch">{PITCH}</p>
        <div className="actions">
          <a className="btn pill" href="/#contact">Me contacter <span aria-hidden="true">→</span></a>
          {CV_URL && <a className="link" href={CV_URL} download>Télécharger le CV</a>}
        </div>
      </div>

      <div className="intro-info">
        <Image className="intro-float" src="/3d/asterisque.png" alt="" width={132} height={132} />
        <dl>
          <div>
            <dt>Email</dt>
            <dd><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></dd>
          </div>
          {LINKEDIN_URL && (
            <div>
              <dt>Liens</dt>
              <dd><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></dd>
            </div>
          )}
          <div className="intro-where">
            <dt>Localisation</dt>
            <dd>{LOCATION}<br /><Clock /></dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
