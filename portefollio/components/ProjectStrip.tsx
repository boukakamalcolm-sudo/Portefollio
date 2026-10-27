import Image from 'next/image';
import type { Project } from '@/lib/types';
import { projectHref } from '@/lib/format';
import { projectMedia } from '@/lib/visuals';

// Projets de l'accueil : une bande de grands visuels qui défile seule (une page par projet au clic).
// La liste est doublée pour boucler sans à-coup ; la copie est cachée aux lecteurs d'écran et au clavier.
// Avec « réduire les animations », la bande ne bouge plus et se fait défiler à la main.
function Card({ project, copy, eager }: { project: Project; copy?: boolean; eager?: boolean }) {
  const cover = projectMedia(project).screens[0];
  return (
    <li className="strip-item" aria-hidden={copy || undefined}>
      <a href={projectHref(project.id)} tabIndex={copy ? -1 : undefined}>
        <span className="strip-visual">
          {cover ? (
            <Image src={cover.url} alt="" width={cover.width ?? 1600} height={cover.height ?? 1000} sizes="(max-width: 640px) 82vw, 700px" priority={eager} />
          ) : (
            // sans capture : le nom du projet en grand, à la manière d'une couverture
            <span className="strip-cover">{project.title}</span>
          )}
        </span>
        <span className="strip-caption">
          <strong>{project.title}</strong>
          {project.sector && <span>{project.sector}</span>}
        </span>
      </a>
    </li>
  );
}

export default function ProjectStrip({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  const loop = projects.length > 2;
  return (
    <section className="strip" id="projets" aria-labelledby="projets-title">
      <header className="section-head strip-head">
        <h2 id="projets-title" className="title">Projets.<span> Un projet, une page.</span></h2>
      </header>
      <div className={`strip-window${loop ? ' is-loop' : ''}`}>
        <ul className="strip-track" style={{ '--count': projects.length } as React.CSSProperties}>
          {projects.map((p, i) => <Card key={p.id} project={p} eager={i < 2} />)}
          {loop && projects.map((p) => <Card key={`${p.id}-copie`} project={p} copy />)}
        </ul>
      </div>
    </section>
  );
}
