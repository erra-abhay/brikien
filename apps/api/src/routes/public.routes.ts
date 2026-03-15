import { Router } from 'express';
import {
  getSiteConfig,
  getProjects,
  getProjectBySlug,
  getBlogs,
  getBlogBySlug,
  getDevelopers,
  getDeveloperBySlug,
  createMessage
} from '../controllers/public.controller';
import { contactLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/site-config', getSiteConfig);
router.get('/projects', getProjects);
router.get('/projects/:slug', getProjectBySlug);
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.get('/developers', getDevelopers);
router.get('/developers/:slug', getDeveloperBySlug);
router.post('/messages', contactLimiter, createMessage);

export default router;
