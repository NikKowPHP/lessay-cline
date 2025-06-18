import { describe, it, expect } from '@jest/globals';
import { aiService } from '@/lib/ai-service';

describe('AI Service', () => {
  it('should generate lesson content', async () => {
    const progress = { averageDifficulty: 2 };
    const content = await aiService.generateLessonContent(progress);

    expect(content).toBeTruthy();
    expect(content).toBeString();
    expect(content.length).toBeGreaterThan(0);
  });

  it('should generate exercises', async () => {
    const progress = { averageDifficulty: 2 };
    const exercises = await aiService.generateExercises(progress);

    expect(exercises).toBeInstanceOf(Array);
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises[0]).toHaveProperty('type');
    expect(exercises[0]).toHaveProperty('content');
  });

  it('should convert speech to text', async () => {
    const audio = Buffer.from('test audio');
    const transcript = await aiService.speechToText(audio);

    expect(transcript).toBeTruthy();
    expect(transcript).toBeString();
  });

  it('should analyze progress', async () => {
    const progress = { averageDifficulty: 2 };
    const feedback = await aiService.analyzeProgress(progress);

    expect(feedback).toBeTruthy();
    expect(feedback).toBeString();
    expect(feedback.length).toBeGreaterThan(0);
  });
});