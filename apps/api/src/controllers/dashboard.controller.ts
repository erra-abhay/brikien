import { Request, Response } from 'express';
import { Blog } from '../models/Blog.model';
import { Project } from '../models/Project.model';
import { User } from '../models/User.model';
import { generateSlug } from '../utils/slug.utils';
import { deleteImage } from '../utils/image.utils';

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogsCount = await Blog.countDocuments({ author: req.user.id });
    const projectsCount = await Project.countDocuments({ developers: req.user.id });
    res.json({ success: true, data: { blogsCount, projectsCount } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getMyBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = generateSlug(req.body.title);
    const blog = await Blog.create({
      ...req.body,
      slug,
      author: req.user.id
    });
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { ...req.body, slug: req.body.title ? generateSlug(req.body.title) : undefined },
      { new: true }
    );
    if (!blog) {
      res.status(404).json({ success: false, error: 'Blog not found' });
      return;
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!blog) {
      res.status(404).json({ success: false, error: 'Blog not found' });
      return;
    }
    if (blog.featuredImage) {
      await deleteImage(blog.featuredImage);
    }
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getMyProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({ developers: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = generateSlug(req.body.title);
    const project = await Project.create({
      ...req.body,
      slug
    });
    // Add current user to developers if not included
    if (!project.developers.includes(req.user.id)) {
      project.developers.push(req.user.id);
      await project.save();
    }
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, developers: req.user.id },
      { ...req.body, slug: req.body.title ? generateSlug(req.body.title) : undefined },
      { new: true }
    );
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, developers: req.user.id });
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }
    if (project.featuredImage) {
      await deleteImage(project.featuredImage);
    }
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const currUser = await User.findById(req.user.id);
    if (!currUser) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    
    if (req.body.photo && currUser.photo && currUser.photo !== req.body.photo) {
      await deleteImage(currUser.photo);
    }
    
    currUser.set(req.body);
    await currUser.save();
    
    res.json({ success: true, data: currUser });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
