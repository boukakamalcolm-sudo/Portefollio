import AdminGear from './AdminGear';
import Footer from './Footer';
import IntroCard from './IntroCard';

// Mise en page commune : carte d'identité à gauche, contenu à droite (empilés sur mobile)
export default function Shell({ home, active, children }: { home?: boolean; active?: string; children: React.ReactNode }) {
  return (
    <div className={`shell${home ? ' is-home' : ''}`}>
      <IntroCard home={home} active={active} />
      <main id="contenu" className="main">{children}</main>
      <Footer />
      <AdminGear />
    </div>
  );
}
