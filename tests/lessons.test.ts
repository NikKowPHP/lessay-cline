import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { generateLesson, getNextExercise } from '@/lib/lessons';
import { aiService } from '@/lib/ai-service';
import { db } from '@/lib/db';

vi.mock('@/lib/db');
vi.mock('@/lib/ai-service');

describe('Lesson Generation', () => {
  const mockUserId = 'user_123';
  const mockProgress = { averageDifficulty: 2 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate a lesson with exercises', async () => {
    const mockLesson = { id: 'lesson_123', title: 'Test Lesson' };
    const mockExercises = [{ id: 'ex_1', content: 'Test Exercise' }];

    db.lesson.create.mockResolvedValue(mockLesson);
    aiService.generateLessonContent.mockResolvedValue('Lesson content');
    aiService.generateExercises.mockResolvedValue([{ type: 'text', content: 'Exercise content' }]);
    db.exercise.create.mockResolvedValue(mockExercises[0]);

    const lesson = await generateLesson(mockUserId);

    expect(db.lesson.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        userId: mockUserId,
        difficulty: mockProgress.averageDifficulty + 1,
      }),
    }));

    expect(aiService.generateLessonContent).toHaveBeenCalledWith(mockProgress);
    expect(aiService.generateExercises).toHaveBeenCalledWith(mockProgress);

    expect(lesson).toHaveProperty('id');
    expect(lesson).toHaveProperty('exercises');
    expect(lesson.exercises).toHaveLength(1);
  });
});

describe('Exercise Sequencing', () => {
  const mockUserId = 'user_123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the next exercise based on progress', async () => {
    const mockProgress = { averageDifficulty: 2 };
    const mockExercise = { id: 'ex_1', difficulty: 3 };

    vi.spyOn(db.exercise, 'findFirst').mockResolvedValue(mockExercise);
    vi.spyOn(db.lesson, 'findFirst').mockResolvedValue({ userId: mockUserId });

    const exercise = await getNextExercise(mockUserId);

    expect(db.exercise.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        lesson: { userId: mockUserId },
        difficulty: { gte: mockProgress.averageDifficulty },
      }),
    }));

    expect(exercise).toEqual(mockExercise);
  });

  it('should return null if no exercises are available', async () => {
    vi.spyOn(db.exercise, 'findFirst').mockResolvedValue(null);

    const exercise = await getNextExercise(mockUserId);

    expect(exercise).toBeNull();
  });
});