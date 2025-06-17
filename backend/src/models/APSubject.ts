import mongoose, { Document, Schema } from 'mongoose';

export interface IAPSubject extends Document {
  name: string;
  code: string;
  description: string;
  units: string[];
  examDate: Date;
  examFormat: {
    multipleChoice: {
      questions: number;
      timeMinutes: number;
      weight: number;
    };
    freeResponse: {
      questions: number;
      timeMinutes: number;
      weight: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const apSubjectSchema = new Schema<IAPSubject>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  units: [{
    type: String,
    required: true
  }],
  examDate: {
    type: Date,
    required: true
  },
  examFormat: {
    multipleChoice: {
      questions: Number,
      timeMinutes: Number,
      weight: Number
    },
    freeResponse: {
      questions: Number,
      timeMinutes: Number,
      weight: Number
    }
  }
}, {
  timestamps: true
});

export const APSubject = mongoose.model<IAPSubject>('APSubject', apSubjectSchema); 