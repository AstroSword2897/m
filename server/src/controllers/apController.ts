import { Request, Response } from 'express';
import { APSubject } from '../models/APSubject';
import { StudyMaterial } from '../models/StudyMaterial';
import { PracticeQuestion } from '../models/PracticeQuestion';

// AP Subject Controllers
export const createSubject = async (req: Request, res: Response) => {
  try {
    const subject = new APSubject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ error: 'Error creating AP subject' });
  }
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await APSubject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching AP subjects' });
  }
};

export const getSubjectById = async (req: Request, res: Response) => {
  try {
    const subject = await APSubject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: 'AP subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching AP subject' });
  }
};

// Study Material Controllers
export const createStudyMaterial = async (req: Request, res: Response) => {
  try {
    const studyMaterial = new StudyMaterial({
      ...req.body,
      createdBy: (req as any).user._id
    });
    await studyMaterial.save();
    res.status(201).json(studyMaterial);
  } catch (error) {
    res.status(400).json({ error: 'Error creating study material' });
  }
};

export const getStudyMaterials = async (req: Request, res: Response) => {
  try {
    const { subject, unit, type, tags } = req.query;
    const query: any = {};

    if (subject) query.subject = subject;
    if (unit) query.unit = unit;
    if (type) query.type = type;
    if (tags) query.tags = { $in: (tags as string).split(',') };

    const materials = await StudyMaterial.find(query)
      .populate('subject')
      .populate('createdBy', 'name email');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching study materials' });
  }
};

// Practice Question Controllers
export const createPracticeQuestion = async (req: Request, res: Response) => {
  try {
    const question = new PracticeQuestion({
      ...req.body,
      createdBy: (req as any).user._id
    });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: 'Error creating practice question' });
  }
};

export const getPracticeQuestions = async (req: Request, res: Response) => {
  try {
    const { subject, unit, type, difficulty } = req.query;
    const query: any = {};

    if (subject) query.subject = subject;
    if (unit) query.unit = unit;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    const questions = await PracticeQuestion.find(query)
      .populate('subject')
      .populate('createdBy', 'name email');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching practice questions' });
  }
};

export const searchMaterials = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const searchQuery = {
      $text: { $search: query as string }
    };

    const [materials, questions] = await Promise.all([
      StudyMaterial.find(searchQuery)
        .populate('subject')
        .populate('createdBy', 'name email'),
      PracticeQuestion.find(searchQuery)
        .populate('subject')
        .populate('createdBy', 'name email')
    ]);

    res.json({
      materials,
      questions
    });
  } catch (error) {
    res.status(500).json({ error: 'Error searching materials' });
  }
}; 