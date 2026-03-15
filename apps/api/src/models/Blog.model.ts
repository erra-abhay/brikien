import mongoose, { Schema } from 'mongoose';
import { IBlog } from '@brikien/types';

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  featuredImage: { type: String, default: '' },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true } as any,
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  tags: [{ type: String }]
}, {
  timestamps: true
});

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
