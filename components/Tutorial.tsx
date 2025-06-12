'use client'
import { useState } from 'react'

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0)
  
  const steps = [
    {
      title: 'Welcome to Lessons',
      content: 'Start your first lesson to begin learning.',
      action: 'Start Lesson'
    },
    {
      title: 'Practice Speaking',
      content: 'Use the microphone to practice pronunciation.',
      action: 'Try Speaking'
    },
    {
      title: 'Track Progress',
      content: 'Monitor your improvements over time.',
      action: 'View Progress'
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="tutorial-container p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
      <p className="text-lg mb-6">{steps[currentStep].content}</p>
      
      <div className="navigation-controls flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}