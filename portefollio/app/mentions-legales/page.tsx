import type { Metadata } from 'next';
import { CONTACT_EMAIL, LEGAL, LEGAL_NAME } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Mentions légales',
  alternates: { canonical: '/mentions-legales' },
};

export default function MentionsLegales() {
  return (
    <main className="legal">
      <a href="/" className="brand">MB<span>.</span></a>
      <h1>MENTIONS<br />LÉGALES</h1>

      <h2>ÉDITEUR DU SITE</h2>
      <p>{LEGAL_NAME}{LEGAL.status && ` · ${LEGAL.status}`}</p>
      {LEGAL.siret && <p>SIRET : {LEGAL.siret}</p>}
      {LEGAL.address && <p>{LEGAL.address}</p>}
      <p>Contact : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
      <p>Directeur de la publication : {LEGAL_NAME}</p>

      <h2>HÉBERGEMENT</h2>
      <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis · vercel.com</p>

      <h2>DONNÉES PERSONNELLES</h2>
      <p>
        Ce site ne collecte aucune donnée personnelle en dehors des journaux techniques de l’hébergeur, n’utilise pas d’outil de mesure d’audience et ne dépose aucun
        cookie publicitaire. Les messages envoyés par e-mail servent uniquement à répondre à votre demande et ne sont
        pas transmis à des tiers. Vous pouvez demander leur suppression à tout moment à l’adresse ci-dessus.
      </p>

      <h2>PROPRIÉTÉ INTELLECTUELLE</h2>
      <p>
        Les textes, visuels et captures présentés sur ce site sont la propriété de leur auteur ou de ses clients, qui
        en ont autorisé la diffusion. Toute reproduction sans autorisation est interdite.
      </p>

      <p style={{ marginTop: 48 }}><a href="/">← Retour au site</a></p>
    </main>
  );
}
