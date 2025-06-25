// ROO-AUDIT-TAG :: plan-002-lesson-delivery.md :: Implement grammar correction visualization
import { GrammarSuggestion } from '@/types/lessons';

interface GrammarCorrectionProps {
  suggestions: GrammarSuggestion[];
  userInput: string;
}

export default function GrammarCorrection({ suggestions, userInput }: GrammarCorrectionProps) {
  const getHighlightedText = () => {
    if (!suggestions.length) return userInput;

    const parts = [];
    let lastIndex = 0;

    suggestions.forEach((suggestion) => {
      // Add text before the suggestion
      if (suggestion.startIndex > lastIndex) {
        parts.push(userInput.slice(lastIndex, suggestion.startIndex));
      }

      // Add highlighted suggestion
      parts.push(
        <span 
          key={`${suggestion.startIndex}-${suggestion.endIndex}`}
          className="underline decoration-blue-500 decoration-wavy"
          title={suggestion.message}
        >
          {userInput.slice(suggestion.startIndex, suggestion.endIndex)}
        </span>
      );

      lastIndex = suggestion.endIndex;
    });

    // Add remaining text
    if (lastIndex < userInput.length) {
      parts.push(userInput.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700">Grammar Suggestions</div>
      <div className="p-3 bg-blue-50 rounded-md">
        <div className="whitespace-pre-wrap">{getHighlightedText()}</div>
      </div>
      {suggestions.length > 0 && (
        <div className="text-sm text-blue-600">
          {suggestions[0].message} (click highlighted text for details)
        </div>
      )}
    </div>
  );
}
// ROO-AUDIT-TAG :: plan-002-lesson-delivery.md :: END