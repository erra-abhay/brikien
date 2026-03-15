// packages/types/index.ts

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'developer';
  slug: string;
  photo: string;
  skills: string[];
  bio: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string; // HTML content
  featuredImage: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  technologies: string[];
  developers: string[]; // User IDs
  linkedBlog?: string; // Blog ID
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string; // HTML
  excerpt: string;
  featuredImage: string;
  author: string; // User ID
  status: 'published' | 'draft';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ipHash: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISiteConfig {
  _id: string;
  startupName: string;
  tagline: string;
  about: {
    heading: string;
    content: string; // HTML
  };
  hero: {
    useGradient: boolean;
    backgroundImage: string;
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    socialLinks: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// DTOs
export interface BlogCreateDTO {
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  status: 'published' | 'draft';
  tags: string[];
}

export interface ProjectCreateDTO {
  title: string;
  description: string;
  content: string;
  featuredImage?: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  technologies: string[];
  developers: string[];
  linkedBlog?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface ProfileUpdateDTO {
  name?: string;
  email?: string;
  password?: string;
  photo?: string;
  skills?: string[];
  bio?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
}

export interface DeveloperCreateDTO extends ProfileUpdateDTO {
  name: string;
  email: string;
  role: 'admin' | 'developer';
  password?: string;
}

// Responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadResponse {
  url: string; // Relative path, e.g., /uploads/profiles/abc.webp
}
