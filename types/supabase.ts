export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          targetLang: string
          nativeLang: string
          createdAt: Date
        }
      }
      lessons: {
        Row: {
          id: string
          userId: string
          completedAt: Date | null
        }
      }
      exercises: {
        Row: {
          id: string
          type: string
          content: any
          difficulty: number
          language: string
          tags: string
          lessonId: string
        }
      }
      user_progress: {
        Row: {
          id: string
          userId: string
          metric: string
          score: number
          lastUpdated: Date
        }
      }
      srs_entries: {
        Row: {
          id: string
          userId: string
          item: string
          recallStrength: number
          nextReview: Date
          language: string
        }
      }
      voice_analyses: {
        Row: {
          id: string
          userId: string
          lessonId: string
          metrics: any
          audioUrl: string
          createdAt: Date
        }
      }
    }
  }
}