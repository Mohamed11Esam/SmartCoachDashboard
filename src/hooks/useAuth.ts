import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { isAuthenticated, user, token, logout, setAuth, hydrate } = useAuthStore();

  return {
    isAuthenticated,
    user,
    token,
    isAdmin: user?.role === 'Admin',
    logout,
    setAuth,
    hydrate,
  };
}
