
import React, { useState, FormEvent, ChangeEvent } from 'react';

import { useRouter } from 'next/router';



const OnboardingForm = () => {
  const [nativeLang, setNativeLang] = useState<string>('');
  const [targetLang, setTargetLang] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const router = useRouter();


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/users/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current-user-id', // TODO: Replace with actual user ID
          nativeLang,
          targetLang,
          goal,
          level
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      // Redirect to diagnostic after successful save
      router.push('/onboarding/diagnostic');
    } catch (error) {
      console.error('Profile save error:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to Lessay! 🌍
        </h1>
        <p className="text-lg text-gray-600">
          Let&apos;s create your personalized language learning journey
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-gray-500">
            1. Tell us about yourself<br/>
            2. Take a quick diagnostic<br/>
            3. Start your first lesson
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Native Language
            </label>
            <input
              type="text"
              value={nativeLang}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNativeLang(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Language
            </label>
            <input
              type="text"
              value={targetLang}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetLang(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Goal
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setGoal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Self-Assessed Level
            </label>
            <input
              type="text"
              value={level}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLevel(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start Diagnostic
          </button>
        </div>
        </form>
      </div>
    </div>
  
  );
};

export default OnboardingForm;