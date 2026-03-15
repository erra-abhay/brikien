'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema } from '@brikien/validators';
import { IUser } from '@brikien/types';
import ImageUpload from '../editor/ImageUpload';
import TagInput from '../shared/TagInput';
import { useState } from 'react';

interface ProfileFormProps {
  initialData: IUser | null;
  onSubmit: (data: any) => Promise<void>;
}

export default function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
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

  if (!initialData) return null;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium mb-1">Profile Photo</label>
          <Controller
            control={control}
            name="photo"
            render={({ field }) => (
              <ImageUpload value={field.value || ''} onChange={field.onChange} category="profile" />
            )}
          />
        </div>
        
        <div className="w-full sm:w-2/3 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              {...register('name')} 
              className="w-full border rounded-md px-3 py-2"
            />
            {errors.name?.message && <p className="text-red-500 text-xs mt-1">{String(errors.name.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              {...register('email')} 
              className="w-full border rounded-md px-3 py-2 bg-gray-50"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password (optional)</label>
            <input 
              {...register('password')} 
              type="password"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Leave blank to keep same"
            />
            {errors.password?.message && <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea 
          {...register('bio')} 
          className="w-full border rounded-md px-3 py-2 h-24 resize-none"
        />
        {errors.bio?.message && <p className="text-red-500 text-xs mt-1">{String(errors.bio.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Skills</label>
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <TagInput tags={field.value || []} onChange={field.onChange} placeholder="React, Python..." />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <label className="block text-sm font-medium mb-1">GitHub URL</label>
          <input {...register('socialLinks.github')} className="w-full border rounded-md px-3 py-2" />
          {errors.socialLinks?.github?.message && <p className="text-red-500 text-xs mt-1">{String(errors.socialLinks.github.message)}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
          <input {...register('socialLinks.linkedin')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Twitter URL</label>
          <input {...register('socialLinks.twitter')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Portfolio URL</label>
          <input {...register('socialLinks.portfolio')} className="w-full border rounded-md px-3 py-2" />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
