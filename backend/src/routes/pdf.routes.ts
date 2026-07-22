import { Router } from 'express';
import { uploadPDF, getPDFs, getPDFById, servePDF, deletePDF } from '../controllers/pdf.controller';
import { protect, authorize } from '../middleware/auth';
import upload from '../utils/upload';

const router = Router();

router.use(protect);
router.post('/upload', authorize('mentor', 'admin'), upload.single('pdf') as any, uploadPDF);
router.get('/', getPDFs);
router.get('/:id', getPDFById);
router.get('/:id/serve', servePDF);
router.delete('/:id', authorize('mentor', 'admin'), deletePDF);

export default router;
