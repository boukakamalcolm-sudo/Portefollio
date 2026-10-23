import Image from 'next/image';
import type { Project } from '@/lib/types';
import { LINKEDIN_URL, LOCATION } from '@/lib/config';
import { lines } from '@/lib/format';
import { BUILDS, FREELANCE_ABOUT, FREELANCE_CASE, FREELANCE_EMAIL, FREELANCE_METHOD, FREELANCE_NAME, FREELANCE_PITCH, FREELANCE_ROLE } from '@/lib/freelance';
import { projectMedia, seedFor } from '@/lib/visuals';
import Gallery from './Gallery';
import Method from './Method';
import QuoteForm from './QuoteForm';
import { visualStyle } from './ProjectCard';
import Shell from './Shell';

// liens internes à la page uniquement : rien ne renvoie vers le portfolio
const NAV = {
  home: '#contenu',
  links: [
    ['#construire', 'Ce que je fais'],
    ['#realisation', 'Réalisation'],
    ['#methode', 'Méthode'],
  ],
  cta: ['#devis', 'Demander un devis'],
} as const;

export default function Freelance({ projects }: { projects: Project[] }) {
  const featured = projects.find((p) => p.id === FREELANCE_CASE || seedFor(p)?.id === FREELANCE_CASE);
  const media = featured && projectMedia(featured);
  const bg = visualStyle(media?.color ?? '', 0);
  const steps = featured ? lines(featured.solution) : [];

  return (
    <Shell nav={NAV} owner={FREELANCE_NAME} email={FREELANCE_EMAIL}>
      <section className="hero" aria-labelledby="hero-title">
        <p className="hero-badge">
          <Image src="/3d/asterisque.png" alt="" width={28} height={28} priority />
          {FREELANCE_ROLE} · {LOCATION}
        </p>
        <h1 id="hero-title" className="hero-title">
          <span>Votre outil,</span> <span className="accent">sur mesure.</span>
        </h1>
        <p className="hero-role">{FREELANCE_PITCH}</p>
        <div className="actions hero-actions">
          <a className="btn pill" href="#devis">Demander un devis <span aria-hidden="true">→</span></a>
          {featured && <a className="btn pill ghost" href="#realisation">Voir une réalisation</a>}
        </div>
      </section>

      <section className="section" id="construire" aria-labelledby="construire-title">
        <header className="section-head reveal">
          <h2 id="construire-title" className="title">Ce que je construis.<span> Des outils qui collent à votre activité.</span></h2>
        </header>
        <ul className="builds">
          {BUILDS.map(([visual, title, text]) => (
            <li key={title} className="reveal">
              <Image src={`/3d/${visual}.png`} alt="" width={160} height={160} />
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {featured && media && (
        <section className="section" id="realisation" aria-labelledby="realisation-title">
          <header className="section-head reveal">
            <h2 id="realisation-title" className="title">{featured.title}.<span> {featured.subtitle}</span></h2>
            {media.status && <p className="label section-count">{media.status}</p>}
          </header>
          <div className={`stage ${bg.className}`} style={bg.style}>
            {media.screens.length > 0
              ? <Gallery screens={media.screens} title={featured.title} />
              : <Image className="stage-3d" src="/3d/panier.png" alt="" width={640} height={640} sizes="360px" />}
          </div>
          <div className="case-story">
            {featured.problem && <section className="reveal"><h3 className="label">Le besoin</h3><p>{featured.problem}</p></section>}
            {steps.length > 0 && (
              <section className="reveal">
                <h3 className="label">Ce que j’ai construit</h3>
                <ol className="steps">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
              </section>
            )}
            {featured.result && <section className="reveal"><h3 className="label">Le résultat</h3><p>{featured.result}</p></section>}
          </div>
        </section>
      )}

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
        <Image className="contact-3d" src="/3d/asterisque.png" alt="" width={200} height={200} />
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
