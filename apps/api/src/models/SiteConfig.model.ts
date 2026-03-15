import mongoose, { Schema } from 'mongoose';
import { ISiteConfig } from '@brikien/types';

const siteConfigSchema = new Schema<ISiteConfig>({
  startupName: { type: String, default: 'Brikien Labs' },
  tagline: { type: String, default: 'Innovative solutions.' },
  about: {
    heading: { type: String, default: 'Who We Are' },
    content: { type: String, default: '<p>About Brikien Labs</p>' }
  },
  hero: {
    useGradient: { type: Boolean, default: true },
    backgroundImage: { type: String, default: '' }
  },
  contact: {
    email: { type: String, default: 'contact@brikienlabs.tech' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' }
    }
  }
}, {
  timestamps: true
});

export const SiteConfig = mongoose.model<ISiteConfig>('SiteConfig', siteConfigSchema);
