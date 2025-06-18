import create from 'zustand';
import { Lesson, Exercise } from '@prisma/client';

interface UserState {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  lesson?: Lesson & { exercises: Exercise[] };
  exercise?: Exercise;
  setUser: (user: UserState['user']) => void;
  setLesson: (lesson: UserState['lesson']) => void;
  setExercise: (exercise: UserState['exercise']) => void;
}

export const useStore = create<UserState>((set) => ({
  setUser: (user) => set({ user }),
  setLesson: (lesson) => set({ lesson }),
  setExercise: (exercise) => set({ exercise }),
}));