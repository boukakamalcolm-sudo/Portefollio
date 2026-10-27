import AdminGear from './AdminGear';
import Footer from './Footer';
import Nav, { type NavConfig } from './Nav';

// Mise en page commune : en-tête fixe, contenu pleine largeur, pied de page sur une ligne.
// `theme` enveloppe toute la page dans une classe de thème : la DA rouge par défaut.
export default function Shell({ active, nav, owner, email, theme = 'da-rouge', children }: {
  active?: string;
  nav?: NavConfig;
  owner?: string;
  email?: string;
  theme?: string;
  children: React.ReactNode;
}) {
  const page = (
    <>
      <Nav active={active} config={nav} />
      <main id="contenu" className="main">{children}</main>
      <Footer name={owner} email={email} />
      <AdminGear />
    </>
  );
  return theme ? <div className={theme}>{page}</div> : page;
}
