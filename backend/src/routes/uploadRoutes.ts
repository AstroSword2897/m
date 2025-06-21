import { Router } from 'express';
import multer from 'multer';
import { uploadChunk, parseFile } from '../controllers/uploadController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload/chunk', upload.single('chunk'), uploadChunk);
router.post('/parse/:fileId', parseFile);

export default router; 