import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminGear from '@/components/AdminGear';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import Nav from '@/components/Nav';
import { CONTACT_EMAIL } from '@/lib/config';
import { lines, pad, projectHref } from '@/lib/format';
import { getProjects } from '@/lib/store';

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

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index < 0) notFound();

  const p = projects[index];
  const prev = projects[index - 1];
  const next = projects[index + 1];
  const steps = lines(p.solution);
  const images = p.files.filter((f) => f.kind === 'image');
  const pdfs = p.files.filter((f) => f.kind === 'pdf');
  const facts = [
    ['Rôle', p.role],
    ['Période', p.period],
    ['Contexte', p.sector],
    ['Outils', p.stack?.join(', ')],
  ].filter((f): f is [string, string] => !!f[1]);

  return (
    <>
      <Nav />
      <main id="contenu" className="project">
        <p className="crumbs"><a className="link" href="/#projets">← Tous les projets</a></p>

        <header className="project-head">
          <p className="label accent">Projet {pad(index + 1)} / {pad(projects.length)}</p>
          <h1>{p.title}</h1>
          {p.subtitle && <p className="project-sub">{p.subtitle}</p>}
          {p.tags.length > 0 && <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
        </header>

        {facts.length > 0 && (
          <dl className="facts">
            {facts.map(([k, v]) => <div key={k}><dt className="label">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        )}

        <div className="story">
          {p.problem && (
            <section>
              <h2>Contexte</h2>
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
        </div>

        {p.result && (
          <section className="result">
            <p className="label accent">Résultat</p>
            <p>{p.result}</p>
          </section>
        )}

        {images.length > 0 && (
          <section className="media">
            <h2 className="label">Captures</h2>
            <Gallery images={images} title={p.title} />
          </section>
        )}

        {pdfs.length > 0 && (
          <section className="media">
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
          {prev ? (
            <a href={projectHref(prev.id)}><span className="label">← Projet précédent</span><strong>{prev.title}</strong></a>
          ) : <span />}
          {next ? (
            <a className="next" href={projectHref(next.id)}><span className="label">Projet suivant →</span><strong>{next.title}</strong></a>
          ) : (
            <a className="next" href="/#projets"><span className="label">Fin de la sélection</span><strong>Tous les projets</strong></a>
          )}
        </nav>

        <section className="project-cta">
          <p>Un poste ou un projet du même type ? Parlons-en.</p>
          <a className="btn" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('À propos du projet ' + p.title)}`}>M’écrire</a>
        </section>
      </main>
      <Footer />
      <AdminGear />
    </>
  );
}
