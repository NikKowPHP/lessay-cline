'use client'
import { useState } from 'react'

export default function Welcome() {
  const [progress] = useState(0)
  
  const steps = [
    'Complete your profile',
    'Take the placement test',
    'Start your first lesson'
  ]

  return (
    <div className="welcome-container p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to Lessay!</h1>
      
      <div className="greeting-section mb-8">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <p className="text-lg mb-4">
          Let's get you started on your language learning journey.
        </p>
      </div>

      <div className="quickstart-section mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>
        <ul className="list-disc pl-6">
          {steps.map((step, index) => (
            <li key={index} className="mb-2">{step}</li>
          ))}
        </ul>
      </div>

      <div className="progress-section">
        <h3 className="text-lg font-medium mb-2">
          Your Progress: {progress}% complete
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}