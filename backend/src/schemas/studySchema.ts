import { z } from 'zod';

const baseSchema = {
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
};

export const studySchema = {
  createMaterial: z.object({
    body: z.object({
      ...baseSchema,
      content: z.string().min(1),
      type: z.enum(['note', 'pdf', 'link', 'image']),
      subject: z.string().min(1),
    }),
  }),

  updateMaterial: z.object({
    params: z.object({
      id: z.string().min(1),
    }),
    body: z.object({
      ...baseSchema,
      content: z.string().min(1).optional(),
      type: z.enum(['note', 'pdf', 'link', 'image']).optional(),
      subject: z.string().min(1).optional(),
    }),
  }),

  createFlashcard: z.object({
    body: z.object({
      ...baseSchema,
      front: z.string().min(1),
      back: z.string().min(1),
      deck: z.string().min(1),
      difficulty: z.number().min(1).max(5).optional(),
    }),
  }),

  updateFlashcard: z.object({
    params: z.object({
      id: z.string().min(1),
    }),
    body: z.object({
      ...baseSchema,
      front: z.string().min(1).optional(),
      back: z.string().min(1).optional(),
      deck: z.string().min(1).optional(),
      difficulty: z.number().min(1).max(5).optional(),
      lastReviewed: z.date().optional(),
      nextReview: z.date().optional(),
    }),
  }),

  createProgress: z.object({
    body: z.object({
      subject: z.string().min(1),
      topic: z.string().min(1),
      score: z.number().min(0).max(100),
      timeSpent: z.number().min(0),
      completed: z.boolean(),
    }),
  }),
}; 