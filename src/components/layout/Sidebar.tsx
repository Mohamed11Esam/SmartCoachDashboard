import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  ShoppingBag,
  UtensilsCrossed,
  Dumbbell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../stores/uiStore';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Coach Verification', path: '/coaches', icon: UserCheck, badge: true },
  { label: 'Store Management', path: '/store', icon: ShoppingBag },
  { label: 'Meals CMS', path: '/meals', icon: UtensilsCrossed },
  { label: 'Workouts CMS', path: '/workouts', icon: Dumbbell },
];

export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar, pendingCoachCount } = useUIStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-main border-r border-border flex flex-col transition-all duration-300 z-30 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-black font-bold text-sm">FG</span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-bold text-text-primary">FitGlow</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-muted text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-card'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && pendingCoachCount > 0 && (
                  <span className="bg-status-pending text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingCoachCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="mx-3 mb-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-card transition-colors"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <>
            <ChevronLeft className="w-5 h-5" />
            <span>Collapse</span>
          </>
        )}
      </button>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-status-declined hover:bg-status-declined/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
