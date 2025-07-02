import getServerSession from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import OnboardingFlow from '@/components/OnboardingFlow';

export default async function OnboardingPage() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.status === 'active') {
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