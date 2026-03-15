import mongoose, { Schema } from 'mongoose';
import { IProject } from '@brikien/types';

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  featuredImage: { type: String, default: '' },
  status: { type: String, enum: ['completed', 'in-progress', 'upcoming'], default: 'upcoming' },
  technologies: [{ type: String }],
  developers: [{ type: Schema.Types.ObjectId, ref: 'User' }] as any,
  linkedBlog: { type: Schema.Types.ObjectId, ref: 'Blog' } as any,
  githubUrl: { type: String },
  liveUrl: { type: String }
}, {
  timestamps: true
});

export const Project = mongoose.model<IProject>('Project', projectSchema);
