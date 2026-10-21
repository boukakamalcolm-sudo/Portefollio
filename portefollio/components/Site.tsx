import Image from 'next/image';
import type { Project } from '@/lib/types';
import { AVAILABILITY, BOOKING_URL, CONTACT_EMAIL, CV_URL, LINKEDIN_URL, LOCATION, ROLE } from '@/lib/config';
import { ABOUT, EDUCATION, FIGURES, LANGUAGES, METHOD, PITCH, SKILLS, XP } from '@/lib/profile';
import { pad, projectHref } from '@/lib/format';
import AdminGear from './AdminGear';
import Footer from './Footer';
import Nav from './Nav';
import ProjectCard from './ProjectCard';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function Site({ projects }: { projects: Project[] }) {
  const byId = new Map(projects.map((p) => [p.id, p]));

  return (
    <>
      <Nav />
      <main id="contenu">
        <section className="hero">
          <div className="hero-intro">
            <p className="label accent">{ROLE}</p>
            <h1>Malcolm<br />Boukaka-Massengo<span className="dot">.</span></h1>
            <p className="hero-pitch">{PITCH}</p>
            <p className="hero-meta"><span>{LOCATION}</span><span className="available">{AVAILABILITY}</span></p>
            <div className="actions">
              <a className="btn" href="#projets">Voir les projets</a>
              <a className="btn ghost" href="#contact">Me contacter</a>
              {CV_URL && <a className="link" href={CV_URL} download>Télécharger le CV</a>}
            </div>
          </div>

          {projects.length > 0 && (
            <nav className="hero-index" aria-labelledby="index-title">
              <p className="label" id="index-title">Accès direct aux projets</p>
              <ol>
                {projects.map((p, i) => (
                  <li key={p.id}>
                    <a href={projectHref(p.id)}>
                      <span className="num">{pad(i + 1)}</span>
                      <span><strong>{p.title}</strong><small>{p.sector}</small></span>
                      <span className="arrow" aria-hidden="true">→</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </section>

        <ul className="figures" aria-label="Quelques repères">
          {FIGURES.map(([n, text]) => (
            <li key={text}><strong>{n}</strong><span>{text}</span></li>
          ))}
        </ul>

        <section className="section" id="projets">
          <header className="section-head">
            <p className="label">01 / Projets</p>
            <h2>Projets<span>.</span></h2>
            <p>Systèmes d’information, IA et produits construits de bout en bout. Chaque projet a sa page : contexte, ce que j’ai fait, résultat.</p>
          </header>
          {projects.length ? (
            <div className="grid">
              {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
            </div>
          ) : (
            <p>Aucun projet pour l’instant.</p>
          )}
        </section>

        <section className="section" id="parcours">
          <header className="section-head">
            <p className="label">02 / Parcours</p>
            <h2>Parcours<span>.</span></h2>
          </header>
          <div className="about">
            <div className="portrait">
              <Image src="/malcolm.jpg" alt="Portrait de Malcolm Boukaka-Massengo" width={552} height={552} sizes="(max-width: 760px) 200px, 280px" />
            </div>
            <div>
              <p className="about-intro">{ABOUT}</p>
              <ol className="xp">
                {XP.map((x) => {
                  const related = x.projects.map((id) => byId.get(id)).filter((p): p is Project => !!p);
                  return (
                    <li key={x.org}>
                      <p className="label">{x.period}</p>
                      <div>
                        <h3>{x.role}</h3>
                        <p className="xp-org">{x.org}</p>
                        <p className="xp-text">{x.text}</p>
                        {related.length > 0 && (
                          <p className="xp-links">
                            {related.map((p) => <a key={p.id} className="link" href={projectHref(p.id)}>{p.title} →</a>)}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="edu">
                <h3 className="label">Formation</h3>
                <ul>
                  {EDUCATION.map(([year, degree, school]) => (
                    <li key={degree}><span className="label">{year}</span><span><strong>{degree}</strong>{school}</span></li>
                  ))}
                </ul>
                <p><span className="label">Langues</span> {LANGUAGES}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="competences">
          <header className="section-head">
            <p className="label">03 / Compétences</p>
            <h2>Ma façon de travailler<span>.</span></h2>
          </header>
          <ol className="method">
            {METHOD.map(([step, text], i) => (
              <li key={step}><span className="label accent">{pad(i + 1)}</span><strong>{step}</strong><span>{text}</span></li>
            ))}
          </ol>
          <div className="skills">
            {SKILLS.map((s) => (
              <div key={s.title}>
                <h3>{s.title}</h3>
                <ul className="chips">{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section className="section contact" id="contact">
          <header className="section-head">
            <p className="label">04 / Contact</p>
            <h2>On se parle<span> ?</span></h2>
            <p>Ouvert aux postes de chef de projet SI et de product builder. Basé à {LOCATION}, {AVAILABILITY.toLowerCase()}.</p>
          </header>
          <a className="contact-mail" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <div className="actions">
            {LINKEDIN_URL && <a className="btn" href={LINKEDIN_URL} {...external}>LinkedIn ↗</a>}
            {CV_URL && <a className="btn ghost" href={CV_URL} download>Télécharger le CV</a>}
            {BOOKING_URL && <a className="btn ghost" href={BOOKING_URL} {...external}>Réserver un créneau ↗</a>}
          </div>
        </section>
      </main>
      <Footer />
      <AdminGear />
    </>
  );
}
