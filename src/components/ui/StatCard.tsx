import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: ReactNode;
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-text-secondary text-sm">{title}</span>
        <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center text-accent">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-status-approved' : 'text-status-declined'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{isPositive ? '+' : ''}{change}%</span>
        <span className="text-text-muted ml-1">vs last period</span>
      </div>
    </div>
  );
}
