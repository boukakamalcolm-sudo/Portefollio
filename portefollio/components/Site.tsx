import Image from 'next/image';
import type { Project } from '@/lib/types';
import { AVAILABILITY, BOOKING_URL, CONTACT_EMAIL, CV_URL, LINKEDIN_URL, LOCATION } from '@/lib/config';
import { ABOUT, EDUCATION, LANGUAGES, PITCH, XP } from '@/lib/profile';
import { pad, projectHref } from '@/lib/format';
import Experience from './Experience';
import Hero from './Hero';
import Method from './Method';
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
    <Shell>
      <Hero />
      <Method />

      <section className="section" id="projets" aria-labelledby="projets-title">
        <header className="section-head reveal">
          <h2 id="projets-title" className="title">Projets.<span> Du SI à l’application.</span></h2>
          <p className="section-count label">{pad(projects.length)} projets</p>
        </header>
        {projects.length ? (
          <div className="works">
            {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        ) : (
          <p className="lead">Aucun projet pour l’instant.</p>
        )}
      </section>

      <section className="section" id="parcours" aria-labelledby="parcours-title">
        <header className="section-head reveal">
          <h2 id="parcours-title" className="title">Parcours.<span> De la relation client au pilotage SI.</span></h2>
        </header>
        <div className="about reveal">
          <div className="portrait">
            <Image src="/malcolm.jpg" alt="Portrait de Malcolm Boukaka-Massengo" width={552} height={552} sizes="(max-width: 640px) 112px, 180px" />
          </div>
          <div className="about-text">
            <p className="lead">{PITCH}</p>
            <p>{ABOUT}</p>
          </div>
        </div>
        <Experience items={xp} education={EDUCATION} languages={LANGUAGES} />
      </section>

      <section className="section contact" id="contact" aria-labelledby="contact-title">
        <Image className="contact-3d" src="/3d/asterisque.png" alt="" width={200} height={200} />
        <h2 id="contact-title" className="contact-title reveal">Un poste, un projet&nbsp;?<span className="accent"> Parlons-en.</span></h2>
        <p className="contact-sub reveal">
          Ouvert aux postes de chef de projet SI et de product builder. Basé à {LOCATION}, {AVAILABILITY.toLowerCase()}.
        </p>
        <div className="actions reveal">
          <a className="btn pill" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <span aria-hidden="true">→</span></a>
          {LINKEDIN_URL && <a className="btn pill ghost" href={LINKEDIN_URL} {...external}>LinkedIn <span aria-hidden="true">↗</span></a>}
          {CV_URL && <a className="btn pill ghost" href={CV_URL} download>Télécharger le CV</a>}
          {BOOKING_URL && <a className="btn pill ghost" href={BOOKING_URL} {...external}>Réserver un créneau <span aria-hidden="true">↗</span></a>}
        </div>
      </section>
    </Shell>
  );
}
