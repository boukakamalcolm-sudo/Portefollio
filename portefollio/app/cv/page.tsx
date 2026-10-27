import type { Metadata } from 'next';
import Image from 'next/image';
import Experience from '@/components/Experience';
import Shell from '@/components/Shell';
import { AVAILABILITY, CONTACT_EMAIL, CV_URL, LEGAL_NAME, LINKEDIN_URL, LOCATION, ROLE } from '@/lib/config';
import { projectHref } from '@/lib/format';
import { ABOUT, EDUCATION, LANGUAGES, PITCH, XP } from '@/lib/profile';
import { getProjects } from '@/lib/store';

// Page « CV » : parcours, expériences, formation. Absente de l'accueil, reliée depuis le pied de page.
export const metadata: Metadata = {
  title: 'Parcours',
  description: PITCH,
  alternates: { canonical: '/cv' },
};

export const revalidate = 3600;

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default async function CvPage() {
  const byId = new Map((await getProjects()).map((p) => [p.id, p]));
  const xp = XP.map((x) => ({
    ...x,
    logo: `/3d/${x.visual}.png`,
    related: x.projects.flatMap((id) => {
      const p = byId.get(id);
      return p ? [{ title: p.title, href: projectHref(p.id) }] : [];
    }),
  }));

  return (
    <Shell owner={LEGAL_NAME} email={CONTACT_EMAIL}>
      <section className="section cv" aria-labelledby="cv-title">
        <p className="label cv-role">{ROLE} · {LOCATION} · {AVAILABILITY.toLowerCase()}</p>
        <h1 id="cv-title" className="title">Parcours.<span> De la relation client au pilotage SI.</span></h1>
        <div className="about">
          <div className="portrait">
            <Image src="/malcolm.jpg" alt={`Portrait de ${LEGAL_NAME}`} width={552} height={552} sizes="(max-width: 640px) 112px, 180px" priority />
          </div>
          <div className="about-text">
            <p className="lead">{PITCH}</p>
            <p>{ABOUT}</p>
            <div className="actions">
              <a className="btn pill" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <span aria-hidden="true">→</span></a>
              {LINKEDIN_URL && <a className="btn pill ghost" href={LINKEDIN_URL} {...external}>LinkedIn <span aria-hidden="true">↗</span></a>}
              {CV_URL && <a className="btn pill ghost" href={CV_URL} download>Télécharger le CV</a>}
            </div>
          </div>
        </div>
        <Experience items={xp} education={EDUCATION} languages={LANGUAGES} />
      </section>
    </Shell>
  );
}
