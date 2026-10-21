import Image from 'next/image';
import type { Project } from '@/lib/types';
import { pad, projectHref } from '@/lib/format';

const TONES = ['stone', 'ink', 'accent'];

// Couverture : la 1re image du projet, sinon une couverture typographique (numéro + outils)
export function ProjectVisual({ project, index, sizes }: { project: Project; index: number; sizes: string }) {
  const img = project.files.find((f) => f.kind === 'image');
  const words = project.stack?.length ? project.stack : project.tags;
  return (
    <div className={`visual ${TONES[index % TONES.length]}`}>
      {img ? (
        <Image src={img.url} alt="" fill sizes={sizes} className="visual-img" draggable={false} />
      ) : (
        <div className="visual-type" aria-hidden="true">
          <span className="visual-num">{pad(index + 1)}</span>
          <span className="visual-stack">{words.slice(0, 4).join(' · ')}</span>
        </div>
      )}
    </div>
  );
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const meta = [project.role, project.period].filter(Boolean).join(' · ');
  return (
    <article className="card">
      <ProjectVisual project={project} index={index} sizes="(max-width: 640px) 90vw, (max-width: 1060px) 45vw, 30vw" />
      <div className="card-body">
        <p className="label">{project.sector}</p>
        <h3>
          {/* le lien couvre toute la carte (voir .card-link::after) */}
          <a className="card-link" href={projectHref(project.id)}>{project.title}</a>
        </h3>
        {project.subtitle && <p className="card-sub">{project.subtitle}</p>}
        {meta && <p className="card-meta">{meta}</p>}
        <span className="card-more" aria-hidden="true">Voir le projet →</span>
      </div>
    </article>
  );
}
