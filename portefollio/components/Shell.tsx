import AdminGear from './AdminGear';
import Footer from './Footer';
import Nav, { type NavConfig } from './Nav';

// Mise en page commune : en-tête fixe, contenu pleine largeur, pied de page sur une ligne.
// La page freelance passe son propre en-tête et son nom pour ne renvoyer nulle part vers le portfolio.
export default function Shell({ active, nav, owner, email, children }: {
  active?: string;
  nav?: NavConfig;
  owner?: string;
  email?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav active={active} config={nav} />
      <main id="contenu" className="main">{children}</main>
      <Footer name={owner} email={email} />
      <AdminGear />
    </>
  );
}
