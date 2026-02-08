import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'pending' | 'approved' | 'declined' | 'default';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    pending: 'bg-status-pending/20 text-status-pending',
    approved: 'bg-status-approved/20 text-status-approved',
    declined: 'bg-status-declined/20 text-status-declined',
    default: 'bg-accent-muted text-accent',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
