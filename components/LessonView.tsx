import { useState } from 'react';

export default function LessonView() {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 space-y-6">
      {/* Prompt Display Area */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Lesson Prompt</h2>
        <p className="text-gray-700">Translate this sentence to French: "Good morning, how are you?"</p>
      </div>

      {/* User Input Area */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Your Response</h2>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full p-2 border rounded-md min-h-[100px]"
          placeholder="Speak or type your response here..."
        />
        <div className="mt-2 flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Submit
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Record
          </button>
        </div>
      </div>

      {/* Feedback Panel */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Feedback</h2>
        <div className="text-gray-700">
          {feedback || 'Your feedback will appear here...'}
        </div>
      </div>
    </div>
  );
}