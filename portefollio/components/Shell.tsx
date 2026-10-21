import AdminGear from './AdminGear';
import Footer from './Footer';
import Nav from './Nav';

// Mise en page commune : en-tête fixe, contenu pleine largeur, pied de page sur une ligne
export default function Shell({ active, children }: { active?: string; children: React.ReactNode }) {
  return (
    <>
      <Nav active={active} />
      <main id="contenu" className="main">{children}</main>
      <Footer />
      <AdminGear />
    </>
  );
}
