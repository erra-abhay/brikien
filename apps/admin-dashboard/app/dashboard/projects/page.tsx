'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProjectsTable from '@/components/tables/ProjectsTable';
import { IProject } from '@brikien/types';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res: any = await api.get('/dashboard/projects');
      setProjects(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/dashboard/projects/${id}`);
    setProjects(projects.filter(p => p._id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-gray-500">Manage your projects here.</p>
        </div>
        <Link 
          href="/dashboard/projects/new" 
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Create Project
        </Link>
      </div>

      <ProjectsTable data={projects} onDelete={handleDelete} editPrefix="/dashboard/projects" />
    </div>
  );
}
