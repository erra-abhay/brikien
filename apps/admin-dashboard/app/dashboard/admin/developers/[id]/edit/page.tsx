'use client';

import DeveloperForm from '@/components/forms/DeveloperForm';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IUser } from '@brikien/types';

export default function EditDeveloperPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [developer, setDeveloper] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDev = async () => {
      try {
        const res: any = await api.get('/admin/developers');
        const found = res.data.find((d: IUser) => d._id === params.id);
        if (found) setDeveloper(found);
        else {
          toast.error('Developer not found');
          router.push('/dashboard/admin/developers');
        }
      } catch (e) {
        router.push('/dashboard/admin/developers');
      } finally {
        setLoading(false);
      }
    };
    fetchDev();
  }, [params.id, router]);

  const handleSubmit = async (data: any) => {
    try {
      await api.put(`/admin/developers/${params.id}`, data);
      toast.success('Developer updated');
      router.push('/dashboard/admin/developers');
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!developer) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Edit Developer</h1>
      </div>
      <DeveloperForm initialData={developer} onSubmit={handleSubmit} onCancel={() => router.push('/dashboard/admin/developers')} />
    </div>
  );
}
