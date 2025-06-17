import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IAPSubject } from './APSubject';

export interface IStudyMaterial extends Document {
  title: string;
  content: string;
  type: 'note' | 'concept_map' | 'practice_question' | 'flashcard' | 'summary';
  subject: IAPSubject['_id'];
  unit: string;
  tags: string[];
  createdBy: IUser['_id'];
  isPublic: boolean;
  attachments: {
    type: 'image' | 'audio' | 'document';
    url: string;
    name: string;
  }[];
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const studyMaterialSchema = new Schema<IStudyMaterial>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['note', 'concept_map', 'practice_question', 'flashcard', 'summary'],
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
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
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
  }],
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient searching
studyMaterialSchema.index({ title: 'text', content: 'text', tags: 'text' });

export const StudyMaterial = mongoose.model<IStudyMaterial>('StudyMaterial', studyMaterialSchema); 