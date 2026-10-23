import { CONTACT_EMAIL, LEGAL_NAME, LINKEDIN_URL, LOCATION } from '@/lib/config';
import Clock from './Clock';

export default function Footer({ name = LEGAL_NAME }: { name?: string }) {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {name}</span>
      <a href="/mentions-legales">Mentions légales</a>
      <span className="footer-links">
        {LINKEDIN_URL && <><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>, </>}
        <a href={`mailto:${CONTACT_EMAIL}`}>E-mail</a>
      </span>
      <span>{LOCATION} · <Clock /></span>
    </footer>
  );
}
