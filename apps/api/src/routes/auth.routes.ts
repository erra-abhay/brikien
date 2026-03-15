import { Router } from 'express';
import { login, logout, refresh, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';
import { loginLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);

export default router;
