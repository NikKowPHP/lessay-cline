// ROO-AUDIT-TAG :: plan-009-lesson-structure.md :: Implement lesson selection interface
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Lesson } from '@/types/lessons';

interface LessonSelectorProps {
  lessons: Lesson[];
}

export default function LessonSelector({ lessons }: LessonSelectorProps) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Choose a Lesson</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Link 
            key={lesson.id}
            href={`/lessons/${lesson.id}`}
            className="hover:scale-105 transition-transform duration-200"
          >
            <Card className="p-6 h-full flex flex-col">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
                <p className="text-gray-600 mb-4">{lesson.description}</p>
                
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {lesson.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {lesson.duration} mins
                  </span>
                </div>
                
                <div className="text-sm text-gray-500">
                  {lesson.concepts?.join(', ')}
                </div>
              </div>
              
              {lesson.progress && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 rounded-full h-2" 
                      style={{ width: `${lesson.progress * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {Math.round(lesson.progress * 100)}% complete
                  </div>
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
// ROO-AUDIT-TAG :: plan-009-lesson-structure.md :: END