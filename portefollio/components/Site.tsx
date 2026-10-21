import Image from 'next/image';
import type { Project } from '@/lib/types';
import { AVAILABILITY, BOOKING_URL, CONTACT_EMAIL, CV_URL, LINKEDIN_URL, LOCATION } from '@/lib/config';
import { ABOUT, EDUCATION, FIGURES, LANGUAGES, METHOD, SKILLS, XP } from '@/lib/profile';
import { pad, projectHref } from '@/lib/format';
import ProjectCard from './ProjectCard';
import Shell from './Shell';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function Site({ projects }: { projects: Project[] }) {
  const byId = new Map(projects.map((p) => [p.id, p]));

  return (
    <Shell home active="Projets">
      <section id="projets" aria-labelledby="projets-title">
        <h2 id="projets-title" className="sr-only">Projets</h2>
        {projects.length ? (
          <div className="works">
            {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        ) : (
          <p className="panel">Aucun projet pour l’instant.</p>
        )}
      </section>

      <section className="panel" id="parcours" aria-labelledby="parcours-title">
        <header className="panel-head">
          <p className="label">Parcours</p>
          <h2 id="parcours-title">Du SaaS au service public<span className="dot">.</span></h2>
        </header>
        <div className="about">
          <div className="portrait">
            <Image src="/malcolm.jpg" alt="Portrait de Malcolm Boukaka-Massengo" width={552} height={552} sizes="(max-width: 900px) 140px, 180px" />
          </div>
          <p className="about-intro">{ABOUT}</p>
        </div>
        <ul className="figures" aria-label="Quelques repères">
          {FIGURES.map(([n, text]) => <li key={text}><strong>{n}</strong><span>{text}</span></li>)}
        </ul>
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
      </section>

      <section className="panel" id="competences" aria-labelledby="competences-title">
        <header className="panel-head">
          <p className="label">Compétences</p>
          <h2 id="competences-title">Ma façon de travailler<span className="dot">.</span></h2>
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

      <section className="panel dark contact" id="contact" aria-labelledby="contact-title">
        <Image className="contact-3d" src="/3d/asterisque.png" alt="" width={200} height={200} />
        <header className="panel-head">
          <p className="label">Contact</p>
          <h2 id="contact-title">On se parle<span className="dot">&nbsp;?</span></h2>
          <p>Ouvert aux postes de chef de projet SI et de product builder. Basé à {LOCATION}, {AVAILABILITY.toLowerCase()}.</p>
        </header>
        <a className="contact-mail" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <div className="actions">
          {LINKEDIN_URL && <a className="btn pill light" href={LINKEDIN_URL} {...external}>LinkedIn <span aria-hidden="true">↗</span></a>}
          {CV_URL && <a className="btn pill ghost" href={CV_URL} download>Télécharger le CV</a>}
          {BOOKING_URL && <a className="btn pill ghost" href={BOOKING_URL} {...external}>Réserver un créneau ↗</a>}
        </div>
      </section>
    </Shell>
  );
}
