import { LEGAL_NAME } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {LEGAL_NAME}</span>
      <a href="/mentions-legales">Mentions légales</a>
      <a href="#top">Retour en haut ↑</a>
    </footer>
  );
}
