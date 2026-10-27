import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Shell from '@/components/Shell';
import { FREELANCE_EMAIL, FREELANCE_NAME } from '@/lib/freelance';
import { lines, pad, projectHref } from '@/lib/format';
import { getProjects } from '@/lib/store';
import { onFreelance, projectMedia, visualSrc } from '@/lib/visuals';

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

// Une page par projet : à gauche le texte reste en place (retour, titre, récit, fiche),
// à droite les écrans défilent en grand, les uns sous les autres.
export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index < 0) notFound();

  const p = projects[index];
  // numérotation et projet suivant dans le même groupe : réalisations (accueil) ou missions (parcours)
  const group = projects.filter((x) => onFreelance(x) === onFreelance(p));
  const at = group.findIndex((x) => x.id === p.id);
  const next = group[(at + 1) % group.length];
  const steps = lines(p.solution);
  const media = projectMedia(p);
  const pdfs = p.files.filter((f) => f.kind === 'pdf');
  const facts = [
    ['Rôle', p.role],
    ['Période', p.period],
    ['Outils', p.stack?.join(', ')],
    ['Statut', media.status],
  ].filter((f): f is [string, string] => !!f[1]);

  return (
    <Shell owner={FREELANCE_NAME} email={FREELANCE_EMAIL}>
      <article className="case">
        <aside className="case-text">
          <a className="case-back" href={onFreelance(p) ? '/#projets' : '/parcours#missions'}><span aria-hidden="true">←</span> Retour</a>
          <p className="label">{onFreelance(p) ? 'Réalisation' : 'Mission'} {pad(at + 1)} / {pad(group.length)}{p.sector && ` · ${p.sector}`}</p>
          <h1 className="case-title">{p.title}</h1>
          {p.subtitle && <p className="case-sub">{p.subtitle}</p>}

          <div className="case-body">
            {p.problem && <section><h2 className="label">Le besoin</h2><p>{p.problem}</p></section>}
            {steps.length > 0 && (
              <section>
                <h2 className="label">Mon rôle</h2>
                {steps.length > 1 ? <ul>{steps.map((s) => <li key={s}>{s}</li>)}</ul> : <p>{steps[0]}</p>}
              </section>
            )}
            {p.result && <section><h2 className="label">Le résultat</h2><p>{p.result}</p></section>}
          </div>

          {(facts.length > 0 || p.tags.length > 0) && (
            <dl className="case-facts">
              {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              {p.tags.length > 0 && <div><dt>Compétences</dt><dd>{p.tags.join(', ')}</dd></div>}
            </dl>
          )}

          <a className="btn pill case-cta" href="/#devis">Un projet du même type&nbsp;? <span aria-hidden="true">→</span></a>
        </aside>

        <div className="case-media">
          {media.screens.length > 0 ? (
            media.screens.map((s, i) => (
              <figure key={s.url}>
                <Image
                  src={s.url}
                  alt={s.title ? `${p.title}, ${s.title}` : s.name && !/\.\w{3,4}$/.test(s.name) ? `${p.title}, ${s.name}` : `${p.title}, capture ${i + 1}`}
                  width={s.width ?? 1600}
                  height={s.height ?? 1000}
                  sizes="(max-width: 900px) 100vw, 56vw"
                  priority={i === 0}
                />
                {(s.title || s.caption) && <figcaption>{s.title}{s.title && s.caption && ' · '}{s.caption}</figcaption>}
              </figure>
            ))
          ) : (
            // pas encore de capture : l'objet du projet sur un aplat
            <figure className="case-placeholder">
              <Image src={visualSrc(p)} alt="" width={640} height={640} sizes="40vw" priority />
            </figure>
          )}
          {pdfs.length > 0 && (
            <ul className="case-docs">
              {pdfs.map((f) => (
                <li key={f.url}><a className="link" href={f.url} target="_blank" rel="noopener noreferrer">{f.name} ↗</a></li>
              ))}
            </ul>
          )}
        </div>
      </article>

      {next && next.id !== p.id && (
        <nav className="case-next" aria-label="Projet suivant">
          <a href={projectHref(next.id)}>
            <span className="label">{onFreelance(p) ? 'Réalisation suivante' : 'Mission suivante'}</span>
            <strong>{next.title} <span aria-hidden="true">→</span></strong>
          </a>
        </nav>
      )}
    </Shell>
  );
}
