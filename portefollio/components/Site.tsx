'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { Project } from '@/lib/types';
import { BOOKING_URL, CONTACT_EMAIL, LEGAL_NAME, LINKEDIN_URL } from '@/lib/config';

// chargé seulement pour l'admin connecté
const AdminPanel = dynamic(() => import('./AdminPanel'));

const PAINS = [
  'Le stock ne correspond jamais à ce qu’il y a vraiment en rayon.',
  'Vos infos clients sont éparpillées entre Excel, WhatsApp et des carnets.',
  'Vous passez vos soirées sur l’administratif au lieu de développer l’activité.',
  'Vous ne savez pas ce que vous avez réellement gagné ce mois-ci.',
];

const OFFERS = [
  {
    n: '01',
    title: 'DIAGNOSTIC',
    text: 'On regarde ensemble comment vous travaillez aujourd’hui et où part le temps. Vous repartez avec un plan clair, même si on ne va pas plus loin.',
    tags: ['1 À 2 JOURS', 'PLAN D’ACTION'],
  },
  {
    n: '02',
    title: 'OUTIL SUR MESURE',
    text: 'Une application web simple, pensée pour votre activité : stock, caisse, clients, commandes, tableaux de bord. Utilisable sur téléphone.',
    tags: ['STOCK', 'CAISSE', 'CRM', 'SUIVI'],
  },
  {
    n: '03',
    title: 'MISE EN ROUTE',
    text: 'Formation de l’équipe, ajustements après les premières semaines, suivi. Un outil ne sert à rien si personne ne l’utilise.',
    tags: ['FORMATION', 'ADOPTION', 'SUIVI'],
  },
];

const STEPS = [
  ['ÉCOUTER', 'Votre métier, vos contraintes, ce qui vous fait perdre du temps'],
  ['CARTOGRAPHIER', 'Qui fait quoi, avec quels outils, où ça coince'],
  ['CONSTRUIRE', 'Un outil simple, testé avec vous au fur et à mesure'],
  ['ACCOMPAGNER', 'Formation, ajustements, suivi dans la durée'],
];

const pad = (n: number) => String(n).padStart(2, '0');

function Cover({ project, index }: { project: Project; index: number }) {
  const img = project.files.find((f) => f.kind === 'image');
  const accent = ['red', 'dark', 'cream'][index % 3];
  if (img) {
    return (
      <div className={`project-visual ${accent}`}>
        <Image src={img.url} alt="" fill className="cover-img" sizes="(max-width: 900px) 84vw, 44vw" draggable={false} />
        <span className="visual-label">{pad(index + 1)} / {project.title.toUpperCase()}</span>
      </div>
    );
  }
  return (
    <div className={`project-visual ${accent}`} aria-hidden="true">
      <div className="visual-grid" />
      <div className="visual-window">
        <div className="window-top"><span /><span /><span /></div>
        <div className="window-body">
          <div className="fake-sidebar"><i /><i /><i /><i /></div>
          <div className="fake-content">
            <div className="fake-line long" /><div className="fake-line" />
            <div className="fake-cards"><b /><b /><b /></div>
            <div className="fake-chart"><span /><span /><span /><span /><span /></div>
          </div>
        </div>
      </div>
      <span className="visual-label">{pad(index + 1)} / {project.title.toUpperCase()}</span>
    </div>
  );
}

function Carousel({ projects, onOpen }: { projects: Project[]; onOpen: (i: number) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const start = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft || '0');
    let idx = 0;
    let best = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.getBoundingClientRect().left - start);
      if (d < best) { best = d; idx = i; }
    });
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
    setCurrent(atEnd ? cards.length - 1 : idx);
    setEdges({ start: el.scrollLeft < 5, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 5 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update, projects.length]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  // glisser à la souris sur desktop
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !track.current) return;
    drag.current = { down: true, x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5 && !d.moved) {
      d.moved = true;
      track.current.classList.add('dragging');
    }
    if (d.moved) track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
    track.current?.classList.remove('dragging');
  };

  if (!projects.length) return <p className="empty">Aucun projet pour l’instant.</p>;

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        ref={track}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        tabIndex={0}
        role="region"
        aria-label="Réalisations, faire défiler avec les flèches du clavier"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        }}
      >
        {projects.map((p, i) => (
          <article className="project-card" key={p.id}>
            <Cover project={p} index={i} />
            <div className="project-info">
              <div>
                <span className="project-number">{pad(i + 1)} · {p.sector.toUpperCase()}</span>
                <h3>
                  {/* le bouton couvre toute la carte (voir .project-open::after) */}
                  <button
                    className="project-open"
                    onClick={(e) => {
                      if (drag.current.moved) { e.preventDefault(); drag.current.moved = false; return; }
                      onOpen(i);
                    }}
                  >
                    {p.title.toUpperCase()}
                  </button>
                </h3>
                <p>{p.subtitle}</p>
              </div>
              <span className="view" aria-hidden="true">VOIR ↗</span>
            </div>
            <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </article>
        ))}
      </div>
      <div className="carousel-controls">
        <span className="carousel-count">{pad(current + 1)} / {pad(projects.length)}</span>
        <div className="carousel-bar"><i style={{ width: `${((current + 1) / projects.length) * 100}%` }} /></div>
        <div className="carousel-arrows">
          <button onClick={() => go(-1)} disabled={edges.start} aria-label="Projet précédent">←</button>
          <button onClick={() => go(1)} disabled={edges.end} aria-label="Projet suivant">→</button>
        </div>
      </div>
    </div>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, input, textarea, select, [tabindex]:not([tabindex="-1"])';

// garde le focus clavier dans la fenêtre ouverte
function trapTab(e: KeyboardEvent, root: HTMLElement | null) {
  if (e.key !== 'Tab' || !root) return;
  const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) {
    e.preventDefault();
    first.focus();
  }
}

function CaseModal({ project, index, onClose }: { project: Project; index: number; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<{ url: string; alt: string } | null>(null);
  const images = project.files.filter((f) => f.kind === 'image');
  const pdfs = project.files.filter((f) => f.kind === 'pdf');

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => prev?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') (zoom ? setZoom(null) : onClose());
      trapTab(e, zoom ? lightboxRef.current : modalRef.current);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, zoom]);

  useEffect(() => {
    if (zoom) lightboxRef.current?.querySelector('button')?.focus();
  }, [zoom]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <article ref={modalRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="case-title">
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Fermer">×</button>
        <div className="modal-hero">
          <span>{pad(index + 1)} / {project.sector.toUpperCase()}</span>
          <h2 id="case-title">{project.title.toUpperCase()}</h2>
          <p>{project.subtitle}</p>
        </div>

        <div className="case-meta">
          <div><small>LE PROBLÈME</small><p>{project.problem}</p></div>
          <div><small>CE QUI A ÉTÉ FAIT</small><p>{project.solution}</p></div>
        </div>

        {images.length > 0 && (
          <section className="case-block">
            <small>CAPTURES</small>
            <div className="gallery">
              {images.map((f, i) => {
                const alt = `${project.title}, capture ${i + 1} sur ${images.length}`;
                return (
                  <button key={f.url} onClick={() => setZoom({ url: f.url, alt })} aria-label={`Agrandir : ${alt}`}>
                    <Image
                      src={f.url}
                      alt={alt}
                      width={1200}
                      height={800}
                      sizes={images.length === 1 ? '(max-width: 1300px) 90vw, 1150px' : '(max-width: 900px) 90vw, 400px'}
                    />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {pdfs.length > 0 && (
          <section className="case-block">
            <small>DOCUMENTS</small>
            {pdfs.map((f) => (
              <div className="pdf" key={f.url}>
                <div className="pdf-head">
                  <span>{f.name}</span>
                  <a href={f.url} target="_blank" rel="noopener noreferrer">OUVRIR EN PLEIN ÉCRAN ↗</a>
                </div>
                <iframe src={`${f.url}#view=FitH`} title={f.name} loading="lazy" />
              </div>
            ))}
          </section>
        )}

        <div className="case-result">
          <small>LE RÉSULTAT</small>
          <h3>CE QUI A CHANGÉ</h3>
          <p>{project.result}</p>
          <a className="result-cta" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Un projet comme ' + project.title)}`}>
            UN BESOIN SIMILAIRE ? PARLONS-EN ↗
          </a>
        </div>
      </article>

      {zoom && (
        <div ref={lightboxRef} className="lightbox" onClick={() => setZoom(null)} role="dialog" aria-modal="true" aria-label="Image agrandie">
          <button className="lightbox-close" onClick={() => setZoom(null)} aria-label="Fermer l’image">×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom.url} alt={zoom.alt} />
        </div>
      )}
    </div>
  );
}

export default function Site({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [active, setActive] = useState<number | null>(null);
  const [admin, setAdmin] = useState(false);
  const [menu, setMenu] = useState(false);

  // la page est statique : le statut admin est lu après chargement
  useEffect(() => {
    fetch('/api/auth', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { admin: false }))
      .then((j) => setAdmin(!!j.admin))
      .catch(() => {});
  }, []);

  // la version publique peut dater d'avant la dernière modification : l'admin voit la liste à jour
  useEffect(() => {
    if (!admin) return;
    fetch('/api/projects', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.projects && setProjects(j.projects))
      .catch(() => {});
  }, [admin]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu]);

  useEffect(() => {
    document.body.style.overflow = active !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  const close = useCallback(() => setActive(null), []);
  const activeProject = active !== null ? projects[active] : null;

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top" aria-label="Malcolm Boukaka, retour en haut">MB<span>.</span></a>
        <div className={`nav-links${menu ? ' open' : ''}`} id="menu" onClick={() => setMenu(false)}>
          <a href="#offre">OFFRE</a><a href="#work">RÉALISATIONS</a><a href="#methode">MÉTHODE</a><a href="#contact">CONTACT</a>
        </div>
        <div className="nav-end">
          <a className="nav-cta" href="#contact">PARLONS-EN ↗</a>
          <button className="nav-toggle" aria-expanded={menu} aria-controls="menu" onClick={() => setMenu(!menu)}>
            {menu ? 'FERMER' : 'MENU'}
          </button>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-meta"><span>OUTILS SUR MESURE POUR PME</span><span>PARIS / À DISTANCE</span></div>
        <h1 className="hero-title"><span>MOINS</span><span>D’EXCEL.</span><span className="outline">PLUS DE TEMPS.</span></h1>
        <div className="hero-bottom">
          <p>Stock, caisse, clients, suivi : je transforme vos fichiers Excel et vos groupes WhatsApp en un outil simple, que votre équipe utilise vraiment.</p>
          <a className="arrow-link" href="#work">VOIR DES EXEMPLES <span>↘</span></a>
        </div>
        <div className="hero-block" />
      </section>

      <section className="pains section-pad">
        <div className="section-index">01 / 05</div>
        <div>
          <p className="eyebrow">ÇA VOUS PARLE ?</p>
          <h2>VOTRE ACTIVITÉ<br /><em>TOURNE À LA MAIN.</em></h2>
          <ul className="pain-list">
            {PAINS.map((p, i) => <li key={p}><span>{pad(i + 1)}</span>{p}</li>)}
          </ul>
          <p className="lead">Ce n’est pas un problème de logiciel. C’est un problème d’organisation que personne n’a pris le temps de poser à plat. C’est là que j’interviens.</p>
        </div>
      </section>

      <section className="offer section-pad" id="offre">
        <div className="section-index">02 / 05</div>
        <div className="offer-head"><p className="eyebrow">CE QUE JE FAIS</p><h2>DU BRICOLAGE<br /><em>À L’OUTIL.</em></h2></div>
        <div className="offer-grid">
          {OFFERS.map((o) => (
            <div className="offer-card" key={o.n}>
              <span>{o.n}</span>
              <h3>{o.title}</h3>
              <p>{o.text}</p>
              <div className="tags">{o.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="work section-pad" id="work">
        <div className="section-heading">
          <span>03 / 05</span>
          <h2 aria-label="Réalisations"><span aria-hidden="true">RÉALI<br /><em>SATIONS</em></span></h2>
          <p>Des cas concrets. Faites défiler, cliquez pour ouvrir.</p>
        </div>
        <Carousel projects={projects} onOpen={setActive} />
      </section>

      <section className="process section-pad" id="methode">
        <div className="section-index">04 / 05</div>
        <div className="process-head"><p className="eyebrow">MA MÉTHODE</p><h2>SIMPLE,<br /><em>ET ÇA TIENT.</em></h2></div>
        <div className="process-list">
          {STEPS.map(([t, d], i) => (
            <div className="process-item" key={t}><span>{pad(i + 1)}</span><strong>{t}</strong><small>{d}</small></div>
          ))}
        </div>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="contact-top"><span>05 / 05</span><span>PREMIER ÉCHANGE OFFERT</span></div>
        <h2>ON EN<br /><em>PARLE ?</em></h2>
        <div className="contact-bottom">
          <p>30 minutes pour comprendre votre activité et voir si je peux vous aider. Sans engagement.</p>
          <div className="contact-links">
            {BOOKING_URL && <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">RÉSERVER 30 MIN ↗</a>}
            {LINKEDIN_URL && <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>}
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Premier échange')}`}>ME CONTACTER ↗</a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email">{CONTACT_EMAIL}</a>
          </div>
        </div>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} {LEGAL_NAME.toUpperCase()}</span>
        <a href="/mentions-legales">MENTIONS LÉGALES</a>
        <a href="#top">HAUT DE PAGE ↑</a>
      </footer>

      {activeProject && <CaseModal project={activeProject} index={active!} onClose={close} />}
      {admin && <AdminPanel projects={projects} setProjects={setProjects} />}
    </main>
  );
}
