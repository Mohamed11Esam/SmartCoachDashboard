import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <span className="text-black font-bold text-lg">FG</span>
          </div>
          <span className="text-2xl font-bold text-text-primary">FitGlow</span>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
