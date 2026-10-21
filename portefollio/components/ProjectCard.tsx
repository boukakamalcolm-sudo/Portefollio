import Image from 'next/image';
import type { Project } from '@/lib/types';
import { pad, projectHref } from '@/lib/format';
import { coverFor, visualSrc } from '@/lib/visuals';
import Shot from './Shot';

const TONES = ['light', 'ink', 'peach'];

export const projectTone = (index: number) => TONES[index % TONES.length];

// Visuel : la capture de l'application avec l'objet 3D sur le côté, sinon l'objet 3D seul
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cover = coverFor(project);
  const sizes = '(max-width: 640px) 46vw, (max-width: 980px) 45vw, 30vw';
  return (
    <article className="work">
      <div className={`work-visual ${projectTone(index)}`}>
        {cover
          ? <Shot src={cover} logo={visualSrc(project)} sizes={sizes} priority={index < 2} />
          : <Image className="work-3d" src={visualSrc(project)} alt="" width={640} height={640} sizes={sizes} priority={index < 2} />}
      </div>
      <div className="work-body">
        <p className="label work-meta">{pad(index + 1)} · {project.sector}</p>
        <h3>
          {/* le lien couvre toute la carte (voir .card-link::after) */}
          <a className="card-link" href={projectHref(project.id)}>{project.title}</a>
        </h3>
        {project.subtitle && <p className="work-sub">{project.subtitle}</p>}
        {project.tags.length > 0 && <ul className="bubbles">{project.tags.slice(0, 3).map((t) => <li key={t}>{t}</li>)}</ul>}
      </div>
    </article>
  );
}
