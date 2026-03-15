import { Router } from 'express';
import {
  getStats,
  getMyBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyProjects,
  createProject,
  updateProject,
  deleteProject,
  updateProfile
} from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.use(authenticate);

router.get('/stats', getStats);

router.get('/blogs', getMyBlogs);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

router.get('/projects', getMyProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

router.put('/profile', updateProfile);

export default router;
