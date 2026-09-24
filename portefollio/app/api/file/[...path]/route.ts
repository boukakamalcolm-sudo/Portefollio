import { readFile, UPLOAD_DIR } from '@/lib/store';

// Sert les images et PDF des projets depuis le Blob store privé.
// Les noms ont un suffixe aléatoire : un fichier ne change jamais, d'où le cache d'un an.
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const pathname = (await params).path.join('/');
  if (!pathname.startsWith(UPLOAD_DIR) || pathname.includes('..')) return new Response('Introuvable', { status: 404 });
  const file = await readFile(pathname).catch(() => null);
  if (!file) return new Response('Introuvable', { status: 404 });
  return new Response(file.stream, {
    headers: {
      'Content-Type': file.blob.contentType,
      'Content-Length': String(file.blob.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
