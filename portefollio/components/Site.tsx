import Image from 'next/image';
import type { Project } from '@/lib/types';
import { AVAILABILITY, BOOKING_URL, CONTACT_EMAIL, CV_URL, LINKEDIN_URL, LOCATION } from '@/lib/config';
import { ABOUT, EDUCATION, LANGUAGES, METHOD, XP } from '@/lib/profile';
import { pad, projectHref } from '@/lib/format';
import Experience from './Experience';
import ProjectCard from './ProjectCard';
import Shell from './Shell';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function Site({ projects }: { projects: Project[] }) {
  const byId = new Map(projects.map((p) => [p.id, p]));
  const xp = XP.map((x) => ({
    ...x,
    logo: `/3d/${x.visual}.png`,
    related: x.projects
      .map((id) => byId.get(id))
      .filter((p): p is Project => !!p)
      .map((p) => ({ title: p.title, href: projectHref(p.id) })),
  }));

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
          <h2 id="parcours-title">De la relation client au pilotage SI<span className="dot">.</span></h2>
        </header>
        <div className="about">
          <div className="portrait">
            <Image src="/malcolm.jpg" alt="Portrait de Malcolm Boukaka-Massengo" width={552} height={552} sizes="(max-width: 980px) 120px, 160px" />
          </div>
          <div>
            <p className="about-intro">{ABOUT}</p>
            <div className="method-line">
              <span className="label">Ma façon de travailler</span>
              <ol>{METHOD.map((m, i) => <li key={m}><span>{pad(i + 1)}</span>{m}</li>)}</ol>
            </div>
          </div>
        </div>
        <Experience items={xp} education={EDUCATION} languages={LANGUAGES} />
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
