import mongoose, { Document, Schema } from 'mongoose';
import { IAPSubject } from './APSubject';
import { IUser } from './User';

export interface IPracticeQuestion extends Document {
  question: string;
  type: 'multiple_choice' | 'free_response' | 'matching' | 'true_false';
  subject: IAPSubject['_id'];
  unit: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  createdBy: IUser['_id'];
  isPublic: boolean;
  tags: string[];
  attachments?: {
    type: 'image' | 'audio' | 'document';
    url: string;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const practiceQuestionSchema = new Schema<IPracticeQuestion>({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'free_response', 'matching', 'true_false'],
    required: true
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'APSubject',
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: Schema.Types.Mixed,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'audio', 'document'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Index for efficient searching
practiceQuestionSchema.index({ question: 'text', tags: 'text' });

export const PracticeQuestion = mongoose.model<IPracticeQuestion>('PracticeQuestion', practiceQuestionSchema); 