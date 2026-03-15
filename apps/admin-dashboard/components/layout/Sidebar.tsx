'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, FolderGit2, UserCog, Settings, Users, MessageSquare } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const developerLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Blogs', href: '/dashboard/blogs', icon: FileText },
    { name: 'My Projects', href: '/dashboard/projects', icon: FolderGit2 },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCog },
  ];

  const adminLinks = [
    { name: 'All Developers', href: '/dashboard/admin/developers', icon: Users },
    { name: 'All Projects', href: '/dashboard/admin/projects', icon: FolderGit2 },
    { name: 'All Blogs', href: '/dashboard/admin/blogs', icon: FileText },
    { name: 'Messages', href: '/dashboard/admin/messages', icon: MessageSquare },
    { name: 'Homepage Config', href: '/dashboard/admin/homepage', icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-8">
        <h2 className="text-2xl font-black tracking-tighter">Brikien Labs</h2>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">Central Command</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-6 mb-4">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Developer Unit</p>
        </div>
        <nav className="space-y-1.5 px-3">
          {developerLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300",
                  isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={18} />
                <span className="text-sm font-bold tracking-tight">{link.name}</span>
              </Link>
            )
          })}
        </nav>

        {user?.role === 'admin' && (
          <>
            <div className="px-6 mt-10 mb-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Admin Protocol</p>
            </div>
            <nav className="space-y-1.5 px-3">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300",
                      isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-bold tracking-tight">{link.name}</span>
                  </Link>
                )
              })}
            </nav>
          </>
        )}
      </div>
    </div>
  );
}
