import Site from '@/components/Site';
import { getProjects } from '@/lib/store';

// Page statique, régénérée quand un projet est enregistré (revalidateTag dans lib/store.ts).
// Filet de sécurité : régénération au plus toutes les heures.
export const revalidate = 3600;

export default async function Page() {
  const projects = await getProjects();
  return <Site initialProjects={projects} />;
}
