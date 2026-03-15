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
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-black tracking-tight mb-2 italic">COMMAND_CENTER</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-1">Universal System Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
        <StatsCard 
          title="Deployed Blogs" 
          value={stats.blogsCount} 
          icon={<FileText size={24} />} 
        />
        <StatsCard 
          title="Active Projects" 
          value={stats.projectsCount} 
          icon={<FolderGit2 size={24} />} 
        />
      </div>

      <div className="mt-12 bg-card p-10 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/2 blur-[100px] group-hover:bg-primary/5 transition-all duration-700"></div>
        <div className="relative z-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-muted-foreground italic underline decoration-primary/30 underline-offset-8">Activity_Stream</h2>
          <ActivityFeed items={[
            {
              id: '1',
              title: 'Welcome to Brikien Labs',
              description: 'Your account was successfully created.',
              time: 'Just now',
              icon: <FileText size={16} className="text-primary-foreground" />,
              iconBg: 'bg-primary'
            }
          ]} />
        </div>
      </div>
    </div>
  );
}
