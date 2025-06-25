// ROO-AUDIT-TAG :: plan-002-lesson-delivery.md :: Implement real-time STT processing with feedback mechanisms
import { useState, useEffect, useRef } from 'react';
import ErrorHighlight from './feedback/ErrorHighlight';
import PronunciationMeter from './feedback/PronunciationMeter';
import GrammarCorrection from './feedback/GrammarCorrection';
import VocabularyValidation from './feedback/VocabularyValidation';

export default function LessonView() {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{
    text: string;
    errors: string[];
    confidence: number;
    grammarSuggestions?: GrammarSuggestion[];
    vocabularyValidations?: VocabularyValidation[];
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'fr-FR'; // Example: French language

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          setUserInput(transcript);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error', event.error, event.message);
          setFeedback({
            text: 'Speech recognition failed',
            errors: [],
            confidence: 0
          });
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    
    if (!isRecording) {
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      recognitionRef.current.stop();
      setIsRecording(false);
      analyzeResponse();
    }
  };

  const analyzeResponse = () => {
    // Mock analysis - in real app this would call an API
    const errors = userInput.includes('bonjour') ? [] : ['bonjour'];
    const confidence = Math.random();
    
    // Mock grammar and vocabulary analysis
    const grammarSuggestions: GrammarSuggestion[] = !userInput.includes('comment')
      ? [{
          startIndex: userInput.indexOf('are'),
          endIndex: userInput.indexOf('are') + 3,
          message: 'Consider using "comment" instead of "are" in French',
          suggestedCorrection: 'comment'
        }]
      : [];

    const vocabularyValidations: VocabularyValidation[] = [
      {
        word: 'bonjour',
        isValid: userInput.includes('bonjour'),
        suggestions: ['bonjour', 'salut']
      },
      {
        word: 'comment',
        isValid: userInput.includes('comment'),
        suggestions: ['comment', 'comme']
      }
    ];
    
    setFeedback({
      text: userInput,
      errors,
      confidence,
      grammarSuggestions,
      vocabularyValidations
    });
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 space-y-6">
      {/* Prompt Display Area */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Lesson Prompt</h2>
        <p className="text-gray-700">
          Translate this sentence to French: "Good morning, how are you?"
        </p>
      </div>

      {/* User Input Area */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Your Response</h2>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full p-2 border rounded-md min-h-[100px]"
          placeholder="Speak or type your response here..."
        />
        <div className="mt-2 flex space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={analyzeResponse}
          >
            Submit
          </button>
          <button
            className={`${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded-md hover:bg-opacity-80`}
            onClick={toggleRecording}
          >
            {isRecording ? 'Stop' : 'Record'}
          </button>
        </div>
      </div>

      {/* Feedback Panel */}
      <div className="bg-white rounded-lg p-4 shadow-md space-y-4">
        <h2 className="text-xl font-semibold mb-2">Feedback</h2>
        {feedback ? (
            <div className="space-y-4">
              <div className="text-gray-700">
                <ErrorHighlight text={feedback.text} errors={feedback.errors} />
              </div>
              <PronunciationMeter confidence={feedback.confidence} />
              
              {feedback.grammarSuggestions && (
                <GrammarCorrection
                  suggestions={feedback.grammarSuggestions}
                  userInput={feedback.text}
                />
              )}
  
              {feedback.vocabularyValidations && (
                <VocabularyValidation
                  validations={feedback.vocabularyValidations}
                />
              )}
  
              <div className="text-sm text-gray-500">
                {feedback.errors.length > 0
                  ? 'Try focusing on the highlighted words'
                  : 'Great job! Keep practicing!'}
              </div>
            </div>
        ) : (
          <div className="text-gray-700">Your feedback will appear here...</div>
        )}
      </div>
    </div>
  );
}