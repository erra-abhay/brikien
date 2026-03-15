import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'published' | 'draft' | 'completed' | 'in-progress' | 'upcoming';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    published: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    draft: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    upcoming: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  };

  const labels = {
    published: 'PUBLISHED',
    completed: 'COMPLETED',
    draft: 'DRAFT',
    'in-progress': 'IN_PROGRESS',
    upcoming: 'UPCOMING'
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest border transition-all duration-300", styles[status])}>
      <span className={cn("w-1 h-1 rounded-full mr-1.5 animate-pulse", status === 'published' || status === 'completed' ? 'bg-emerald-500' : 'bg-current')} />
      {labels[status]}
    </span>
  );
}
