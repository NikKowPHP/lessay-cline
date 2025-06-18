# State Management in Lessay

## Overview

Lessay uses Zustand for client-side state management. Zustand is a small, fast, and scalable state management library that integrates well with React.

## Store Structure

The main application state is managed in the `app-state.ts` file, which exports a `useAppStore` hook. The store contains:

- `user`: The currently authenticated user (or null if not logged in)
- `currentLesson`: The currently active lesson and its progress
- `setUser`: Action to update the user state
- `setLessonProgress`: Action to update lesson progress

## Usage

### Accessing State

To access state in a component:

```typescript
import useAppStore from '@/lib/stores/app-state';

const user = useAppStore((state) => state.user);
const currentLesson = useAppStore((state) => state.currentLesson);
```

### Updating State

To update state:

```typescript
import useAppStore from '@/lib/stores/app-state';

// To update user
useAppStore.getState().setUser(user);

// To update lesson progress
useAppStore.getState().setLessonProgress(lessonId, progress);
```

## Persistence

The state is persisted in localStorage using Zustand's `persist` middleware. This ensures that user state and lesson progress are preserved across page refreshes.

## Authentication Integration

The store is integrated with Supabase authentication. When the authentication state changes (e.g., user logs in or out), the store automatically updates the user state:

```typescript
supabase.auth.onAuthStateChange((_event, session) => {
  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? 'unknown@example.com',
      }
    : null;
  useAppStore.getState().setUser(user);
});
```

## Best Practices

1. Keep state minimal and focused on global application state
2. For component-specific state, use React's `useState` hook
3. Always validate and sanitize data before updating state
4. Use selectors to access only the state you need in each component