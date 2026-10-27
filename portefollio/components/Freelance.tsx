import Image from 'next/image';
import { onFreelance } from '@/lib/visuals';
import type { Project } from '@/lib/types';
import { LINKEDIN_URL, LOCATION } from '@/lib/config';
import { BUILDS, FREELANCE_ABOUT, FREELANCE_EMAIL, FREELANCE_METHOD, FREELANCE_NAME, FREELANCE_PITCH, FREELANCE_ROLE } from '@/lib/freelance';
import Asterisk from './Asterisk';
import Icon from './Icon';
import Method from './Method';
import ProjectStrip from './ProjectStrip';
import QuoteForm from './QuoteForm';
import Shell from './Shell';

// Page d'accueil : offre product builder, projets (une page chacun), méthode, demande de devis.
// Le parcours et les missions en entreprise sont sur /parcours (lien dans l'en-tête).
export default function Freelance({ projects: all }: { projects: Project[] }) {
  // réalisations pour des clients ; les missions en entreprise sont sur /parcours
  const projects = all.filter(onFreelance);
  return (
    <Shell owner={FREELANCE_NAME} email={FREELANCE_EMAIL}>
      <section className="hero" aria-labelledby="hero-title">
        <p className="hero-badge">
          <Asterisk />
          {FREELANCE_ROLE} · {LOCATION}
        </p>
        <div className="hero-stack">
          <Asterisk spin className="hero-ast" />
          {/* titre en escalier : chaque ligne a son propre retrait */}
          <h1 id="hero-title" className="hero-title">
            <span>Votre outil,</span> <span className="accent">sur mesure.</span>
          </h1>
        </div>
        <div className="hero-foot">
          <p className="hero-role">{FREELANCE_PITCH}</p>
          <div className="actions hero-actions">
            <a className="btn pill" href="#devis">Demander un devis <span aria-hidden="true">→</span></a>
            {projects.length > 0 && <a className="btn pill ghost" href="#projets">Voir les projets</a>}
          </div>
        </div>
      </section>

      <ProjectStrip projects={projects} />

      <section className="section" id="construire" aria-labelledby="construire-title">
        <header className="section-head reveal">
          <h2 id="construire-title" className="title">Ce que je construis.<span> Des outils qui collent à votre activité.</span></h2>
        </header>
        <ul className="builds">
          {BUILDS.map(([icon, title, text]) => (
            <li key={title} className="reveal">
              <span className="build-icon"><Icon name={icon} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <Method title="Comment on travaille ensemble" texts={FREELANCE_METHOD} />

      <section className="section" aria-labelledby="regard-title">
        <div className="about reveal">
          <div className="portrait">
            <Image src="/malcolm.jpg" alt="Portrait de Malcolm" width={552} height={552} sizes="(max-width: 640px) 112px, 180px" />
          </div>
          <div className="about-text">
            <h2 id="regard-title" className="title">Un regard projet.<span> Pas seulement du code.</span></h2>
            <p>{FREELANCE_ABOUT}</p>
          </div>
        </div>
      </section>

      <section className="section contact" id="contact" aria-labelledby="contact-title">
        <Asterisk spin className="contact-3d" />
        <h2 id="contact-title" className="contact-title reveal">Un projet&nbsp;?<span className="accent"> Parlons-en.</span></h2>
        <p className="contact-sub reveal">Chaque projet est sur devis, après un premier échange pour comprendre votre besoin.</p>
        <QuoteForm />
        <p className="contact-alt">
          Ou écrivez-moi directement : <a className="link" href={`mailto:${FREELANCE_EMAIL}`}>{FREELANCE_EMAIL}</a>
          {LINKEDIN_URL && <> · <a className="link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></>}
        </p>
      </section>
    </Shell>
  );
}
