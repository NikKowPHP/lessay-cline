import React, { useState, useEffect } from 'react';
import { useSession as useNextAuthSession } from 'next-auth/react';
import { SRSEntry } from 'lib/srs';
import axios from 'axios';

// @ts-ignore
const SRSReview: React.FC = () => {
  // @ts-ignore
  const [session, loading] = useNextAuthSession();
  const [items, setItems] = useState<SRSEntry[]>([]);
  const [selectedItem, setSelectedItem] = useState<SRSEntry | null>(null);
  const [reviewResult, setReviewResult] = useState<number | null>(null);

  useEffect(() => {
    if (session) {
      // @ts-ignore
      axios.get(`/api/srs/due-items?userId=${session.user.id}`)
        // @ts-ignore
        .then(response => setItems(response.data.items))
        // @ts-ignore
        .catch(error => console.error('Error fetching SRS items:', error));
    }
  }, [session]);

  if (loading || !session) return <div>Loading...</div>;
  if (items.length === 0) return <div>No items due for review</div>;

  const handleReview = async () => {
    if (selectedItem && reviewResult !== null) {
      try {
        // @ts-ignore
        await axios.post('/api/srs/record-review', {
          entryId: selectedItem.id,
          reviewResult,
        });
        // @ts-ignore
        axios.get(`/api/srs/due-items?userId=${session.user.id}`)
          // @ts-ignore
          .then(response => setItems(response.data.items))
          // @ts-ignore
          .catch(error => console.error('Error fetching SRS items:', error));
        setSelectedItem(null);
        setReviewResult(null);
      } catch (error) {
        console.error('Error recording review:', error);
      }
    }
  };

  return (
    <div className="srs-review">
      <h2>Spaced Repetition Review</h2>
      <div className="item-list">
        {items.map(item => (
          <div
            key={item.id}
            className={`item ${selectedItem?.id === item.id ? 'selected' : ''}`}
            onClick={() => setSelectedItem(item)}
          >
            {item.itemId} (Next review: {new Date(item.nextReview).toLocaleDateString()})
          </div>
        ))}
      </div>
      {selectedItem && (
        <div className="review-panel">
          <h3>Review Item: {selectedItem.itemId}</h3>
          <div className="review-options">
            <button onClick={() => setReviewResult(0)}>Failed</button>
            <button onClick={() => setReviewResult(3)}>Passed (Medium confidence)</button>
            <button onClick={() => setReviewResult(5)}>Passed (High confidence)</button>
          </div>
          <button onClick={handleReview} disabled={reviewResult === null}>
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default SRSReview;