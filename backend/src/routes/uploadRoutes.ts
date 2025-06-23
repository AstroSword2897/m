import { Router } from 'express';
import multer from 'multer';
import { uploadChunk, parseFile } from '../controllers/uploadController';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

router.post('/upload/chunk', upload.single('chunk'), uploadChunk);
router.post('/parse/:fileId', parseFile);

export default router; 