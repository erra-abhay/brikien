'use client';

import ProfileForm from '@/components/forms/ProfileForm';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();

  const handleSubmit = async (data: any) => {
    try {
      await api.put('/dashboard/profile', data);
      toast.success('Profile updated successfully! Refresh to see changes globally.');
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500">Update your public profile, skills, and links.</p>
      </div>
      <ProfileForm initialData={user} onSubmit={handleSubmit} />
    </div>
  );
}
