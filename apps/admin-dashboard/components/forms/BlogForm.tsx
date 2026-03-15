'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogCreateSchema } from '@brikien/validators';
import { IBlog } from '@brikien/types';
import TipTapEditor from '../editor/TipTapEditor';
import ImageUpload from '../editor/ImageUpload';
import TagInput from '../shared/TagInput';
import { useState } from 'react';

interface BlogFormProps {
  initialData?: IBlog | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function BlogForm({ initialData, onSubmit, onCancel }: BlogFormProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(blogCreateSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      content: initialData.content,
      excerpt: initialData.excerpt,
      featuredImage: initialData.featuredImage,
      status: initialData.status,
      tags: initialData.tags,
    } : {
      title: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      status: 'draft',
      tags: [],
    }
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Title</label>
            <input 
              {...register('title')} 
              className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="System transmission title"
            />
            {errors.title?.message && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{String(errors.title.message)}</p>}
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Excerpt</label>
            <textarea 
              {...register('excerpt')} 
              className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none h-24 resize-none"
              placeholder="Abstract summary..."
            />
            {errors.excerpt?.message && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{String(errors.excerpt.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <TipTapEditor content={field.value} onChange={field.onChange} />
              )}
            />
            {errors.content?.message && <p className="text-red-500 text-xs mt-1">{String(errors.content.message)}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm p-6 border border-border rounded-2xl shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/50 mb-6">Publishing</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Status</label>
                <select {...register('status')} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer">
                  <option value="draft">DRAFT</option>
                  <option value="published">PUBLISHED</option>
                </select>
                {errors.status?.message && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{String(errors.status.message)}</p>}
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={onCancel}
                  className="flex-1 px-4 py-3 border border-border rounded-xl text-sm font-bold hover:bg-muted/50 transition-all active:scale-95 disabled:opacity-50"
                  disabled={loading}
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-black hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'STORING...' : 'PERSIST'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-6 border border-border rounded-2xl shadow-xl space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-3">Featured Image</label>
              <Controller
                control={control}
                name="featuredImage"
                render={({ field }) => (
                  <ImageUpload value={field.value || ''} onChange={field.onChange} category="blog" />
                )}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-3">Tags</label>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <TagInput tags={field.value || []} onChange={field.onChange} placeholder="Enter tag metadata..." />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
