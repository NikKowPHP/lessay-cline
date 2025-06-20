'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { textToSpeech } from '@/lib/ai-service'

type Lesson = {
  id: string
  title: string
  content: string
  nextLessonId?: string
  prevLessonId?: string
}

export default function LessonView() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([])
  
  const playAudio = async (audioBuffer: Buffer, mimeType: string) => {
    const blob = new Blob([audioBuffer], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    await audio.play()
    URL.revokeObjectURL(url) // Clean up
  }

  const [newMessage, setNewMessage] = useState('')

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

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!currentLesson && (
          <button
            onClick={startLesson}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Lesson
          </button>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
                message.isUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!newMessage.trim()) return;

            try {
              // Add user message
              setMessages(prev => [...prev, {text: newMessage, isUser: true}]);
              setNewMessage('');
              
              // Simulate bot response
              const botResponse = "Great! Let's practice that.";
              setMessages(prev => [...prev, {text: botResponse, isUser: false}]);
              
              // Convert bot response to speech
              const { audioContent, mimeType } = await textToSpeech(botResponse);
              await playAudio(audioContent, mimeType);
            } catch (error) {
              console.error('Error processing message:', error);
            }
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your answer..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}