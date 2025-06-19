import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { StudyMaterialModel, IStudyMaterial } from '../models/StudyMaterial';
import { Flashcard } from '../models/Flashcard';
import { Progress } from '../models/Progress';
import { logger } from '../utils/logger';

export const studyController = {
  // Study Materials
  createMaterial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const materialData: IStudyMaterial = { ...req.body, userId: req.user.id };
      const material = await StudyMaterialModel.create(materialData);
      res.status(201).json(material);
    } catch (error) {
      next(error);
    }
  },

  getMaterials: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const materials = await StudyMaterialModel.find({ userId: req.user.id });
      res.json(materials);
    } catch (error) {
      next(error);
    }
  },

  getMaterial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const material = await StudyMaterialModel.findById(req.params.id, req.user.id);
      if (!material) {
        throw new AppError('Material not found', 404);
      }
      res.json(material);
    } catch (error) {
      next(error);
    }
  },

  updateMaterial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const material = await StudyMaterialModel.update(req.params.id, req.body, req.user.id);
      if (!material) {
        throw new AppError('Material not found', 404);
      }
      res.json(material);
    } catch (error) {
      next(error);
    }
  },

  deleteMaterial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const materialDeleted = await StudyMaterialModel.delete(req.params.id, req.user.id);
      if (!materialDeleted) {
        throw new AppError('Material not found', 404);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // Flashcards
  createFlashcard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const flashcard = await Flashcard.create({
        ...req.body,
        user: req.user.id,
      });
      res.status(201).json(flashcard);
    } catch (error) {
      next(error);
    }
  },

  getFlashcards: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const flashcards = await Flashcard.find({ user: req.user.id });
      res.json(flashcards);
    } catch (error) {
      next(error);
    }
  },

  getDueFlashcards: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const flashcards = await Flashcard.find({
        user: req.user.id,
        nextReview: { $lte: new Date() },
      });
      res.json(flashcards);
    } catch (error) {
      next(error);
    }
  },

  updateFlashcard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const flashcard = await Flashcard.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        { new: true }
      );
      if (!flashcard) {
        throw new AppError('Flashcard not found', 404);
      }
      res.json(flashcard);
    } catch (error) {
      next(error);
    }
  },

  deleteFlashcard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const flashcard = await Flashcard.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });
      if (!flashcard) {
        throw new AppError('Flashcard not found', 404);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // Progress
  createProgress: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const progress = await Progress.create({
        ...req.body,
        user: req.user.id,
      });
      res.status(201).json(progress);
    } catch (error) {
      next(error);
    }
  },

  getProgress: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const progress = await Progress.find({ user: req.user.id });
      res.json(progress);
    } catch (error) {
      next(error);
    }
  },

  getProgressStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('User not authenticated', 401);
      }
      const stats = await Progress.aggregate([
        { $match: { user: req.user.id } },
        {
          $group: {
            _id: '$subject',
            averageScore: { $avg: '$score' },
            totalTimeSpent: { $sum: '$timeSpent' },
            completedTopics: {
              $sum: { $cond: ['$completed', 1, 0] },
            },
          },
        },
      ]);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },
}; 