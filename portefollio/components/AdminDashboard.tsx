'use client';

import { useEffect, useRef, useState } from 'react';
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

const MAX_BYTES = 4.4 * 1024 * 1024;

// Réduit les photos lourdes (2400 px max, WebP) pour tenir sous la limite d'envoi de 4 Mo
async function compressImage(file: File): Promise<Blob> {
  if (file.type === 'image/gif' || file.size < 600 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const out = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.85));
    return out && out.size < file.size ? out : file;
  } catch {
    return file;
  }
}

function sendFile(data: Blob, name: string, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/upload?name=${encodeURIComponent(name)}`);
    xhr.setRequestHeader('Content-Type', data.type);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress((e.loaded / e.total) * 100);
    xhr.onload = () => {
      let json: { url?: string; error?: string } = {};
      try { json = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status < 300 && json.url) resolve(json.url);
      else reject(new Error(json.error || 'L’envoi a échoué'));
    };
    xhr.onerror = () => reject(new Error('Connexion interrompue'));
    xhr.send(data);
  });
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
        const data = isPdf ? file : await compressImage(file);
        if (data.size > MAX_BYTES) {
          throw new Error(isPdf
            ? 'PDF trop lourd (4 Mo maximum). Compressez-le d’abord, par exemple sur ilovepdf.com.'
            : 'image trop lourde, même après compression (4 Mo maximum)');
        }
        const url = await sendFile(data, file.name, (pct) => setUploading(`Envoi de ${file.name} : ${Math.round(pct)} %`));
        uploads.current.push(url);
        added.push({ url, name: file.name, kind: isPdf ? 'pdf' : 'image' });
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
        <span className="files-title">Fichiers (images et PDF, 4 Mo max ; les photos sont réduites automatiquement). La 1re image sert de couverture.</span>
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

export default function AdminDashboard({ initialProjects, blobReady }: { initialProjects: Project[]; blobReady: boolean }) {
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const uploads = useRef<string[]>([]);

  function stopEditing() {
    discardUploads(uploads.current);
    uploads.current = [];
    setEditing(null);
  }

  // fichiers envoyés puis onglet fermé sans enregistrer
  useEffect(() => {
    const onHide = () => discardUploads(uploads.current);
    window.addEventListener('pagehide', onHide);
    return () => window.removeEventListener('pagehide', onHide);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  async function run(fn: () => Promise<Project[]>, done: string) {
    setBusy(true);
    setError('');
    try {
      setProjects(await fn());
      setNotice(done);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function remove(p: Project) {
    if (!confirm(`Supprimer « ${p.title} » et ses fichiers ? C’est définitif.`)) return;
    run(() => api('DELETE', { id: p.id }), 'Projet supprimé');
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= projects.length) return;
    const order = projects.map((p) => p.id);
    [order[i], order[j]] = [order[j], order[i]];
    run(() => api('PATCH', { order }), 'Ordre enregistré');
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/';
  }

  return (
    <div className="admin">
      <header className="admin-head">
        <a href="/" className="brand">MB<span>.</span></a>
        <span className="label">Espace admin</span>
        <div className="admin-head-actions">
          <a className="btn-link" href="/" target="_blank" rel="noopener noreferrer">Voir le site ↗</a>
          <button className="btn-link" onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <main className="admin-main">
        {!blobReady && (
          <p className="admin-warning" role="alert">
            <strong>Stockage non branché :</strong> les projets affichés sont ceux par défaut et aucune modification ne
            peut être enregistrée. Dans Vercel : projet &gt; Storage &gt; Create &gt; Blob, puis connectez-le au projet et
            redéployez.
          </p>
        )}

        {editing ? (
          <section className="admin-card">
            <Editor
              initial={editing}
              uploads={uploads}
              onCancel={stopEditing}
              onSaved={(p) => { setProjects(p); setEditing(null); setNotice('Projet enregistré'); }}
            />
          </section>
        ) : (
          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <p className="label">Réalisations</p>
                <h1>{projects.length} projet{projects.length > 1 ? 's' : ''}</h1>
              </div>
              <button className="btn" onClick={() => setEditing(empty())} disabled={busy}>+ Ajouter un projet</button>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <ul className="admin-list">
              {projects.map((p, i) => {
                const cover = p.files.find((f) => f.kind === 'image');
                return (
                  <li key={p.id}>
                    {cover
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={cover.url} alt="" className="admin-thumb" />
                      : <span className="admin-thumb empty">{String(i + 1).padStart(2, '0')}</span>}
                    <div className="admin-item">
                      <strong>{p.title}</strong>
                      <small>{p.sector || 'Sans secteur'} · {p.files.length} fichier{p.files.length > 1 ? 's' : ''}</small>
                    </div>
                    <div className="row-actions">
                      <button onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label={`Monter ${p.title}`}>↑</button>
                      <button onClick={() => move(i, 1)} disabled={busy || i === projects.length - 1} aria-label={`Descendre ${p.title}`}>↓</button>
                      <button onClick={() => setEditing(p)} disabled={busy}>Modifier</button>
                      <button className="danger" onClick={() => remove(p)} disabled={busy}>Supprimer</button>
                    </div>
                  </li>
                );
              })}
            </ul>
            {!projects.length && <p className="form-info">Aucun projet. Ajoutez le premier.</p>}
          </section>
        )}
      </main>

      {notice && <p className="admin-toast" role="status">{notice}</p>}
    </div>
  );
}
