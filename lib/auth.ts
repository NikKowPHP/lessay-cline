import { useRouter } from 'next/router';

export const useAuth = () => {
  const router = useRouter();

  const startDiagnostic = () => {
    router.push('/onboarding/diagnostic');
  };

  return { startDiagnostic };
};