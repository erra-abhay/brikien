'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { siteConfigSchema } from '@brikien/validators';
import { ISiteConfig } from '@brikien/types';
import TipTapEditor from '../editor/TipTapEditor';
import ImageUpload from '../editor/ImageUpload';
import { useState } from 'react';

interface HomepageFormProps {
  initialData: ISiteConfig;
  onSubmit: (data: any) => Promise<void>;
}

export default function HomepageForm({ initialData, onSubmit }: HomepageFormProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: initialData
  });

  const handleFormSubmit = async (data: any) => {
    try {
      setLoading(true);
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 max-w-4xl">
      <div className="bg-card/50 backdrop-blur-xl p-8 rounded-3xl border border-border space-y-6 shadow-2xl">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary pb-4 border-b border-border/50">ARCHIVE_MANIFEST</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Startup Name</label>
            <input {...register('startupName')} className="w-full border rounded-md px-3 py-2" />
            {errors.startupName?.message && <p className="text-red-500 text-xs mt-1">{String(errors.startupName.message)}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tagline</label>
            <input {...register('tagline')} className="w-full border rounded-md px-3 py-2" />
            {errors.tagline?.message && <p className="text-red-500 text-xs mt-1">{String(errors.tagline.message)}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Hero Section</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('hero.useGradient')} />
            <span className="text-sm font-medium">Use Animated Gradient Background</span>
          </label>
          <div>
            <label className="block text-sm font-medium mb-1">Background Image (Fallback to gradient if empty)</label>
            <Controller
              control={control}
              name="hero.backgroundImage"
              render={({ field }) => (
                <ImageUpload value={field.value || ''} onChange={field.onChange} category="content" />
              )}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">About Section</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Heading</label>
          <input {...register('about.heading')} className="w-full border rounded-md px-3 py-2" />
          {errors.about?.heading?.message && <p className="text-red-500 text-xs mt-1">{String(errors.about.heading.message)}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <Controller
            control={control}
            name="about.content"
            render={({ field }) => (
              <TipTapEditor content={field.value} onChange={field.onChange} />
            )}
          />
          {errors.about?.content?.message && <p className="text-red-500 text-xs mt-1">{String(errors.about.content.message)}</p>}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Contact Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Email</label><input {...register('contact.email')} className="w-full border rounded-md px-3 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Phone</label><input {...register('contact.phone')} className="w-full border rounded-md px-3 py-2" /></div>
          <div className="col-span-2"><label className="block text-sm font-medium mb-1">Location</label><input {...register('contact.location')} className="w-full border rounded-md px-3 py-2" /></div>
        </div>
        <div className="grid grid-cols-3 gap-4 border-t pt-4">
          <div><label className="block text-sm font-medium mb-1">GitHub</label><input {...register('contact.socialLinks.github')} className="w-full border rounded-md px-3 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">LinkedIn</label><input {...register('contact.socialLinks.linkedin')} className="w-full border rounded-md px-3 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Twitter</label><input {...register('contact.socialLinks.twitter')} className="w-full border rounded-md px-3 py-2" /></div>
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t border-border">
        <button type="submit" className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl text-sm font-black hover:opacity-90 shadow-2xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50" disabled={loading}>
          {loading ? 'TRANSMITTING...' : 'SYNC SYSTEM CONFIG'}
        </button>
      </div>
    </form>
  );
}
