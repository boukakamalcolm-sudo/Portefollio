'use client';

import { useEffect, useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import type { Project, ProjectFile } from '@/lib/types';

const empty = (): Project => ({
  id: '',
  title: '',
  subtitle: '',
  sector: '',
  tags: [],
  problem: '',
  solution: '',
  result: '',
  files: [],
});

async function api(method: string, body: unknown) {
  const res = await fetch('/api/projects', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Erreur');
  return json.projects as Project[];
}

// Supprime côté serveur les fichiers envoyés mais finalement pas enregistrés
function discardUploads(urls: string[]) {
  if (!urls.length) return;
  fetch('/api/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
    keepalive: true,
  }).catch(() => {});
}

function Editor({ initial, onCancel, onSaved, uploads }: {
  initial: Project;
  onCancel: () => void;
  onSaved: (p: Project[]) => void;
  uploads: React.MutableRefObject<string[]>;
}) {
  const [p, setP] = useState<Project>(initial);
  const [tags, setTags] = useState(initial.tags.join(', '));
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const set = (k: keyof Project) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setP({ ...p, [k]: e.target.value });

  async function addFiles(list: FileList | null) {
    if (!list?.length) return;
    setError('');
    const added: ProjectFile[] = [];
    for (const file of Array.from(list)) {
      const isPdf = file.type === 'application/pdf';
      if (!isPdf && !file.type.startsWith('image/')) {
        setError(`${file.name} : seuls les images et les PDF sont acceptés`);
        continue;
      }
      try {
        setUploading(`Envoi de ${file.name}…`);
        const safe = file.name.replace(/[^\w.\-]+/g, '-');
        const blob = await upload(`projets/${safe}`, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          onUploadProgress: ({ percentage }) => setUploading(`Envoi de ${file.name} : ${Math.round(percentage)} %`),
        });
        uploads.current.push(blob.url);
        added.push({ url: blob.url, name: file.name, kind: isPdf ? 'pdf' : 'image' });
      } catch (e) {
        setError(`${file.name} : ${(e as Error).message}`);
      }
    }
    setUploading(null);
    setP((cur) => ({ ...cur, files: [...cur.files, ...added] }));
    if (fileInput.current) fileInput.current.value = '';
  }

  function moveFile(i: number, dir: -1 | 1) {
    const files = [...p.files];
    const j = i + dir;
    if (j < 0 || j >= files.length) return;
    [files[i], files[j]] = [files[j], files[i]];
    setP({ ...p, files });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const projects = await api('PUT', {
        ...p,
        tags: tags.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean),
      });
      const kept = new Set(projects.flatMap((x) => x.files.map((f) => f.url)));
      discardUploads(uploads.current.filter((u) => !kept.has(u)));
      uploads.current = [];
      onSaved(projects);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="editor" onSubmit={save}>
      <h3>{initial.id ? 'Modifier le projet' : 'Nouveau projet'}</h3>
      <label>Titre *<input value={p.title} onChange={set('title')} required maxLength={120} /></label>
      <label>Accroche<input value={p.subtitle} onChange={set('subtitle')} placeholder="Gestion de stock pour un commerce alimentaire" /></label>
      <label>Secteur / client<input value={p.sector} onChange={set('sector')} placeholder="Restauration · Paris" /></label>
      <label>Tags (séparés par des virgules)<input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="STOCK, CAISSE, APPLI WEB" /></label>
      <label>Le problème<textarea rows={4} value={p.problem} onChange={set('problem')} /></label>
      <label>Ce qui a été fait<textarea rows={4} value={p.solution} onChange={set('solution')} /></label>
      <label>Le résultat<textarea rows={3} value={p.result} onChange={set('result')} /></label>

      <div className="files">
        <span className="files-title">Fichiers (images et PDF). La 1re image sert de couverture.</span>
        {p.files.map((f, i) => (
          <div className="file-row" key={f.url}>
            {f.kind === 'image'
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={f.url} alt="" />
              : <span className="file-pdf">PDF</span>}
            <a href={f.url} target="_blank" rel="noopener noreferrer">{f.name}</a>
            <button type="button" onClick={() => moveFile(i, -1)} aria-label="Monter">↑</button>
            <button type="button" onClick={() => moveFile(i, 1)} aria-label="Descendre">↓</button>
            <button type="button" className="danger" onClick={() => setP({ ...p, files: p.files.filter((x) => x.url !== f.url) })} aria-label="Retirer">✕</button>
          </div>
        ))}
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={(e) => addFiles(e.target.files)}
          disabled={!!uploading}
        />
        {uploading && <p className="form-info">{uploading}</p>}
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="editor-actions">
        <button type="button" className="btn ghost" onClick={onCancel}>Annuler</button>
        <button className="btn" disabled={saving || !!uploading}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
      </div>
      <p className="form-info">Les fichiers retirés sont supprimés définitivement à l’enregistrement.</p>
    </form>
  );
}

export default function AdminPanel({ projects, setProjects }: { projects: Project[]; setProjects: (p: Project[]) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const uploads = useRef<string[]>([]);
  const gearRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  function stopEditing() {
    discardUploads(uploads.current);
    uploads.current = [];
    setEditing(null);
  }

  function closeDrawer() {
    if (editing && !confirm('Fermer sans enregistrer ?')) return;
    stopEditing();
    setOpen(false);
  }

  const closeRef = useRef(closeDrawer);
  closeRef.current = closeDrawer;

  useEffect(() => {
    if (!open) return;
    const gear = gearRef.current;
    drawerRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); gear?.focus(); };
  }, [open]);

  // fichiers envoyés puis onglet fermé sans enregistrer
  useEffect(() => {
    const onHide = () => discardUploads(uploads.current);
    window.addEventListener('pagehide', onHide);
    return () => window.removeEventListener('pagehide', onHide);
  }, []);

  async function run(fn: () => Promise<Project[]>) {
    setBusy(true);
    setError('');
    try {
      setProjects(await fn());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function remove(p: Project) {
    if (!confirm(`Supprimer « ${p.title} » et ses fichiers ? C’est définitif.`)) return;
    run(() => api('DELETE', { id: p.id }));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= projects.length) return;
    const order = projects.map((p) => p.id);
    [order[i], order[j]] = [order[j], order[i]];
    run(() => api('PATCH', { order }));
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/';
  }

  return (
    <>
      <button ref={gearRef} className="gear" onClick={() => setOpen(true)} aria-label="Gérer les projets" title="Gérer les projets">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path fill="currentColor" d="M19.14 12.94c.04-.31.06-.62.06-.94s-.02-.63-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54A.48.48 0 0 0 13.92 2h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.72 8.47a.48.48 0 0 0 .12.61l2.03 1.58c-.05.31-.07.63-.07.94s.02.63.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.48.48 0 0 0-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z" />
        </svg>
      </button>

      {open && (
        <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && !editing && setOpen(false)}>
          <aside ref={drawerRef} tabIndex={-1} className="drawer" role="dialog" aria-modal="true" aria-label="Gestion des projets">
            <div className="drawer-head">
              <strong>PROJETS</strong>
              <div>
                <button className="link" onClick={logout}>Déconnexion</button>
                <button className="drawer-close" onClick={closeDrawer} aria-label="Fermer">×</button>
              </div>
            </div>

            {editing ? (
              <Editor
                initial={editing}
                uploads={uploads}
                onCancel={stopEditing}
                onSaved={(p) => { setProjects(p); setEditing(null); }}
              />
            ) : (
              <>
                <button className="btn wide" onClick={() => setEditing(empty())}>+ Ajouter un projet</button>
                {error && <p className="form-error" role="alert">{error}</p>}
                <ul className="admin-list">
                  {projects.map((p, i) => (
                    <li key={p.id}>
                      <div>
                        <strong>{p.title}</strong>
                        <small>{p.files.length} fichier{p.files.length > 1 ? 's' : ''}</small>
                      </div>
                      <div className="row-actions">
                        <button onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label="Monter">↑</button>
                        <button onClick={() => move(i, 1)} disabled={busy || i === projects.length - 1} aria-label="Descendre">↓</button>
                        <button onClick={() => setEditing(p)} disabled={busy}>Modifier</button>
                        <button className="danger" onClick={() => remove(p)} disabled={busy}>Supprimer</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
