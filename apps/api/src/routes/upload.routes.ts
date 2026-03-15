import { Router } from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.controller';
import { authenticate } from '../middleware/authenticate';
import { uploadLimiter } from '../middleware/rateLimiter';
import { uploadMiddleware } from '../config/storage';

const router = Router();

router.use(authenticate);

router.post('/image', uploadLimiter, uploadMiddleware.single('image'), uploadImage);
router.delete('/image', deleteImage);

export default router;
