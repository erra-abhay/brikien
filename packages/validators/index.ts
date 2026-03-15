// packages/validators/index.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const blogCreateSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().max(300, 'Excerpt must be under 300 characters'),
  featuredImage: z.string().optional(),
  status: z.enum(['published', 'draft']),
  tags: z.array(z.string()).default([]),
});

export const projectCreateSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().max(500, 'Description is too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  featuredImage: z.string().optional(),
  status: z.enum(['completed', 'in-progress', 'upcoming']),
  technologies: z.array(z.string()).default([]),
  developers: z.array(z.string()).default([]),
  linkedBlog: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional().or(z.literal('')),
  photo: z.string().optional(),
  skills: z.array(z.string()).optional(),
  bio: z.string().optional(),
  socialLinks: z.object({
    github: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

export const developerCreateSchema = profileUpdateSchema.extend({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['admin', 'developer']).default('developer'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message is required'),
});

export const siteConfigSchema = z.object({
  startupName: z.string().min(2, 'Startup name is required'),
  tagline: z.string().min(5, 'Tagline is required'),
  about: z.object({
    heading: z.string().min(2, 'About heading is required'),
    content: z.string().min(10, 'About content is required'),
  }),
  hero: z.object({
    useGradient: z.boolean(),
    backgroundImage: z.string().optional(),
  }),
  contact: z.object({
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    location: z.string().optional(),
    socialLinks: z.object({
      github: z.string().url().optional().or(z.literal('')),
      linkedin: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
    }),
  }),
});
