// ROO-AUDIT-TAG :: plan-010-srs-tracking.md :: Implement review session UI
import { useState, useEffect } from 'react';
import { getDueReviews, processReviewSession } from '@/lib/srs';
import { type ReviewQuality } from '@/lib/srs-engine';
import _AudioCapture from './AudioCapture';
import ProgressIndicator from './feedback/ProgressIndicator';

interface ReviewItem {
  id: string;
  item: string;
  language: string;
}

interface AudioCaptureProps {
  onTranscript: (text: string) => void;
  disabled: boolean;
}

const AudioCapture = _AudioCapture as React.FC<AudioCaptureProps>;

export const ReviewSession = ({ userId }: { userId: string }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);

  useEffect(() => {
    const loadDueReviews = async () => {
      const dueReviews = await getDueReviews(userId);
      setReviews(dueReviews.map(review => ({
        id: review.id,
        item: review.item,
        language: review.language
      })));
      setSessionProgress(0);
    };
    loadDueReviews();
  }, [userId]);

  const handleSubmitResponse = async (quality: ReviewQuality) => {
    if (!reviews[currentIndex]) return;
    
    setIsProcessing(true);
    try {
      await processReviewSession(
        reviews[currentIndex].id,
        quality,
        Math.floor(Math.random() * 5000)
      );
      
      if (currentIndex < reviews.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSessionProgress((currentIndex + 1) / reviews.length);
      } else {
        setReviews([]);
        setCurrentIndex(0);
      }
    } finally {
      setIsProcessing(false);
      setUserResponse('');
    }
  };

  if (reviews.length === 0) {
    return <div className="p-4 text-center">No items to review right now!</div>;
  }

  const currentItem = reviews[currentIndex];

  return (
    <div className="max-w-md mx-auto p-4">
      <ProgressIndicator progress={sessionProgress} />
      
      <div className="my-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{currentItem.item}</h2>
        <p className="text-sm text-gray-500">{currentItem.language}</p>
      </div>

      <div className="mb-4">
        <textarea
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          placeholder="Type your response..."
          className="w-full p-2 border rounded h-32"
          disabled={isProcessing}
        />
      </div>

      <AudioCapture 
        onTranscript={(text: string) => setUserResponse(text)}
        disabled={isProcessing}
      />

      <div className="grid grid-cols-3 gap-2 mt-6">
        {[0, 1, 2, 3, 4, 5].map((quality) => (
          <button
            key={quality}
            onClick={() => handleSubmitResponse(quality as ReviewQuality)}
            className="p-2 bg-blue-100 rounded hover:bg-blue-200 disabled:opacity-50"
            disabled={isProcessing}
          >
            {quality} ({getQualityLabel(quality as ReviewQuality)})
          </button>
        ))}
      </div>
    </div>
  );
};

function getQualityLabel(quality: ReviewQuality): string {
  switch(quality) {
    case 0: return 'Forgot';
    case 1: return 'Hard';
    case 2: return 'Struggled';
    case 3: return 'Okay';
    case 4: return 'Good';
    case 5: return 'Perfect';
    default: return '';
  }
}
// ROO-AUDIT-TAG :: plan-010-srs-tracking.md :: END