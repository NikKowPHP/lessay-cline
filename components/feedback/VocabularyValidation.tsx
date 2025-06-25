// ROO-AUDIT-TAG :: plan-002-lesson-delivery.md :: Implement vocabulary validation visualization
import type { VocabularyValidation } from '@/types/lessons';

interface VocabularyValidationProps {
  validations: VocabularyValidation[];
}

export default function VocabularyValidation({ validations }: VocabularyValidationProps) {
  const validWords = validations.filter(v => v.isValid);
  const invalidWords = validations.filter(v => !v.isValid);

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">Vocabulary Check</div>
      
      {invalidWords.length > 0 && (
        <div className="bg-red-50 p-3 rounded-md">
          <div className="text-sm font-medium text-red-700 mb-2">Words to improve:</div>
          <div className="space-y-2">
            {invalidWords.map((word, i) => (
              <div key={i} className="flex items-start">
                <span className="text-red-600 font-medium mr-2">{word.word}:</span>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Suggestions:</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {word.suggestions.map((suggestion, j) => (
                      <span 
                        key={j}
                        className="bg-white px-2 py-1 rounded-md text-sm shadow-sm border"
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {validWords.length > 0 && (
        <div className="bg-green-50 p-3 rounded-md">
          <div className="text-sm font-medium text-green-700 mb-2">Correct words:</div>
          <div className="flex flex-wrap gap-2">
            {validWords.map((word, i) => (
              <span 
                key={i}
                className="bg-white px-2 py-1 rounded-md text-sm shadow-sm border border-green-200"
              >
                {word.word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// ROO-AUDIT-TAG :: plan-002-lesson-delivery.md :: END