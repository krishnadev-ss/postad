import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();

  const isAdmin = user?.role === 'ADMIN';
  const isProvider = user?.role === 'PROVIDER';
  const isAdvertiser = user?.role === 'ADVERTISER';

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isProvider,
    isAdvertiser,
    login,
    logout,
    updateUser,
  };
};
