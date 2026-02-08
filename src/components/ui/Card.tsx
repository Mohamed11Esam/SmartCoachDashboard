import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-card rounded-xl border border-border p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
