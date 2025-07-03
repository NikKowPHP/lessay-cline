// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: Create dashboard page
import Dashboard from '@/components/Dashboard';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';

export default async function DashboardPage() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });
  const { data: { session } } = await supabase.auth.getSession();
  
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