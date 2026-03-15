import { Request, Response } from 'express';
import { SiteConfig } from '../models/SiteConfig.model';
import { User } from '../models/User.model';
import { Project } from '../models/Project.model';
import { Blog } from '../models/Blog.model';
import { Message } from '../models/Message.model';
import { hashPassword } from '../utils/hash.utils';
import { generateSlug } from '../utils/slug.utils';
import { generateCsv } from '../utils/csv.utils';
import { deleteImage } from '../utils/image.utils';

export const getSiteConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const config = await SiteConfig.findOne() || await SiteConfig.create({});
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateSiteConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const config = await SiteConfig.findOne();
    if (!config) {
      const newConfig = await SiteConfig.create(req.body);
      res.json({ success: true, data: newConfig });
      return;
    }
    config.set(req.body);
    await config.save();
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getDevelopers = async (req: Request, res: Response): Promise<void> => {
  try {
    const developers = await User.find().select('-password');
    res.json({ success: true, data: developers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password, name, ...rest } = req.body;
    const hashedPassword = await hashPassword(password);
    const slug = generateSlug(name);
    
    const developer = await User.create({
      name,
      slug,
      password: hashedPassword,
      ...rest
    });
    
    const developerResponse = developer.toObject();
    delete developerResponse.password;
    
    res.status(201).json({ success: true, data: developerResponse });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    } else {
      delete updateData.password;
    }
    
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }

    const developer = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!developer) {
      res.status(404).json({ success: false, error: 'Developer not found' });
      return;
    }
    res.json({ success: true, data: developer });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    const developer = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password');
    if (!developer) {
      res.status(404).json({ success: false, error: 'Developer not found' });
      return;
    }
    res.json({ success: true, message: 'Developer soft deleted (deactivated)' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find().populate('developers', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
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

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
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
    const blog = await Blog.findByIdAndDelete(req.params.id);
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

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!message) {
      res.status(404).json({ success: false, error: 'Message not found' });
      return;
    }
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      res.status(404).json({ success: false, error: 'Message not found' });
      return;
    }
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const exportMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    const fields = ['name', 'email', 'subject', 'message', 'isRead', 'createdAt'];
    const csv = generateCsv(messages, fields);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('messages_export.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
