
import {prisma} from '@/lib/prisma';
import { useRouter } from 'next/router';

export const  useAuth = () => {
  const router = useRouter();

  const startDiagnostic = () => {
    router.push('/onboarding/diagnostic');
  };

  const updateUserProfile = async (userId: string, profile: {
    nativeLang: string;
    targetLang: string;
    goal: string;
    level: string;
  }) => {
    await prisma.user.update({
      where: { id: userId },
      data: {
        nativeLang: profile.nativeLang,
        targetLang: profile.targetLang,
      }
    });
  };

  return { startDiagnostic, updateUserProfile };
};
