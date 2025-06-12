'use client'
import { useState, useEffect } from 'react'

interface LessonData {
  id: string
  userId: string
  lesson: {
    id: string
    title: string
    content: string
    difficulty: number
  }
}

export default function LessonView() {
  const [lesson, setLesson] = useState<LessonData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch('/api/lessons/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch lesson')
        }

        const lessonData: LessonData = await response.json()
        setLesson(lessonData)
      } catch (error) {
        console.error('Error fetching lesson:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLesson()
  }, [])

  if (isLoading) {
    return <div>Loading lesson...</div>
  }

  if (!lesson) {
    return <div>No lesson available</div>
  }

  return (
    <div className="lesson-container">
      <h2>{lesson.lesson.title}</h2>
      <div className="lesson-content">
        {lesson.lesson.content}
      </div>
      <div className="navigation-controls">
        <button>Previous</button>
        <button>Next</button>
      </div>
    </div>
  )
}