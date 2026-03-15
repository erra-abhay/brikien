'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProjectsTable from '@/components/tables/ProjectsTable';
import { IProject } from '@brikien/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res: any = await api.get('/admin/projects');
        setProjects(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/admin/projects/${id}`);
    setProjects(projects.filter(p => p._id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Projects</h1>
        <p className="text-gray-500">Manage all projects in the system.</p>
      </div>

      <ProjectsTable data={projects} onDelete={handleDelete} editPrefix="/dashboard/projects" />
    </div>
  );
}
