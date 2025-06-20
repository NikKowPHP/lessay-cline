// @ts-expect-error - Temporary bypass for React types
import React, { useState, FormEvent, ChangeEvent } from 'react';
// @ts-expect-error - Temporary bypass for Next.js types
import { useRouter } from 'next/router';
// @ts-expect-error - Temporary bypass for auth types
import { useAuth } from '../lib/auth';

const OnboardingForm = () => {
  const [nativeLang, setNativeLang] = useState<string>('');
  const [targetLang, setTargetLang] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const router = useRouter();
  const { startDiagnostic } = useAuth();

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
    <div className="onboarding-form">
      <h1>Welcome to Lessay</h1>
      <p>Let's create your personalized learning profile</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Native Language:</label>
          <input
            type="text"
            value={nativeLang}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNativeLang(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Target Language:</label>
          <input
            type="text"
            value={targetLang}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetLang(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Primary Goal:</label>
          <input
            type="text"
            value={goal}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGoal(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Self-Assessed Level:</label>
          <input
            type="text"
            value={level}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLevel(e.target.value)}
            required
          />
        </div>
        <button type="submit">Start Diagnostic</button>
      </form>
    </div>
  );
};

export default OnboardingForm;