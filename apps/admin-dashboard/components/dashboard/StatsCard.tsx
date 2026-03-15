import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-card rounded-[1.5rem] border border-border p-8 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{title}</p>
        <h3 className="text-3xl font-black">{value}</h3>
      </div>
      <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-primary border border-border">
        {icon}
      </div>
    </div>
  );
}
