import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
];

const goals = [
  { id: 'travel', name: 'Travel' },
  { id: 'business', name: 'Business' },
  { id: 'school', name: 'School' },
  { id: 'friends', name: 'Friends' },
];

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [targetLang, setTargetLang] = useState('');
  const [nativeLang, setNativeLang] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/onboarding/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetLang,
          nativeLang,
          primaryGoal,
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Onboarding failed:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Lessay! 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <h3 className="text-lg font-medium">Step 1: Language Setup</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What&apos;s your native language?
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={nativeLang}
                    onChange={(e) => setNativeLang(e.target.value)}
                  >
                    <option value="">Select your native language</option>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What language do you want to learn?
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    <option value="">Select target language</option>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-lg font-medium">Step 2: Learning Goals</h3>
              <div className="grid grid-cols-2 gap-4">
                {goals.map((goal) => (
                  <Button
                    key={goal.id}
                    variant={primaryGoal === goal.id ? 'default' : 'outline'}
                    onClick={() => setPrimaryGoal(goal.id)}
                  >
                    {goal.name}
                  </Button>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button
                disabled={!nativeLang || !targetLang}
                onClick={() => setStep(2)}
              >
                Next
              </Button>
            ) : (
              <Button disabled={!primaryGoal} onClick={handleSubmit}>
                Complete Setup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}