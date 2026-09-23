import Site from '@/components/Site';
import { getProjects } from '@/lib/store';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [projects, admin] = await Promise.all([getProjects(), isAdmin()]);
  return <Site initialProjects={projects} admin={admin} />;
}
