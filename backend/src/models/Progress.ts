import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  subject: string;
  topic: string;
  score: number;
  timeSpent: number;
  completed: boolean;
  user: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be less than 0'],
      max: [100, 'Score cannot be more than 100'],
    },
    timeSpent: {
      type: Number,
      required: [true, 'Time spent is required'],
      min: [0, 'Time spent cannot be negative'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
progressSchema.index({ user: 1, subject: 1 });
progressSchema.index({ user: 1, topic: 1 });
progressSchema.index({ user: 1, createdAt: -1 });

export const Progress = mongoose.model<IProgress>('Progress', progressSchema); 