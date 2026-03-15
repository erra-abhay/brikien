'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { developerCreateSchema } from '@brikien/validators';
import { IUser } from '@brikien/types';
import ImageUpload from '../editor/ImageUpload';
import TagInput from '../shared/TagInput';
import { useState } from 'react';

interface DeveloperFormProps {
  initialData?: IUser | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function DeveloperForm({ initialData, onSubmit, onCancel }: DeveloperFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(developerCreateSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      role: initialData?.role || 'developer',
      photo: initialData?.photo || '',
      skills: initialData?.skills || [],
      bio: initialData?.bio || '',
      socialLinks: {
        github: initialData?.socialLinks?.github || '',
        linkedin: initialData?.socialLinks?.linkedin || '',
        twitter: initialData?.socialLinks?.twitter || '',
        portfolio: initialData?.socialLinks?.portfolio || '',
      }
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-6 rounded-lg border">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium mb-1">Photo</label>
          <Controller
            control={control}
            name="photo"
            render={({ field }) => (
              <ImageUpload value={field.value || ''} onChange={field.onChange} category="profile" />
            )}
          />
        </div>
        
        <div className="w-full sm:w-2/3 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Internal Name</label>
              <input {...register('name')} className="w-full bg-card/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
              {errors.name?.message && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{String(errors.name.message)}</p>}
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Comms Channel (Email)</label>
              <input {...register('email')} className="w-full bg-card/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" disabled={isEditing} />
              {errors.email?.message && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{String(errors.email.message)}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-2">{isEditing ? 'Rotate Access (optional)' : 'Access Token'}</label>
              <input {...register('password')} type="password" className="w-full bg-card/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
              {errors.password?.message && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{String(errors.password.message)}</p>}
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Clearance Level</label>
              <select {...register('role')} className="w-full bg-card/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer">
                <option value="developer">DEVELOPER</option>
                <option value="admin">ADMIN</option>
              </select>
              {errors.role?.message && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{String(errors.role.message)}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Biography</label>
            <textarea {...register('bio')} className="w-full bg-card/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none h-24 resize-none" />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Technical Proficiencies</label>
            <Controller
              control={control}
              name="skills"
              render={({ field }) => (
                <TagInput tags={field.value || []} onChange={field.onChange} placeholder="Metadata input..." />
              )}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div><label className="block text-sm font-medium mb-1">GitHub URL</label><input {...register('socialLinks.github')} className="w-full border rounded-md px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">LinkedIn URL</label><input {...register('socialLinks.linkedin')} className="w-full border rounded-md px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Twitter URL</label><input {...register('socialLinks.twitter')} className="w-full border rounded-md px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Portfolio URL</label><input {...register('socialLinks.portfolio')} className="w-full border rounded-md px-3 py-2" /></div>
      </div>

      <div className="pt-8 flex justify-end gap-3 border-t border-border">
        <button type="button" onClick={onCancel} className="px-8 py-3 border border-border rounded-xl text-sm font-bold hover:bg-muted/50 transition-all active:scale-95 disabled:opacity-50" disabled={loading}>CANCEL</button>
        <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-black hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50" disabled={loading}>
          {loading ? 'UPLOADING...' : 'SAVE PERSONNEL'}
        </button>
      </div>
    </form>
  );
}
