// ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: Create post-lesson analysis module
import type { LessonAttempt } from '../../types/lessons';
import logger from '../logger';

// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Enhance AnalysisResult with detailed diagnostics
export interface AnalysisResult {
  phoneticScore: number;
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  overallScore: number;
  weakAreas: string[];
  errorPatterns: ErrorPattern[];
  phoneticDetails: PhoneticAnalysis[];
  grammarErrors: GrammarError[];
}

export interface ErrorPattern {
  type: 'phonetic' | 'grammar' | 'vocabulary';
  pattern: string;
  frequency: number;
  examples: string[];
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

export class PostLessonAnalyzer {
  private readonly attempt: LessonAttempt;

  constructor(attempt: LessonAttempt) {
    this.attempt = attempt;
  }

  analyze(): AnalysisResult {
    logger.debug({ attemptId: this.attempt.id }, 'Starting lesson analysis');
    
    // ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Implement enhanced language analysis
    const { phoneticScore, phoneticDetails } = this.calculateDetailedPhoneticScore();
    const fluencyScore = this.calculateFluencyScore();
    const grammarScore = this.calculateGrammarScore();
    const vocabularyScore = this.calculateVocabularyScore();

    const overallScore = this.calculateOverallScore(
      phoneticScore,
      fluencyScore,
      grammarScore,
      vocabularyScore
    );

    const weakAreas = this.identifyWeakAreas(
      phoneticScore,
      fluencyScore,
      grammarScore,
      vocabularyScore
    );

    return {
      phoneticScore,
      phoneticDetails,
      errorPatterns: this.identifyErrorPatterns(),
      grammarErrors: this.identifyGrammarErrors(),
      fluencyScore,
      grammarScore,
      vocabularyScore,
      overallScore,
      weakAreas
    };
  }

  // ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: Implement phonetic accuracy scoring
  private calculateDetailedPhoneticScore(): { phoneticScore: number, phoneticDetails: PhoneticAnalysis[] } {
    const { transcript, referenceText } = this.attempt;
    
    // Get basic score using Levenshtein distance
    const distance = this.levenshteinDistance(
      transcript.toLowerCase(),
      referenceText.toLowerCase()
    );
    const maxLength = Math.max(transcript.length, referenceText.length);
    const phoneticScore = 1 - (distance / maxLength);

    // Detailed phonetic analysis
    const phoneticDetails: PhoneticAnalysis[] = [];
    const transcriptWords = transcript.toLowerCase().split(/\s+/);
    const referenceWords = referenceText.toLowerCase().split(/\s+/);

    referenceWords.forEach((refWord, wordIndex) => {
      const transcriptWord = transcriptWords[wordIndex] || '';
      const minLength = Math.min(refWord.length, transcriptWord.length);
      
      for (let i = 0; i < minLength; i++) {
        const refChar = refWord[i];
        const transChar = transcriptWord[i];
        
        if (refChar !== transChar) {
          phoneticDetails.push({
            expectedSound: this.getSoundDescription(refChar),
            actualSound: this.getSoundDescription(transChar),
            word: refWord,
            position: i
          });
        }
      }
    });

    return { phoneticScore, phoneticDetails };
  }

  private getSoundDescription(char: string): string {
    // Simplified phonetic description - would integrate with proper IPA in real system
    const sounds: Record<string, string> = {
      'a': 'ah vowel',
      'e': 'eh vowel',
      'i': 'ee vowel',
      'o': 'oh vowel',
      'u': 'oo vowel',
      'b': 'b consonant',
      'd': 'd consonant',
      'f': 'f consonant',
      // ... more mappings
    };
    return sounds[char] || char;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix = Array(b.length + 1)
      .fill(null)
      .map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) {
      matrix[0][i] = i;
    }
    for (let j = 0; j <= b.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + substitutionCost
        );
      }
    }

    return matrix[b.length][a.length];
  }
  // ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: END

  // ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: Implement fluency metrics calculation
  private calculateFluencyScore(): number {
    const { speechTiming } = this.attempt;
    
    if (!speechTiming?.utterances?.length) {
      return 0;
    }

    // Calculate words per minute
    const totalWords = speechTiming.utterances.reduce((sum, u) => sum + u.words.length, 0);
    const totalDuration = speechTiming.duration;
    const wpm = totalWords / (totalDuration / 60);

    // Calculate pause frequency (pauses per minute)
    const pauseCount = speechTiming.utterances.length - 1;
    const ppm = pauseCount / (totalDuration / 60);

    // Normalize scores (example thresholds)
    const wpmScore = Math.min(wpm / 150, 1); // 150 wpm = max score
    const ppmScore = 1 - Math.min(ppm / 6, 1); // 6 ppm = min score
    
    // Combine scores with weights
    return (wpmScore * 0.6) + (ppmScore * 0.4);
  }
  // ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: END

  // ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: Implement grammatical pattern recognition
  private calculateGrammarScore(): number {
    const { transcript, referenceText } = this.attempt;
    
    // Simple grammar checking by comparing verb forms
    const transcriptVerbs = this.extractVerbs(transcript);
    const referenceVerbs = this.extractVerbs(referenceText);
    
    let matchCount = 0;
    referenceVerbs.forEach((refVerb, i) => {
      if (transcriptVerbs[i] && transcriptVerbs[i].toLowerCase() === refVerb.toLowerCase()) {
        matchCount++;
      }
    });
    
    return referenceVerbs.length > 0 ? matchCount / referenceVerbs.length : 1;
  }

  private extractVerbs(text: string): string[] {
    // Simple verb extraction (would be replaced with proper NLP in production)
    return text.match(/\b(is|am|are|was|were|have|has|had|do|does|did)\b/gi) || [];
  }
  // ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: END

  // ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: Implement vocabulary recall assessment
  private calculateVocabularyScore(): number {
    const { transcript, referenceText } = this.attempt;
    
    // Extract key vocabulary from reference text
    const referenceWords = this.extractKeyVocabulary(referenceText);
    const transcriptWords = new Set(transcript.toLowerCase().split(/\W+/));
    
    let matchCount = 0;
    referenceWords.forEach(word => {
      if (transcriptWords.has(word.toLowerCase())) {
        matchCount++;
      }
    });
    
    return referenceWords.size > 0 ? matchCount / referenceWords.size : 1;
  }

  private extractKeyVocabulary(text: string): Set<string> {
    // Simple key word extraction (would be replaced with proper NLP in production)
    const words = text.match(/\b([A-Za-z]{4,})\b/g) || [];
    return new Set(words.map(w => w.toLowerCase()));
  }
  // ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: END

  private calculateOverallScore(...scores: number[]): number {
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private identifyWeakAreas(...scores: number[]): string[] {
    const weakAreas: string[] = [];
    const areas = ['phonetic', 'fluency', 'grammar', 'vocabulary'];
    
    scores.forEach((score, index) => {
      if (score < 0.6) {
        weakAreas.push(areas[index]);
      }
    });

    return weakAreas;
  }

  // ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Implement error pattern recognition
  private identifyErrorPatterns(): ErrorPattern[] {
    const patterns: ErrorPattern[] = [];
    
    // Group phonetic errors by sound
    const phoneticErrors = new Map<string, {count: number, examples: string[]}>();
    this.attempt.phoneticDetails?.forEach(detail => {
      const key = `${detail.expectedSound}-${detail.actualSound}`;
      const entry = phoneticErrors.get(key) || {count: 0, examples: []};
      entry.count++;
      entry.examples.push(detail.word);
      phoneticErrors.set(key, entry);
    });

    phoneticErrors.forEach((value, key) => {
      const [expected, actual] = key.split('-');
      patterns.push({
        type: 'phonetic',
        pattern: `${expected} → ${actual}`,
        frequency: value.count,
        examples: value.examples.slice(0, 3)
      });
    });

    // Add grammar error patterns
    const grammarPatterns = new Map<string, {count: number, examples: string[]}>();
    this.attempt.grammarErrors?.forEach(error => {
      const key = `${error.type}-${error.expected}-${error.actual}`;
      const entry = grammarPatterns.get(key) || {count: 0, examples: []};
      entry.count++;
      entry.examples.push(error.context);
      grammarPatterns.set(key, entry);
    });

    grammarPatterns.forEach((value, key) => {
      const [type, expected, actual] = key.split('-');
      patterns.push({
        type: 'grammar',
        pattern: `${type}: ${expected} → ${actual}`,
        frequency: value.count,
        examples: value.examples.slice(0, 3)
      });
    });

    return patterns;
  }

  private identifyGrammarErrors(): GrammarError[] {
    const errors: GrammarError[] = [];
    const { transcript, referenceText } = this.attempt;
    
    // Simple grammar error detection (would use proper NLP in production)
    const transcriptVerbs = this.extractVerbs(transcript);
    const referenceVerbs = this.extractVerbs(referenceText);
    
    referenceVerbs.forEach((refVerb, i) => {
      const transVerb = transcriptVerbs[i];
      if (transVerb && transVerb.toLowerCase() !== refVerb.toLowerCase()) {
        errors.push({
          type: this.getGrammarErrorType(refVerb, transVerb),
          expected: refVerb,
          actual: transVerb,
          context: this.getErrorContext(transcript, transVerb)
        });
      }
    });

    return errors;
  }

  private getGrammarErrorType(expected: string, actual: string): 'tense' | 'agreement' | 'word_order' | 'other' {
    // Simple error type detection
    const baseForms: Record<string, string> = {
      'is': 'be', 'am': 'be', 'are': 'be', 'was': 'be', 'were': 'be',
      'has': 'have', 'have': 'have', 'had': 'have'
    };
    
    if (baseForms[expected.toLowerCase()] === baseForms[actual.toLowerCase()]) {
      return 'tense';
    }
    return 'other';
  }

  private getErrorContext(text: string, target: string): string {
    const words = text.split(/\s+/);
    const index = words.findIndex(w => w.toLowerCase() === target.toLowerCase());
    const start = Math.max(0, index - 2);
    const end = Math.min(words.length, index + 3);
    return words.slice(start, end).join(' ');
  }
  // ROO-AUDIT-TAG :: plan-005-ai-brain.md :: END
}
// ROO-AUDIT-TAG :: plan-003-adaptive-learning.md :: END