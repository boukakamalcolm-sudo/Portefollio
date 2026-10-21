import Image from 'next/image';
import type { Project } from '@/lib/types';
import { pad, projectHref } from '@/lib/format';
import { visualSrc } from '@/lib/visuals';

const TONES = ['light', 'ink', 'peach'];

export const projectTone = (index: number) => TONES[index % TONES.length];

// Couverture : la 1re image du projet, sinon son objet 3D
export function ProjectVisual({ project, className, sizes, priority }: {
  project: Project;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  const img = project.files.find((f) => f.kind === 'image');
  if (img) return <Image src={img.url} alt="" fill sizes={sizes} className="work-photo" priority={priority} />;
  return <Image src={visualSrc(project)} alt="" width={640} height={640} sizes={sizes} className={className} priority={priority} />;
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const hasPhoto = project.files.some((f) => f.kind === 'image');
  return (
    <article className={`work ${hasPhoto ? 'photo' : projectTone(index)}`}>
      <ProjectVisual project={project} className="work-3d" sizes="(max-width: 900px) 30vw, 18vw" priority={index < 2} />
      <p className="work-top"><span>{pad(index + 1)}</span><span className="work-sector">{project.sector}</span></p>
      <div className="work-bottom">
        <h3>
          {/* le lien couvre toute la carte (voir .card-link::after) */}
          <a className="card-link" href={projectHref(project.id)}>{project.title}</a>
        </h3>
        <span className="work-more" aria-hidden="true">Voir le projet →</span>
      </div>
    </article>
  );
}
