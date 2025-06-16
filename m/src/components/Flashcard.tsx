import React, { useState } from 'react';
import type { Sm2Flashcard } from '../utils/sm2';

interface FlashcardProps {
  card: Sm2Flashcard;
  onReview: (cardId: number, quality: number) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onReview }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReview = (quality: number) => {
    onReview(card.id, quality);
    setIsFlipped(false); // Flip back after review
  };

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
      <div className="flashcard-content">
        <div className="flashcard-front">
          <p>{card.front}</p>
        </div>
        <div className="flashcard-back">
          <p>{card.back}</p>
          <div className="review-buttons">
            <button onClick={(e) => { e.stopPropagation(); handleReview(0); }}>Again (0)</button>
            <button onClick={(e) => { e.stopPropagation(); handleReview(3); }}>Hard (3)</button>
            <button onClick={(e) => { e.stopPropagation(); handleReview(4); }}>Good (4)</button>
            <button onClick={(e) => { e.stopPropagation(); handleReview(5); }}>Easy (5)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard; 