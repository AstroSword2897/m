// sm2.ts

export interface Sm2Flashcard {
  id: number;
  front: string;
  back: string;
  dueDate: Date;
  interval: number; // in days
  repetition: number; // how many times answered correctly in a row
  easeFactor: number; // E-factor
}

export const SM2_INITIAL_EASE_FACTOR = 2.5;
export const SM2_INITIAL_INTERVAL = 0;

export function sm2Algorithm(card: Sm2Flashcard, quality: number): Sm2Flashcard {
  // quality: 0-5 (0: complete blackout, 5: perfect recall)

  if (quality < 3) {
    card.repetition = 0;
    card.interval = 0; // Immediate review if recall is poor
  } else {
    card.repetition += 1;
    let newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) {
      newEaseFactor = 1.3;
    }
    card.easeFactor = newEaseFactor;

    if (card.repetition === 1) {
      card.interval = 1;
    } else if (card.repetition === 2) {
      card.interval = 6;
    } else {
      card.interval = Math.round(card.interval * card.easeFactor);
    }
  }

  const newDueDate = new Date();
  newDueDate.setDate(newDueDate.getDate() + card.interval);
  card.dueDate = newDueDate;

  return { ...card }; // Return a new object to ensure React state updates
}

// Initialize a new flashcard for SM2
export function initializeSm2Flashcard(id: number, front: string, back: string): Sm2Flashcard {
  const now = new Date();
  return {
    id,
    front,
    back,
    dueDate: now,
    interval: SM2_INITIAL_INTERVAL,
    repetition: 0,
    easeFactor: SM2_INITIAL_EASE_FACTOR,
  };
} 