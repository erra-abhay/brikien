'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import BlogsTable from '@/components/tables/BlogsTable';
import { IBlog } from '@brikien/types';
import Link from 'next/link';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res: any = await api.get('/dashboard/blogs');
      setBlogs(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/dashboard/blogs/${id}`);
    setBlogs(blogs.filter(b => b._id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Blogs</h1>
          <p className="text-gray-500">Manage your blog posts here.</p>
        </div>
        <Link 
          href="/dashboard/blogs/new" 
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Create Blog
        </Link>
      </div>

      <BlogsTable data={blogs} onDelete={handleDelete} editPrefix="/dashboard/blogs" />
    </div>
  );
}
