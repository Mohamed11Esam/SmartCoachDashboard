export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const PRODUCT_CATEGORIES = ['supplements', 'equipment', 'apparel', 'accessories'] as const;

export const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const COACH_VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DECLINED: 'declined',
} as const;

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Coach Verification', path: '/coaches', icon: 'UserCheck', badge: true },
  { label: 'Store Management', path: '/store', icon: 'ShoppingBag' },
  { label: 'Meals CMS', path: '/meals', icon: 'UtensilsCrossed' },
  { label: 'Workouts CMS', path: '/workouts', icon: 'Dumbbell' },
] as const;
