import express from 'express';
import { auth } from '../middleware/auth';
import {
  createSubject,
  getSubjects,
  getSubjectById,
  createStudyMaterial,
  getStudyMaterials,
  createPracticeQuestion,
  getPracticeQuestions,
  searchMaterials
} from '../controllers/apController';

const router = express.Router();

// AP Subject routes
router.post('/subjects', auth, createSubject);
router.get('/subjects', getSubjects);
router.get('/subjects/:id', getSubjectById);

// Study Material routes
router.post('/materials', auth, createStudyMaterial);
router.get('/materials', getStudyMaterials);

// Practice Question routes
router.post('/questions', auth, createPracticeQuestion);
router.get('/questions', getPracticeQuestions);

// Search route
router.get('/search', searchMaterials);

export default router; 