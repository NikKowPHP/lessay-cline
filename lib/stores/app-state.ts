import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
}

interface LessonProgress {
  id: string;
  progress: number;
}

interface AppState {
  user: User | null;
  currentLesson: LessonProgress | null;
  setUser: (user: User | null) => void;
  setLessonProgress: (lessonId: string, progress: number) => void;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      currentLesson: null,
      setUser: (user: User | null) => set({ user }),
      setLessonProgress: (lessonId: string, progress: number) =>
        set((state: AppState) => ({
          currentLesson: state.currentLesson?.id === lessonId
            ? { ...state.currentLesson, progress }
            : { id: lessonId, progress },
        })),
    }),
    {
      name: 'app-state',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Sync auth state with Supabase
supabase.auth.onAuthStateChange((_event, session) => {
  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? 'unknown@example.com',
      }
    : null;
  useAppStore.getState().setUser(user);
});

export default useAppStore;