'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/types';
import { BOOKING_URL, CONTACT_EMAIL, LEGAL_NAME, LINKEDIN_URL } from '@/lib/config';
import ContactForm from './ContactForm';
import HeroDash from './HeroDash';
import { CountUp } from './motion';


const PAINS = [
  ['Les équipes n’ont pas la même compréhension du problème utilisateur.', 'Discovery : confronter les besoins terrain aux objectifs métier.'],
  ['Les demandes s’accumulent sans critères clairs de priorité.', 'Prioriser selon la valeur, l’effort, les risques et la stratégie.'],
  ['Les équipes livrent une fonctionnalité sans savoir si elle aide vraiment.', 'Définir des critères de succès et apprendre après la mise en production.'],
  ['Un outil existe, mais les usages et l’adoption restent difficiles à mesurer.', 'Accompagner le changement et suivre les signaux d’adoption.'],
];

const OFFERS = [
  {
    n: '01',
    title: 'Discovery & cadrage',
    text: 'Comprendre les utilisateurs, observer les parcours, clarifier le problème et aligner les parties prenantes sur un objectif produit.',
    tags: ['RECHERCHE UTILISATEUR', 'PROBLEM STATEMENT'],
  },
  {
    n: '02',
    title: 'Stratégie & delivery',
    text: 'Transformer les besoins en backlog lisible, prioriser les évolutions, rédiger les user stories et coordonner métier, design et technique jusqu’à la livraison.',
    tags: ['ROADMAP', 'BACKLOG', 'USER STORIES'],
  },
  {
    n: '03',
    title: 'Adoption & impact',
    text: 'Définir les indicateurs utiles, préparer le déploiement, accompagner les utilisateurs et vérifier ce qui change réellement après la mise en service.',
    tags: ['KPI', 'CHANGE', 'AMÉLIORATION CONTINUE'],
  },
];

const STEPS = [
  ['Découvrir', 'Écouter les utilisateurs, analyser les irritants et les données disponibles'],
  ['Cadrer', 'Formuler le problème, la cible, la valeur attendue et les critères de succès'],
  ['Prioriser & livrer', 'Arbitrer le backlog, clarifier les user stories et travailler avec les équipes'],
  ['Mesurer & apprendre', 'Suivre les usages, recueillir le feedback et ajuster la feuille de route'],
];

const XP = [
  {
    period: '2025 – 2026',
    role: 'Conseiller SI · pilotage & stratégie',
    org: 'Ministère de la Culture',
    text: 'Cartographie du système d’information et des outils de 18 directions régionales. Contribution au cadrage et au déploiement d’un outil de suivi d’indicateurs dans le réseau des musées, de la définition des données à la mise en service.',
  },
  {
    period: '2024 – 2025',
    role: 'Chef de projet AMOA / transformation',
    org: 'Covéa Protection Juridique',
    text: 'Contribution à des projets de transformation des usages : environnement Microsoft 365, Teams et SharePoint, digital workplace et gestion documentaire. Interface entre besoins métiers, utilisateurs et solutions SI.',
  },
  {
    period: '2022 – 2024',
    role: 'Customer Success Manager',
    org: 'Beekast · éditeur SaaS',
    text: 'Déploiement de la solution, cadrage des besoins clients, animation d’ateliers et de formations, analyse des usages et coordination avec les équipes produit, marketing et SI. Une expérience au contact direct des utilisateurs et de leurs retours produit.',
  },
];

const FIGURES: [number, string][] = [
  [89, 'musées concernés par le déploiement d’un outil de suivi'],
  [550, 'collaborateurs accompagnés sur Microsoft 365 et SharePoint'],
  [50, 'applications recensées dans 18 directions régionales'],
];

function PainCard({ pain, fix, index }: { pain: string; fix: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button className={`pain-card${open ? ' open' : ''}`} aria-pressed={open} onClick={() => setOpen(!open)}>
        <span className="label">{pad(index + 1)}</span>
        <span className="pain-text">{pain}</span>
        <span className="pain-fix"><b aria-hidden="true">✓</b> {fix}</span>
      </button>
    </li>
  );
}


const pad = (n: number) => String(n).padStart(2, '0');

function Cover({ project, index }: { project: Project; index: number }) {
  const img = project.files.find((f) => f.kind === 'image');
  const accent = ['yellow', 'dark', 'grey'][index % 3];
  if (img) {
    return (
      <div className={`project-visual ${accent}`}>
        <Image src={img.url} alt="" fill className="cover-img" sizes="(max-width: 900px) 84vw, 44vw" draggable={false} />
        <span className="visual-label">{pad(index + 1)} / {project.title}</span>
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
      <span className="visual-label">{pad(index + 1)} / {project.title}</span>
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
                <span className="project-number">{pad(i + 1)} · {p.sector}</span>
                <h3>
                  {/* le bouton couvre toute la carte (voir .project-open::after) */}
                  <button
                    className="project-open"
                    onClick={(e) => {
                      if (drag.current.moved) { e.preventDefault(); drag.current.moved = false; return; }
                      onOpen(i);
                    }}
                  >
                    {p.title}
                  </button>
                </h3>
                <p>{p.subtitle}</p>
              </div>
              <span className="view" aria-hidden="true">Voir ↗</span>
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
          <span>{pad(index + 1)} / {project.sector}</span>
          <h2 id="case-title">{project.title}</h2>
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
          <h3>Ce qui a changé</h3>
          <p>{project.result}</p>
          <a className="result-cta" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Un projet comme ' + project.title)}`}>
            Un besoin similaire ? Parlons-en →
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
  const [projects] = useState(initialProjects);
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


  // surligneurs qui se dessinent à l'arrivée à l'écran
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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
          <a href="#offre">Approche</a><a href="#work">Projets</a><a href="#methode">Méthode</a><a href="#apropos">Parcours</a><a href="#contact">Contact</a>
        </div>
        <div className="nav-end">
          <a className="nav-cta" href="#contact">Parlons-en →</a>
          <button className="nav-toggle" aria-expanded={menu} aria-controls="menu" onClick={() => setMenu(!menu)}>
            {menu ? 'Fermer' : 'Menu'}
          </button>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-text">
          <p className="label">PRODUCT MANAGEMENT · PRODUCT OWNERSHIP · TRANSFORMATION</p>
          <h1 className="hero-title" data-reveal>Du problème<br />à la <mark>valeur produit.</mark></h1>
          <p className="hero-sub">
            Je fais le lien entre utilisateurs, métiers et équipes techniques pour transformer des besoins complexes en produits utiles, livrables et mesurables.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#work">
              Découvrir mes projets →
            </a>
            <a className="btn-link" href="#apropos">Explorer mon parcours ↘</a>
          </div>
        </div>
        <div className="hero-card" aria-hidden="true">
          <HeroDash />
          <p className="hero-flow">
            <span>Discovery</span><b>→</b><span>Delivery</span><b>→</b><span>Impact</span>
          </p>
        </div>
      </section>

      <section className="pains block yellow">
        <header className="block-head">
          <p className="label">01 — Ma conviction produit</p>
          <h2 data-reveal>Partir du problème, <mark>pas de la solution.</mark></h2>
          <p className="block-intro pain-hint">Les réflexes que j’applique pour construire des produits utiles.</p>
        </header>
        <div className="pain-grid">
          <p className="pain-lead">
            Une fonctionnalité n’a de valeur que si elle répond à un vrai besoin. Mon rôle : aligner la réalité du terrain, les objectifs métier et la capacité des équipes à livrer.
          </p>
          <ul className="pain-list">
            {PAINS.map(([pain, fix], i) => <PainCard key={pain} pain={pain} fix={fix} index={i} />)}
          </ul>
        </div>
      </section>

      <section className="offer block" id="offre">
        <header className="block-head">
          <p className="label">02 — De l’idée à l’impact</p>
          <h2>Une approche produit de bout en bout.</h2>
        </header>
        <div className="offer-grid">
          {OFFERS.map((o) => (
            <div className="offer-card" key={o.n}>
              <span className="label">{o.n}</span>
              <h3>{o.title}</h3>
              <p>{o.text}</p>
              <div className="tags">{o.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="work block grey" id="work">
        <header className="block-head">
          <p className="label">03 — Selected work</p>
          <h2>Des problèmes réels, des décisions produit.</h2>
          <p className="block-intro">Explorez les contextes, les choix, la livraison et les apprentissages de chaque projet.</p>
        </header>
        <Carousel projects={projects} onOpen={setActive} />
      </section>

      <section className="process block" id="methode">
        <div className="process-grid">
          <header className="block-head">
            <p className="label">04 — Mon operating model</p>
            <h2>Du discovery au delivery.</h2>
          </header>
          <ol className="process-list">
            {STEPS.map(([t, d], i) => (
              <li key={t}><span className="label">{i + 1}.</span><strong>{t}</strong><small>{d}</small></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about block" id="apropos">
        <header className="block-head">
          <p className="label">05 — Expérience & parcours</p>
          <h2>Malcolm Boukaka-Massengo.</h2>
        </header>
        <div className="about-grid">
          <div className="about-photo">
            <Image src="/malcolm.jpg" alt="Portrait de Malcolm Boukaka" width={552} height={552} sizes="(max-width: 900px) 90vw, 30vw" />
          </div>
          <div className="about-body">
            <p className="about-intro">
              Product Manager / Product Owner orienté métier, je fais le lien entre les besoins utilisateurs, les objectifs de l’organisation et les équipes de réalisation. Mon expérience couvre le SaaS, la transformation des usages et les systèmes d’information, avec un fil conducteur : clarifier les problèmes, aligner les parties prenantes et accompagner les solutions jusqu’à leur adoption.
            </p>
            <div className="figures">
              {FIGURES.map(([n, t]) => <div key={n}><strong><CountUp value={n} /></strong><span>{t}</span></div>)}
            </div>
            <ol className="xp">
              {XP.map((x) => (
                <li key={x.org}>
                  <span className="label">{x.period}</span>
                  <div>
                    <h3>{x.role} <small>· {x.org}</small></h3>
                    <p>{x.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="about-edu">
              <span className="label">Formation</span>
              Master Conseil et management des systèmes d’information, Institut Mines-Télécom (2026) · Bachelor INSEEC
              Business School · DUT Techniques de commercialisation
            </p>
            {LINKEDIN_URL && <a className="btn-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">Voir mon profil LinkedIn ↗</a>}
          </div>
        </div>
      </section>

      <section className="contact block yellow" id="contact">
        <header className="block-head">
          <p className="label">06 — Contact</p>
          <h2>Construisons la suite.</h2>
        </header>
        <div className="contact-grid">
          <div className="contact-side">
            <p>Vous recrutez un Product Manager ou un Product Owner capable de dialoguer avec les métiers et la technique ? Échangeons sur vos enjeux produit, vos utilisateurs et vos priorités.</p>
            <div className="contact-links">
              {BOOKING_URL && <a className="btn-link" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Réserver un créneau ↗</a>}
              <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              {LINKEDIN_URL && <a className="btn-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} {LEGAL_NAME}</span>
        <a href="/mentions-legales">Mentions légales</a>
        <a href="#top">Haut de page ↑</a>
      </footer>

      {activeProject && <CaseModal project={activeProject} index={active!} onClose={close} />}
      {admin && (
        <a className="gear" href="/admin" aria-label="Gérer les projets" title="Gérer les projets">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path fill="currentColor" d="M19.14 12.94c.04-.31.06-.62.06-.94s-.02-.63-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54A.48.48 0 0 0 13.92 2h-3.840a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.72 8.470a.48.48 0 0 0 .12.61l2.03 1.58c-.05.31-.07.63-.07.94s.02.63.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.620-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.48.48 0 0 0-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z" />
          </svg>
        </a>
      )}
    </main>
  );
}
