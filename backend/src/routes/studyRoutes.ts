import express from 'express';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { studyController } from '../controllers/studyController';
import { studySchema } from '../schemas/studySchema';

const router = express.Router();

// Study Materials
router.post(
  '/materials',
  auth,
  validateRequest(studySchema.createMaterial),
  studyController.createMaterial
);
router.get('/materials', auth, studyController.getMaterials);
router.get('/materials/:id', auth, studyController.getMaterial);
router.put(
  '/materials/:id',
  auth,
  validateRequest(studySchema.updateMaterial),
  studyController.updateMaterial
);
router.delete('/materials/:id', auth, studyController.deleteMaterial);

// Flashcards
router.post(
  '/flashcards',
  auth,
  validateRequest(studySchema.createFlashcard),
  studyController.createFlashcard
);
router.get('/flashcards', auth, studyController.getFlashcards);
router.get('/flashcards/due', auth, studyController.getDueFlashcards);
router.put(
  '/flashcards/:id',
  auth,
  validateRequest(studySchema.updateFlashcard),
  studyController.updateFlashcard
);
router.delete('/flashcards/:id', auth, studyController.deleteFlashcard);

// Progress Tracking
router.post(
  '/progress',
  auth,
  validateRequest(studySchema.createProgress),
  studyController.createProgress
);
router.get('/progress', auth, studyController.getProgress);
router.get('/progress/stats', auth, studyController.getProgressStats);

export default router; 