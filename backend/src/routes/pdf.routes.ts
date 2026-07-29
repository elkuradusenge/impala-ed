import { Router } from 'express';
import { uploadPDF, getPDFs, getPDFById, servePDF, deletePDF } from '../controllers/pdf.controller';
import { protect, authorize, optionalAuth } from '../middleware/auth';
import upload from '../utils/upload';

const router = Router();

// Serve endpoint is public — no auth required so PDFs render inline in iframes
router.get('/:id/serve', servePDF);

// All other routes require auth
router.use(protect);
router.post('/upload', authorize('mentor', 'admin'), upload.single('pdf') as any, uploadPDF);
router.get('/', getPDFs);
router.get('/:id', getPDFById);
router.delete('/:id', authorize('mentor', 'admin'), deletePDF);

export default router;
