// ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: Create lesson types
// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Enhance LessonAttempt with analysis fields
export interface LessonAttempt {
  id: string;
  userId: string;
  lessonId: string;
  transcript: string;
  referenceText: string;
  responses: {
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timeTaken: number;
  }[];
  audioRecordings?: {
    questionId: string;
    audioUrl: string;
  }[];
  speechTiming?: {
    utterances: Array<{
      words: string[];
      duration: number;
    }>;
    duration: number;
  };
  phoneticDetails?: PhoneticAnalysis[];
  grammarErrors?: GrammarError[];
  startedAt: Date;
  completedAt: Date;
}

export interface PhoneticAnalysis {
  expectedSound: string;
  actualSound: string;
  word: string;
  position: number;
}

export interface GrammarError {
  type: 'tense' | 'agreement' | 'word_order' | 'other';
  expected: string;
  actual: string;
  context: string;
}
// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: END

// ROO-AUDIT-TAG :: plan-002-lesson-delivery.md :: Add feedback types
export interface GrammarSuggestion {
  startIndex: number;
  endIndex: number;
  message: string;
  suggestedCorrection: string;
}

export interface VocabularyValidation {
  word: string;
  isValid: boolean;
  suggestions: string[];
}
// ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: END