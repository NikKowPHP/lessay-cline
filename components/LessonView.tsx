'use client'

import { useState } from 'react'

type Lesson = {
  lessonId: string
}

export default function LessonView() {
  const [lesson, setLesson] = useState<Lesson | null>(null)

  const startLesson = async () => {
    try {
      const response = await fetch('/api/lessons/start', {
        method: 'POST'
      })
      const data = await response.json()
      setLesson(data)
    } catch (error) {
      console.error('Failed to start lesson:', error)
    }
  }

  return (
    <div className="lesson-container">
      {!lesson && (
        <button onClick={startLesson}>
          Start New Lesson
        </button>
      )}
      
      {lesson && (
        <div className="lesson-content">
          <h2>Lesson {lesson.lessonId}</h2>
          <p>Your lesson content would appear here</p>
        </div>
      )}
    </div>
  )
}