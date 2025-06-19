import mongoose, { Document, Schema } from 'mongoose';

export interface IFlashcard extends Document {
  title: string;
  description?: string;
  front: string;
  back: string;
  deck: string;
  difficulty: number;
  user: mongoose.Types.ObjectId;
  tags?: string[];
  lastReviewed?: Date;
  nextReview?: Date;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const flashcardSchema = new Schema<IFlashcard>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    front: {
      type: String,
      required: [true, 'Front content is required'],
    },
    back: {
      type: String,
      required: [true, 'Back content is required'],
    },
    deck: {
      type: String,
      required: [true, 'Deck is required'],
      trim: true,
    },
    difficulty: {
      type: Number,
      min: [1, 'Difficulty must be at least 1'],
      max: [5, 'Difficulty cannot be more than 5'],
      default: 3,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    lastReviewed: {
      type: Date,
    },
    nextReview: {
      type: Date,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
flashcardSchema.index({ user: 1, deck: 1 });
flashcardSchema.index({ user: 1, nextReview: 1 });
flashcardSchema.index({ user: 1, tags: 1 });

export const Flashcard = mongoose.model<IFlashcard>('Flashcard', flashcardSchema); 