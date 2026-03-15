'use client';

import HomepageForm from '@/components/forms/HomepageForm';
import api from '@/lib/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminHomepageConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res: any = await api.get('/admin/site-config');
        setConfig(res.data);
      } catch (error) {
        toast.error('Failed to load homepage config');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      await api.put('/admin/site-config', data);
      toast.success('Homepage configuration updated');
    } catch (error: any) {
      toast.error(error.toString());
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Homepage Configuration</h1>
        <p className="text-gray-500">Manage the public website content.</p>
      </div>
      {config && <HomepageForm initialData={config} onSubmit={handleSubmit} />}
    </div>
  );
}
