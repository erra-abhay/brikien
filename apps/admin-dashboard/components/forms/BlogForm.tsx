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
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              {...register('title')} 
              className="w-full border rounded-md px-3 py-2"
              placeholder="Blog title"
            />
            {errors.title?.message && <p className="text-red-500 text-xs mt-1">{String(errors.title.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea 
              {...register('excerpt')} 
              className="w-full border rounded-md px-3 py-2 h-20 resize-none"
              placeholder="Brief summary of the blog"
            />
            {errors.excerpt?.message && <p className="text-red-500 text-xs mt-1">{String(errors.excerpt.message)}</p>}
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
          <div className="bg-white p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Publishing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select {...register('status')} className="w-full border rounded-md px-3 py-2 bg-white">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                {errors.status?.message && <p className="text-red-500 text-xs mt-1">{String(errors.status.message)}</p>}
              </div>

              <div className="pt-4 flex gap-2">
                <button 
                  type="button" 
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Featured Image</label>
              <Controller
                control={control}
                name="featuredImage"
                render={({ field }) => (
                  <ImageUpload value={field.value || ''} onChange={field.onChange} category="blog" />
                )}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <TagInput tags={field.value || []} onChange={field.onChange} placeholder="Add tag..." />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
