import AdminDashboard from '@/components/AdminDashboard';
import LoginForm from '@/components/LoginForm';
import { isAdmin } from '@/lib/auth';
import { getProjects } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAdmin())) return <LoginForm />;
  return <AdminDashboard initialProjects={await getProjects()} blobReady={!!process.env.BLOB_READ_WRITE_TOKEN} />;
}
