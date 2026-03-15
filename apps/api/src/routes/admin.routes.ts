import { Router } from 'express';
import {
  getSiteConfig,
  updateSiteConfig,
  getDevelopers,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  getProjects,
  deleteProject,
  getBlogs,
  updateBlog,
  deleteBlog,
  getMessages,
  updateMessage,
  deleteMessage,
  exportMessages
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.route('/site-config')
  .get(getSiteConfig)
  .put(updateSiteConfig);

router.route('/developers')
  .get(getDevelopers)
  .post(createDeveloper);

router.route('/developers/:id')
  .put(updateDeveloper)
  .delete(deleteDeveloper);

router.route('/projects')
  .get(getProjects);

router.route('/projects/:id')
  .delete(deleteProject);

router.route('/blogs')
  .get(getBlogs);

router.route('/blogs/:id')
  .put(updateBlog)
  .delete(deleteBlog);

router.route('/messages')
  .get(getMessages);

router.route('/messages/export')
  .get(exportMessages);

router.route('/messages/:id')
  .put(updateMessage)
  .delete(deleteMessage);

export default router;
