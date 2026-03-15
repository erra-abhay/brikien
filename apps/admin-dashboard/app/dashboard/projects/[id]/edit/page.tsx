'use client';

import ProjectForm from '@/components/forms/ProjectForm';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IProject } from '@brikien/types';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<IProject | null>(null);
  const [developers, setDevelopers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, devRes, blogRes]: any = await Promise.all([
          api.get('/dashboard/projects'),
          api.get('/developers'),
          api.get('/dashboard/blogs')
        ]);
        
        const found = projRes.data.find((p: IProject) => p._id === params.id);
        if (found) {
          setProject(found);
          setDevelopers(devRes.data);
          setBlogs(blogRes.data);
        } else {
          toast.error('Project not found or unauthorized');
          router.push('/dashboard/projects');
        }
      } catch (e) {
        router.push('/dashboard/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, router]);

  const handleSubmit = async (data: any) => {
    try {
      await api.put(`/dashboard/projects/${params.id}`, data);
      toast.success('Project updated successfully');
      router.push('/dashboard/projects');
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Edit Project</h1>
      </div>
      <ProjectForm initialData={project} developers={developers} blogs={blogs} onSubmit={handleSubmit} onCancel={() => router.push('/dashboard/projects')} />
    </div>
  );
}
