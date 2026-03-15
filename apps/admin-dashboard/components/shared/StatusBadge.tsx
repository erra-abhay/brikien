import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'published' | 'draft' | 'completed' | 'in-progress' | 'upcoming';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    published: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    upcoming: 'bg-yellow-100 text-yellow-800'
  };

  const labels = {
    published: 'Published',
    completed: 'Completed',
    draft: 'Draft',
    'in-progress': 'In Progress',
    upcoming: 'Upcoming'
  };

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide", styles[status])}>
      {labels[status]}
    </span>
  );
}
