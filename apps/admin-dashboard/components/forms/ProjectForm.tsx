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

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-2">GitHub Repository</label>
              <input 
                {...register('githubUrl')} 
                className="w-full bg-card/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="https://github.com/..."
              />
              {errors.githubUrl?.message && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{String(errors.githubUrl.message)}</p>}
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Live Deployment</label>
              <input 
                {...register('liveUrl')} 
                className="w-full bg-card/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="https://..."
              />
              {errors.liveUrl?.message && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{String(errors.liveUrl.message)}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm p-6 border border-border rounded-2xl shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/50 mb-6">PROJECT_METADATA</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Development Status</label>
                <select {...register('status')} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer">
                  <option value="upcoming">UPCOMING</option>
                  <option value="in-progress">IN_PROGRESS</option>
                  <option value="completed">COMPLETED</option>
                </select>
                {errors.status?.message && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{String(errors.status.message)}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Connected Log</label>
                <select {...register('linkedBlog')} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer">
                  <option value="">NONE</option>
                  {blogs.map(b => (
                    <option key={b._id} value={b._id}>{b.title.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onCancel} className="flex-1 px-4 py-3 border border-border rounded-xl text-sm font-bold hover:bg-muted/50 transition-all active:scale-95 disabled:opacity-50">
                  CANCEL
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-black hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50">
                  {loading ? 'STORING...' : 'PERSIST'}
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
