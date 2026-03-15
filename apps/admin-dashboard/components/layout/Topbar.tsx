'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-end px-8">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold tracking-tight">{user?.name}</p>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">{user?.role} Access</p>
          </div>
          {user?.photo ? (
            <div className="w-10 h-10 relative rounded-2xl overflow-hidden border border-border shadow-sm">
              <Image src={getImageUrl(user.photo)} alt={user.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center border border-border">
              <User size={20} className="text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="w-px h-6 bg-border" />
        <button 
          onClick={() => logout()}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-red-500 transition-all"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </header>
  );
}
