'use client'

import React from 'react'
import { useState, useEffect } from 'react'

type Lesson = {
  id: string
  title: string
  content: string
  nextLessonId?: string
  prevLessonId?: string
}

export default function LessonView() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    if (currentLesson?.id) {
      fetch(`/api/lessons/${currentLesson.id}`)
        .then(res => res.json())
        .then(data => setCurrentLesson(data))
    }
  }, [currentLesson?.id])

  const startLesson = async () => {
    try {
      const response = await fetch('/api/lessons/start', {
        method: 'POST'
      })
      const data = await response.json()
      setCurrentLesson(data)
    } catch (error) {
      console.error('Failed to start lesson:', error)
    }
  }

  const navigateLesson = async (lessonId?: string) => {
    if (!lessonId) return
    
    try {
      // Save progress before navigating
      await fetch(`/api/lessons/${currentLesson?.id}/submit-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ progress: 'in-progress' })
      })

      const response = await fetch(`/api/lessons/${lessonId}`)
      const data = await response.json()
      setCurrentLesson(data)
    } catch (error) {
      console.error('Lesson navigation failed:', error)
    }
  }

  return (
    <div className="lesson-container">
      {!currentLesson && (
        <button onClick={startLesson} className="start-lesson-btn">
          Start New Lesson
        </button>
      )}
      
      {currentLesson && (
        <div className="lesson-content">
          <h2>{currentLesson.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
          
          <div className="lesson-navigation">
            {currentLesson.prevLessonId && (
              <button
                onClick={() => navigateLesson(currentLesson.prevLessonId)}
                className="nav-btn prev-btn"
              >
                Previous Lesson
              </button>
            )}
            
            {currentLesson.nextLessonId && (
              <button
                onClick={() => navigateLesson(currentLesson.nextLessonId)}
                className="nav-btn next-btn"
              >
                Next Lesson
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}