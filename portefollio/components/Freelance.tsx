import Image from 'next/image';
import type { Project } from '@/lib/types';
import { LINKEDIN_URL, LOCATION } from '@/lib/config';
import { lines } from '@/lib/format';
import { BUILDS, FREELANCE_ABOUT, FREELANCE_EMAIL, FREELANCE_METHOD, FREELANCE_NAME, FREELANCE_PITCH, FREELANCE_ROLE } from '@/lib/freelance';
import { onFreelance, projectMedia, visualSrc } from '@/lib/visuals';
import Asterisk from './Asterisk';
import Cases, { type Case } from './Cases';
import Method from './Method';
import QuoteForm from './QuoteForm';
import { visualStyle } from './ProjectCard';
import Shell from './Shell';

// liens internes à la page uniquement : rien ne renvoie vers le portfolio
const NAV = {
  home: '#contenu',
  links: [
    ['#construire', 'Ce que je fais'],
    ['#realisation', 'Réalisations'],
    ['#methode', 'Méthode'],
  ],
  cta: ['#devis', 'Demander un devis'],
} as const;

export default function Freelance({ projects }: { projects: Project[] }) {
  // projets cochés « page freelance » dans l'admin, dans l'ordre du portfolio
  const cases: Case[] = projects.filter(onFreelance).map((p, i) => {
    const media = projectMedia(p);
    return {
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      status: media.status,
      icon: media.icon ?? visualSrc(p),
      screens: media.screens,
      bg: visualStyle(media.color, i),
      problem: p.problem,
      steps: lines(p.solution),
      result: p.result,
    };
  });

  return (
    <Shell nav={NAV} owner={FREELANCE_NAME} email={FREELANCE_EMAIL} theme="da-rouge">
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
            {cases.length > 0 && <a className="btn pill ghost" href="#realisation">Voir une réalisation</a>}
          </div>
        </div>
      </section>

      <section className="section" id="construire" aria-labelledby="construire-title">
        <header className="section-head reveal">
          <h2 id="construire-title" className="title">Ce que je construis.<span> Des outils qui collent à votre activité.</span></h2>
        </header>
        <ul className="builds">
          {BUILDS.map(([, title, text]) => (
            <li key={title} className="reveal">
              <span className="build-icon"><Asterisk /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {cases.length > 0 && <Cases cases={cases} />}

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
