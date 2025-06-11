# Production Polish Phase 5: State Management Implementation

## Tasks for Developer AI

### 1. Install Zustand
- **File:** `package.json`
- **Action:** Add Zustand as a dependency
- **Command:** `npm install zustand`
- **Verification:** `zustand` appears in `package.json` dependencies

### 2. Create User Store
- **File:** `/lib/stores/userStore.ts`
- **Action:** Create a global store for user session state
- **Content:**
```typescript
import { create } from 'zustand';

interface UserState {
  user: { id: string; email: string } | null;
  setUser: (user: { id: string; email: string } | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```
- **Verification:** File exists and exports `useUserStore`

### 3. Implement Auth Listener
- **File:** `/components/AuthListener.tsx`
- **Action:** Create component to sync Supabase auth with Zustand store
- **Content:**
```typescript
'use client';
import { useEffect } from 'react';
import { useUserStore } from '@/lib/stores/userStore';
import { supabase } from '@/lib/supabase/client';

export default function AuthListener() {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return null;
}
```
- **Verification:** Component exists and listens to auth changes

### 4. Update Layout Component
- **File:** `/components/AppLayout.tsx`
- **Action:** Add AuthListener to root layout
- **Modification:**
```typescript
import AuthListener from '@/components/AuthListener';

export default function AppLayout({ children }) {
  return (
    <>
      <AuthListener />
      {/* Existing layout content */}
    </>
  );
}
```
- **Verification:** AuthListener is rendered in the layout

### 5. Refactor LessonView Component
- **File:** `/components/LessonView.tsx`
- **Action:** Use Zustand store instead of local state
- **Modification:**
```typescript
import { useUserStore } from '@/lib/stores/userStore';

export default function LessonView() {
  const user = useUserStore((state) => state.user);
  // Remove local user state
}
```
- **Verification:** Component uses store instead of local state