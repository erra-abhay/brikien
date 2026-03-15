import { Request, Response } from 'express';
import { SiteConfig } from '../models/SiteConfig.model';
import { Project } from '../models/Project.model';
import { Blog } from '../models/Blog.model';
import { User } from '../models/User.model';
import { Message } from '../models/Message.model';
import { hashIp } from '../utils/hash.utils';

export const getSiteConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const config = await SiteConfig.findOne() || await SiteConfig.create({});
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find().populate('developers', 'name photo role slug');
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).populate('developers', 'name photo role slug bio');
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find({ status: 'published' }).populate('author', 'name photo slug');
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' }).populate('author', 'name photo slug bio');
    if (!blog) {
      res.status(404).json({ success: false, error: 'Blog not found' });
      return;
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getDevelopers = async (req: Request, res: Response): Promise<void> => {
  try {
    const developers = await User.find({ isActive: true }).select('-password');
    res.json({ success: true, data: developers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getDeveloperBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const developer = await User.findOne({ slug: req.params.slug, isActive: true }).select('-password');
    if (!developer) {
      res.status(404).json({ success: false, error: 'Developer not found' });
      return;
    }
    res.json({ success: true, data: developer });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const msg = await Message.create({
      ...req.body,
      ipHash: hashIp(ip)
    });
    res.status(201).json({ success: true, data: msg });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
