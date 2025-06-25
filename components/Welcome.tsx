// ROO-AUDIT-TAG :: plan-001-onboarding.md :: Implement welcome screen after onboarding completion
import { useEffect, useState } from 'react';
import logger from '@/lib/logger';
import { useRouter } from 'next/router';

interface UserProfile {
  targetLanguage: string;
  learningGoal: string;
}

export default function Welcome() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/users/profile');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        logger.error({ err: error }, 'Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to LanguageLessons!
        </h1>
        
        {profile ? (
          <>
            <p className="text-lg text-gray-600 mb-4">
              Congratulations on completing your onboarding!
            </p>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <p className="text-gray-700 mb-2">
                Your target language: <span className="font-semibold">{profile.targetLanguage}</span>
              </p>
              <p className="text-gray-700">
                Learning goal: <span className="font-semibold">{profile.learningGoal}</span>
              </p>
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-600 mb-8">
            Loading your personalized learning plan...
          </p>
        )}

        <button
          onClick={() => router.push('/lessons')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Start Your First Lesson
        </button>
      </div>
    </div>
  );
}
// ROO-AUDIT-TAG :: plan-001-onboarding.md :: END