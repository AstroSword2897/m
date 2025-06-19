import { Request, Response, NextFunction } from 'express'
import { PracticeQuestion, PracticeQuestionModel } from '../models/PracticeQuestion'
import { AppError } from '../middleware/errorHandler'

export const createPracticeQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newQuestion: PracticeQuestion = req.body;
    // Assuming user ID is available on req.user from authentication middleware
    const createdQuestion = await PracticeQuestionModel.create({
      ...newQuestion,
      user: req.user.id, // Associate question with authenticated user
    });
    res.status(201).json(createdQuestion);
  } catch (error) {
    next(error);
  }
};

export const getPracticeQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Filter questions by authenticated user
    const questions = await PracticeQuestionModel.find({ user: req.user.id });
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

export const getPracticeQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Filter by ID and authenticated user
    const question = await PracticeQuestionModel.findById(id, req.user.id);
    if (question) {
      res.status(200).json(question);
    } else {
      next(new AppError('Practice question not found', 404));
    }
  } catch (error) {
    next(error);
  }
};

export const updatePracticeQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedFields: Partial<PracticeQuestion> = req.body;
    // Find and update by ID and authenticated user
    const updatedQuestion = await PracticeQuestionModel.update(id, updatedFields, req.user.id);
    if (updatedQuestion) {
      res.status(200).json(updatedQuestion);
    } else {
      next(new AppError('Practice question not found', 404));
    }
  } catch (error) {
    next(error);
  }
};

export const deletePracticeQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Delete by ID and authenticated user
    const success = await PracticeQuestionModel.delete(id, req.user.id);
    if (success) {
      res.status(204).send(); // No content for successful deletion
    } else {
      next(new AppError('Practice question not found', 404));
    }
  } catch (error) {
    next(error);
  }
}; 