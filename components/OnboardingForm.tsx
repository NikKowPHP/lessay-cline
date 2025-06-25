// ROO-AUDIT-TAG :: audit_remediation_phase_1.md :: Replace console.log and connect to API
// ROO-AUDIT-TAG :: audit_remediation_phase_2.md :: Replace placeholder user ID
import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import logger from '@/lib/logger';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export default function OnboardingForm() {
  const user = useUser();
  const [formData, setFormData] = useState({
    nativeLanguage: '',
    targetLanguage: '',
    primaryGoal: '',
    comfortLevel: '',
    diagnosticText: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setFormData(prev => ({ ...prev, diagnosticText: transcript }));
        };

        recognition.onerror = () => {
          setIsSpeechSupported(false);
        };

        setRecognition(recognition);
      } else {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nativeLanguage) newErrors.nativeLanguage = 'Required';
    if (!formData.targetLanguage) newErrors.targetLanguage = 'Required';
    if (!formData.primaryGoal) newErrors.primaryGoal = 'Required';
    if (!formData.comfortLevel || 
        Number(formData.comfortLevel) < 1 || 
        Number(formData.comfortLevel) > 5) {
      newErrors.comfortLevel = 'Must be between 1-5';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      logger.info({ formData }, 'Form submitted');
      try {
        const response = await fetch('/api/onboarding/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            userId: user?.id || '',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit onboarding data');
        }
      } catch (error) {
        logger.error({ error }, 'Onboarding submission failed');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleRecording = () => {
    if (!recognition) return;
    
    if (isRecording) {
      recognition.stop();
    } else {
      setFormData(prev => ({ ...prev, diagnosticText: '' }));
      recognition.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Get Started</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Native Language</label>
        <input
          name="nativeLanguage"
          value={formData.nativeLanguage}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        {errors.nativeLanguage && <span className="text-red-500 text-sm">{errors.nativeLanguage}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Target Language</label>
        <input
          name="targetLanguage"
          value={formData.targetLanguage}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        {errors.targetLanguage && <span className="text-red-500 text-sm">{errors.targetLanguage}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Primary Learning Goal</label>
        <select
          name="primaryGoal"
          value={formData.primaryGoal}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select a goal</option>
          <option value="conversation">Conversational Fluency</option>
          <option value="business">Business Communication</option>
          <option value="travel">Travel Preparation</option>
        </select>
        {errors.primaryGoal && <span className="text-red-500 text-sm">{errors.primaryGoal}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Current Comfort Level (1-5)</label>
        <input
          type="number"
          name="comfortLevel"
          value={formData.comfortLevel}
          onChange={handleChange}
          min="1"
          max="5"
          className="w-full p-2 border rounded-md"
        />
        {errors.comfortLevel && <span className="text-red-500 text-sm">{errors.comfortLevel}</span>}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Initial Voice Diagnostic</label>
        {isSpeechSupported ? (
          <>
            <button
              type="button"
              onClick={toggleRecording}
              className={`w-full p-2 rounded-md ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white mb-2`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {formData.diagnosticText && (
              <div className="p-2 border rounded-md bg-gray-50">
                <p className="text-gray-700">{formData.diagnosticText}</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-red-500 text-sm">
            Speech recognition is not supported in your browser
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Continue
      </button>
    </form>
  );
}