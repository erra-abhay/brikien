'use client';

import BlogForm from '@/components/forms/BlogForm';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IBlog } from '@brikien/types';

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res: any = await api.get('/dashboard/blogs');
        const found = res.data.find((b: IBlog) => b._id === params.id);
        if (found) setBlog(found);
        else {
          toast.error('Blog not found or unauthorized');
          router.push('/dashboard/blogs');
        }
      } catch (e) {
        router.push('/dashboard/blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params.id, router]);

  const handleSubmit = async (data: any) => {
    try {
      await api.put(`/dashboard/blogs/${params.id}`, data);
      toast.success('Blog updated successfully');
      router.push('/dashboard/blogs');
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!blog) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Edit Blog</h1>
      </div>
      <BlogForm initialData={blog} onSubmit={handleSubmit} onCancel={() => router.push('/dashboard/blogs')} />
    </div>
  );
}
