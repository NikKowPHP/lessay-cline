import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';

const OnboardingForm: React.FC = () => {
  const [nativeLang, setNativeLang] = useState<string>('');
  const [targetLang, setTargetLang] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const router = useRouter();
  const { startDiagnostic } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Store profile data
    const profile = { nativeLang, targetLang, goal, level };
    localStorage.setItem('userProfile', JSON.stringify(profile));

    // Redirect to diagnostic
    router.push('/onboarding/diagnostic');
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