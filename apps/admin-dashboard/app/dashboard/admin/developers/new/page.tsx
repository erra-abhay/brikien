'use client';

import DeveloperForm from '@/components/forms/DeveloperForm';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NewDeveloperPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await api.post('/admin/developers', data);
      toast.success('Developer created');
      router.push('/dashboard/admin/developers');
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Add Developer</h1>
      </div>
      <DeveloperForm onSubmit={handleSubmit} onCancel={() => router.push('/dashboard/admin/developers')} />
    </div>
  );
}
