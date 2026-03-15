'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import BlogsTable from '@/components/tables/BlogsTable';
import { IBlog } from '@brikien/types';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res: any = await api.get('/admin/blogs');
        setBlogs(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/admin/blogs/${id}`);
    setBlogs(blogs.filter(b => b._id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Blogs</h1>
        <p className="text-muted-foreground">Manage all blogs in the system.</p>
      </div>

      <BlogsTable data={blogs} onDelete={handleDelete} editPrefix="/dashboard/blogs" />
    </div>
  );
}
