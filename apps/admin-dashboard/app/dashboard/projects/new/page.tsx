'use client';

import ProjectForm from '@/components/forms/ProjectForm';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function NewProjectPage() {
  const router = useRouter();
  const [developers, setDevelopers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/developers'), // Public developer list
      api.get('/dashboard/blogs')
    ]).then(([devRes, blogRes]: any) => {
      setDevelopers(devRes.data);
      setBlogs(blogRes.data);
      setLoading(false);
    }).catch(e => {
      toast.error('Failed to load form data');
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      await api.post('/dashboard/projects', data);
      toast.success('Project created successfully');
      router.push('/dashboard/projects');
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Create New Project</h1>
      </div>
      <ProjectForm developers={developers} blogs={blogs} onSubmit={handleSubmit} onCancel={() => router.push('/dashboard/projects')} />
    </div>
  );
}
