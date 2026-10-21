import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import { CONTACT_EMAIL, LEGAL, LEGAL_NAME } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Mentions légales',
  alternates: { canonical: '/mentions-legales' },
};

export default function MentionsLegales() {
  return (
    <>
      <Nav />
      <main id="contenu" className="legal">
        <h1>Mentions légales</h1>

        <h2>Éditeur du site</h2>
        <p>{LEGAL_NAME}{LEGAL.status && ` · ${LEGAL.status}`}</p>
        {LEGAL.siret && <p>SIRET : {LEGAL.siret}</p>}
        {LEGAL.address && <p>{LEGAL.address}</p>}
        <p>Contact : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
        <p>Directeur de la publication : {LEGAL_NAME}</p>

        <h2>Hébergement</h2>
        <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis · vercel.com</p>

        <h2>Données personnelles</h2>
        <p>
          Ce site ne contient pas de formulaire et ne collecte aucune donnée personnelle. Si vous m’écrivez par e-mail,
          votre message sert uniquement à vous répondre ; vous pouvez demander sa suppression à tout moment à l’adresse
          ci-dessus. Le site n’utilise ni outil de mesure d’audience ni cookie publicitaire. Un cookie technique est
          déposé uniquement lors de la connexion à l’espace d’administration.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, visuels et captures présentés sur ce site sont la propriété de leur auteur ou de ses clients, qui
          en ont autorisé la diffusion. Toute reproduction sans autorisation est interdite.
        </p>

        <p className="legal-back"><a href="/">← Retour au site</a></p>
      </main>
      <Footer />
    </>
  );
}
