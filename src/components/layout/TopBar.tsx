import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function TopBar() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-main border-b border-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-status-declined rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-sm font-medium text-accent">
              {user?.firstName?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text-primary">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-text-muted">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
