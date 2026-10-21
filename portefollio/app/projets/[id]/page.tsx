import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import { visualStyle } from '@/components/ProjectCard';
import Shell from '@/components/Shell';
import { CONTACT_EMAIL } from '@/lib/config';
import { lines, pad, projectHref } from '@/lib/format';
import { getProjects } from '@/lib/store';
import type { Project } from '@/lib/types';
import { projectMedia, visualSrc } from '@/lib/visuals';

// Pages statiques, régénérées avec la page d'accueil quand un projet est enregistré
export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = (await getProjects()).find((x) => x.id === id);
  if (!p) return {};
  const description = p.subtitle || p.problem.slice(0, 160);
  return {
    title: p.title,
    description,
    alternates: { canonical: projectHref(p.id) },
    openGraph: { title: p.title, description, url: projectHref(p.id) },
  };
}

function PagerLink({ project, label, className }: { project: Project; label: string; className?: string }) {
  return (
    <a className={`pager-link ${className ?? ''}`} href={projectHref(project.id)}>
      <Image src={projectMedia(project).icon ?? visualSrc(project)} alt="" width={64} height={64} />
      <span><span className="label">{label}</span><strong>{project.title}</strong></span>
    </a>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index < 0) notFound();

  const p = projects[index];
  const prev = projects[index - 1];
  const next = projects[index + 1];
  const steps = lines(p.solution);
  const media = projectMedia(p);
  const bg = visualStyle(media.color, index);
  const logo = media.icon ?? (media.screens.length ? visualSrc(p) : undefined);
  const pdfs = p.files.filter((f) => f.kind === 'pdf');
  const facts = [
    ['Rôle', p.role],
    ['Période', p.period],
    ['Outils', p.stack?.join(', ')],
    ['Statut', media.status],
  ].filter((f): f is [string, string] => !!f[1]);

  return (
    <Shell active="Projets">
      <p className="back"><a className="chip-link" href="/#projets">← Tous les projets</a></p>

      <article className="panel sheet">
        {/* sans écran, l'objet 3D est déjà en grand dans la bande : pas de doublon dans l'en-tête */}
        <header className={`sheet-head${logo ? '' : ' no-logo'}`}>
          {logo && <Image className={`sheet-logo${media.icon ? ' is-app' : ''}`} src={logo} alt="" width={160} height={160} priority />}
          <div>
            <p className="label">Projet {pad(index + 1)} / {pad(projects.length)} · {p.sector}</p>
            <h1>{p.title}</h1>
            {p.subtitle && <p className="sheet-sub">{p.subtitle}</p>}
          </div>
        </header>
        {(facts.length > 0 || p.tags.length > 0) && (
          <div className="sheet-meta">
            {facts.length > 0 && <dl className="sheet-facts">{facts.map(([k, v]) => <div key={k}><dt className="label">{k}</dt><dd>{v}</dd></div>)}</dl>}
            {p.tags.length > 0 && <ul className="bubbles">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
          </div>
        )}

        <section className={`sheet-band ${bg.className}`} style={bg.style}>
          {media.screens.length > 0
            ? <Gallery screens={media.screens} title={p.title} />
            : <Image className="sheet-3d" src={visualSrc(p)} alt="" width={640} height={640} sizes="(max-width: 980px) 50vw, 22vw" priority />}
        </section>

        <div className="sheet-story">
          {p.problem && (
            <section>
              <h2>Le problème</h2>
              <p className="prose">{p.problem}</p>
            </section>
          )}
          {steps.length > 0 && (
            <section>
              <h2>Ce que j’ai fait</h2>
              {steps.length > 1
                ? <ol className="steps">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
                : <p className="prose">{steps[0]}</p>}
            </section>
          )}
          {p.result && (
            <section className="sheet-result">
              <h2>Résultat</h2>
              <p className="prose">{p.result}</p>
            </section>
          )}
        </div>
      </article>

      {pdfs.length > 0 && (
        <section className="panel">
          <h2 className="label">Documents</h2>
          {pdfs.map((f) => (
            <div className="pdf" key={f.url}>
              <div className="pdf-head">
                <span>{f.name}</span>
                <a className="link" href={f.url} target="_blank" rel="noopener noreferrer">Ouvrir en plein écran ↗</a>
              </div>
              <iframe src={`${f.url}#view=FitH`} title={f.name} loading="lazy" />
            </div>
          ))}
        </section>
      )}

      <nav className="pager" aria-label="Autres projets">
        {prev ? <PagerLink project={prev} label="← Projet précédent" /> : <span />}
        {next
          ? <PagerLink project={next} label="Projet suivant →" className="next" />
          : <a className="pager-link next" href="/#projets"><span><span className="label">Fin de la sélection</span><strong>Tous les projets</strong></span></a>}
      </nav>

      <section className="panel dark project-cta">
        <p>Un poste ou un projet du même type&nbsp;? Parlons-en.</p>
        <a className="btn pill light" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('À propos du projet ' + p.title)}`}>M’écrire <span aria-hidden="true">→</span></a>
      </section>
    </Shell>
  );
}
