import Image from 'next/image';
import type { Project } from '@/lib/types';
import { pad, projectHref } from '@/lib/format';
import { projectMedia, visualSrc } from '@/lib/visuals';
import Shot from './Shot';

const TONES = ['clay', 'graphite', 'slate'];

export const projectTone = (index: number) => TONES[index % TONES.length];

// Fond du visuel : la couleur de l'application si elle est renseignée, sinon une ambiance du site
export function visualStyle(color: string, index: number) {
  return color
    ? { className: 'tinted', style: { '--tint': color } as React.CSSProperties }
    : { className: projectTone(index), style: undefined };
}

// Visuel : visuels de présentation empilés, ou écrans de l'application côte à côte (ou capture unique)
// avec son icône sur le côté, sinon l'objet 3D du projet
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { icon, screens, wide, color } = projectMedia(project);
  const logo = icon ?? visualSrc(project);
  const bg = visualStyle(color, index);
  const sizes = '(max-width: 640px) 46vw, (max-width: 1100px) 45vw, 640px';
  return (
    <article className="work reveal">
      <div className={`work-visual ${bg.className}`} style={bg.style}>
        {wide ? (
          // visuels de présentation empilés, le premier devant
          <div className="screens-deck">
            {screens.slice(0, 3).reverse().map((s, i, all) => (
              <Image key={s.url} src={s.url} alt="" width={s.width} height={s.height} sizes={sizes} priority={index < 2 && i === all.length - 1} />
            ))}
          </div>
        ) : screens.length > 1 ? (
          <>
            <div className="screens-fan">
              {screens.slice(0, 3).map((s, i) => (
                <Image key={s.url} src={s.url} alt="" width={600} height={640} sizes="(max-width: 640px) 16vw, 220px" priority={index < 2 && i === 0} />
              ))}
            </div>
            <Image className={`shot-logo${icon ? ' is-app' : ''}`} src={logo} alt="" width={200} height={200} />
          </>
        ) : screens.length === 1 ? (
          <Shot src={screens[0].url} logo={logo} sizes={sizes} priority={index < 2} />
        ) : (
          <Image className="work-3d" src={logo} alt="" width={640} height={640} sizes={sizes} priority={index < 2} />
        )}
        <span className="hotspot work-hotspot" aria-hidden="true">Voir le projet <i /></span>
      </div>
      <div className="work-body">
        <p className="label work-meta">{pad(index + 1)} · {project.sector}</p>
        <h3>
          {/* le lien couvre toute la carte (voir .card-link::after) */}
          <a className="card-link" href={projectHref(project.id)}>{project.title}</a>
        </h3>
        {project.subtitle && <p className="work-sub">{project.subtitle}</p>}
      </div>
    </article>
  );
}
