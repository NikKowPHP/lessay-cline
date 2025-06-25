// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: Create dashboard page
import Dashboard from '@/components/Dashboard';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return <div>Please sign in to view your dashboard</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Learning Progress</h1>
      <Dashboard />
    </div>
  );
}
// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: END