'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import StatsCard from '@/components/dashboard/StatsCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { FileText, FolderGit2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState({ blogsCount: 0, projectsCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res: any = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-gray-500">Here is an overview of your work.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="My Blogs" 
          value={stats.blogsCount} 
          icon={<FileText size={24} />} 
        />
        <StatsCard 
          title="My Projects" 
          value={stats.projectsCount} 
          icon={<FolderGit2 size={24} />} 
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-bold mb-6">Recent Activity Placeholder</h2>
        <ActivityFeed items={[
          {
            id: '1',
            title: 'Welcome to Brikien Labs',
            description: 'Your account was successfully created.',
            time: 'Just now',
            icon: <FileText size={16} className="text-white" />,
            iconBg: 'bg-green-500'
          }
        ]} />
      </div>
    </div>
  );
}
