import Freelance from '@/components/Freelance';
import { getProjects } from '@/lib/store';

// Page d'accueil statique, régénérée quand un projet est enregistré (revalidateTag dans lib/store.ts).
// Filet de sécurité : régénération au plus toutes les heures.
export const revalidate = 3600;

export default async function Page() {
  return <Freelance projects={await getProjects()} />;
}
