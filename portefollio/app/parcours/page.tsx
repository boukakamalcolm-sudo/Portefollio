import type { Metadata } from 'next';
import Image from 'next/image';
import Asterisk from '@/components/Asterisk';
import InView from '@/components/InView';
import { CountUp } from '@/components/motion';
import Shell from '@/components/Shell';
import Timeline from '@/components/Timeline';
import { CONTACT_EMAIL, CV_URL, LEGAL_NAME, LINKEDIN_URL } from '@/lib/config';
import { EDUCATION, PITCH, XP } from '@/lib/profile';

// Parcours : chiffres clés, frise des expériences (détail en paragraphes au clic), diplômes en escalier.
// Reliée uniquement depuis l'en-tête.
export const metadata: Metadata = {
  title: 'Parcours',
  description: PITCH,
  alternates: { canonical: '/parcours' },
};

// chiffres repris des expériences (lib/profile.ts)
const STATS: [number, string, string][] = [
  [550, '', 'collaborateurs passés à Microsoft 365'],
  [180, '', 'clients dont j’ai recueilli les besoins'],
  [150, '', 'agents formés en Belgique'],
  [50, '', 'musées accompagnés, environ'],
  [18, '', 'directions régionales cartographiées'],
];

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function ParcoursPage() {
  const skills = [...new Set(XP.flatMap((x) => x.skills))];
  const half = Math.ceil(skills.length / 2);
  const firstYear = Math.min(...XP.flatMap((x) => [...x.period.matchAll(/\d{4}/g)].map((m) => +m[0])));
  const years = new Date().getFullYear() - firstYear;

  return (
    <Shell owner={LEGAL_NAME} email={CONTACT_EMAIL}>
      {/* ouverture : le titre en escalier et l'astérisque qui tourne */}
      <section className="pc-hero" aria-labelledby="pc-title">
        <Asterisk spin className="pc-ast" />
        <h1 id="pc-title" className="pc-title">
          <span>parcours.</span>
          <span>{years} ans,</span>
          <span>{XP.length - 1} maisons,</span>
          <span>1 méthode.</span>
        </h1>
        <div className="pc-intro">
          <div className="portrait">
            <Image src="/malcolm.jpg" alt={`Portrait de ${LEGAL_NAME}`} width={552} height={552} sizes="120px" priority />
          </div>
          <p>{PITCH}</p>
        </div>
      </section>

      {/* compétences en deux bandes qui défilent en sens inverse */}
      <div className="pc-marquee" aria-label="Compétences">
        {[skills.slice(0, half), skills.slice(half)].map((row, r) => (
          <div key={r} className={`pc-marquee-row${r ? ' is-reverse' : ''}`}>
            <ul>
              {[...row, ...row].map((s, i) => (
                <li key={`${s}-${i}`} aria-hidden={i >= row.length || undefined}>{s}<Asterisk /></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* chiffres clés : comptent jusqu'à leur valeur quand on arrive dessus */}
      <section className="section pc-stats" aria-label="Chiffres clés">
        <ol>
          {STATS.map(([n, suffix, label]) => (
            <li key={label}>
              <strong><CountUp value={n} suffix={suffix} /></strong>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" id="experiences" aria-labelledby="xp-title">
        <header className="section-head">
          <h2 id="xp-title" className="title">Expériences.<span> De la relation client au pilotage SI.</span></h2>
        </header>
        <Timeline items={XP} />
      </section>

      {/* diplômes en escalier : chaque marche un cran plus haut */}
      <section className="section" id="diplomes" aria-labelledby="edu-title">
        <header className="section-head">
          <h2 id="edu-title" className="title">Diplômes.<span> Une marche après l’autre.</span></h2>
        </header>
        <InView as="ol" className="pc-steps">
          {[...EDUCATION].reverse().map(([year, degree, school], i) => (
            <li key={degree} style={{ '--i': i } as React.CSSProperties}>
              <span className="pc-year">{year}</span>
              <strong>{degree}</strong>
              <span>{school}</span>
            </li>
          ))}
        </InView>
        <div className="pc-lang">
          <span className="pc-badge"><Asterisk spin /><b>C1</b></span>
          <p><strong>Anglais courant</strong> · français natif</p>
        </div>
      </section>

      <section className="section pc-end" aria-label="Contact">
        <div className="actions">
          <a className="btn pill" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <span aria-hidden="true">→</span></a>
          {LINKEDIN_URL && <a className="btn pill ghost" href={LINKEDIN_URL} {...external}>LinkedIn <span aria-hidden="true">↗</span></a>}
          {CV_URL && <a className="btn pill ghost" href={CV_URL} download>Télécharger le CV</a>}
        </div>
      </section>
    </Shell>
  );
}
