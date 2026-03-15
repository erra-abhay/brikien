import mongoose, { Schema } from 'mongoose';
import { IUser } from '@brikien/types';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'developer'], default: 'developer' },
  slug: { type: String, required: true, unique: true },
  photo: { type: String, default: '' },
  skills: [{ type: String }],
  bio: { type: String, default: '' },
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    portfolio: { type: String }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);
