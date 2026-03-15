'use client';

import BlogForm from '@/components/forms/BlogForm';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NewBlogPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await api.post('/dashboard/blogs', data);
      toast.success('Blog created successfully');
      router.push('/dashboard/blogs');
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Create New Blog</h1>
      </div>
      <BlogForm onSubmit={handleSubmit} onCancel={() => router.push('/dashboard/blogs')} />
    </div>
  );
}
