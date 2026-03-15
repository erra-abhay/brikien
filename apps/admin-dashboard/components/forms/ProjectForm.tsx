'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectCreateSchema } from '@brikien/validators';
import { IProject, IUser, IBlog } from '@brikien/types';
import TipTapEditor from '../editor/TipTapEditor';
import ImageUpload from '../editor/ImageUpload';
import TagInput from '../shared/TagInput';
import { useState } from 'react';

interface ProjectFormProps {
  initialData?: IProject | null;
  developers: IUser[];
  blogs: IBlog[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function ProjectForm({ initialData, developers, blogs, onSubmit, onCancel }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      content: initialData.content,
      featuredImage: initialData.featuredImage,
      status: initialData.status,
      technologies: initialData.technologies,
      developers: initialData.developers.map((d: any) => typeof d === 'string' ? d : d._id),
      linkedBlog: initialData.linkedBlog,
      githubUrl: initialData.githubUrl || '',
      liveUrl: initialData.liveUrl || '',
    } : {
      title: '',
      description: '',
      content: '',
      featuredImage: '',
      status: 'upcoming',
      technologies: [],
      developers: [],
      linkedBlog: '',
      githubUrl: '',
      liveUrl: '',
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
              placeholder="Project title"
            />
            {errors.title?.message && <p className="text-red-500 text-xs mt-1">{String(errors.title.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              {...register('description')} 
              className="w-full border rounded-md px-3 py-2 h-20 resize-none"
              placeholder="Brief summary..."
            />
            {errors.description?.message && <p className="text-red-500 text-xs mt-1">{String(errors.description.message)}</p>}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">GitHub URL</label>
              <input 
                {...register('githubUrl')} 
                className="w-full border rounded-md px-3 py-2"
                placeholder="https://github.com/..."
              />
              {errors.githubUrl?.message && <p className="text-red-500 text-xs mt-1">{String(errors.githubUrl.message)}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Live URL</label>
              <input 
                {...register('liveUrl')} 
                className="w-full border rounded-md px-3 py-2"
                placeholder="https://..."
              />
              {errors.liveUrl?.message && <p className="text-red-500 text-xs mt-1">{String(errors.liveUrl.message)}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select {...register('status')} className="w-full border rounded-md px-3 py-2 bg-white">
                  <option value="upcoming">Upcoming</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status?.message && <p className="text-red-500 text-xs mt-1">{String(errors.status.message)}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Linked Blog</label>
                <select {...register('linkedBlog')} className="w-full border rounded-md px-3 py-2 bg-white">
                  <option value="">None</option>
                  {blogs.map(b => (
                    <option key={b._id} value={b._id}>{b.title}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-2">
                <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 transition" disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition" disabled={loading}>
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
                  <ImageUpload value={field.value || ''} onChange={field.onChange} category="project" />
                )}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Technologies</label>
              <Controller
                control={control}
                name="technologies"
                render={({ field }) => (
                  <TagInput tags={field.value || []} onChange={field.onChange} placeholder="React, Node..." />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Developers</label>
              <Controller
                control={control}
                name="developers"
                render={({ field }) => (
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                    {developers.map(dev => (
                      <label key={dev._id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={(field.value as string[])?.includes(dev._id)}
                          onChange={(e) => {
                            const newVals = e.target.checked 
                              ? [...((field.value as string[]) || []), dev._id]
                              : ((field.value as string[]) || []).filter((id: string) => id !== dev._id);
                            field.onChange(newVals);
                          }}
                        />
                        {dev.name}
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
