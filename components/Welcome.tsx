import { useRouter } from 'next/router';

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to LanguageLessons!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Get ready to embark on your language learning journey. We&apos;ll start with
          a quick assessment to personalize your experience.
        </p>
        <button
          onClick={() => router.push('/onboarding')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Start Learning
        </button>
      </div>
    </div>
  );
}