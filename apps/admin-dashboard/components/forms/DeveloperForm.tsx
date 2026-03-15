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
        
        <div className="w-full sm:w-2/3 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input {...register('name')} className="w-full border rounded-md px-3 py-2" />
              {errors.name?.message && <p className="text-red-500 text-xs mt-1">{String(errors.name.message)}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input {...register('email')} className="w-full border rounded-md px-3 py-2" disabled={isEditing} />
              {errors.email?.message && <p className="text-red-500 text-xs mt-1">{String(errors.email.message)}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{isEditing ? 'New Password (optional)' : 'Password'}</label>
              <input {...register('password')} type="password" className="w-full border rounded-md px-3 py-2" />
              {errors.password?.message && <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select {...register('role')} className="w-full border rounded-md px-3 py-2 bg-white">
                <option value="developer">Developer</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role?.message && <p className="text-red-500 text-xs mt-1">{String(errors.role.message)}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea {...register('bio')} className="w-full border rounded-md px-3 py-2 h-20 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            <Controller
              control={control}
              name="skills"
              render={({ field }) => (
                <TagInput tags={field.value || []} onChange={field.onChange} placeholder="React, Node..." />
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

      <div className="pt-4 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-6 py-2 border rounded-md hover:bg-gray-50 transition" disabled={loading}>Cancel</button>
        <button type="submit" className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition" disabled={loading}>
          {loading ? 'Saving...' : 'Save Developer'}
        </button>
      </div>
    </form>
  );
}
