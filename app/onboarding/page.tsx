import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OnboardingFlow from '@/components/OnboardingFlow';

export default async function OnboardingPage() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.status === 'active') {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <OnboardingFlow />
      </div>
    </main>
  );
}