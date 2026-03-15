'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import DevelopersTable from '@/components/tables/DevelopersTable';
import { IUser } from '@brikien/types';
import Link from 'next/link';

export default function AdminDevelopersPage() {
  const [developers, setDevelopers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevs = async () => {
      try {
        const res: any = await api.get('/admin/developers');
        setDevelopers(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchDevs();
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/admin/developers/${id}`);
    setDevelopers(developers.map(d => d._id === id ? { ...d, isActive: false } : d));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Developers</h1>
          <p className="text-muted-foreground">Add, edit, or deactivate accounts.</p>
        </div>
        <Link 
          href="/dashboard/admin/developers/new" 
          className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-black hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          ADD_PERSONNEL
        </Link>
      </div>

      <DevelopersTable data={developers.filter(d => d.isActive)} onDelete={handleDelete} editPrefix="/dashboard/admin/developers" />
    </div>
  );
}
