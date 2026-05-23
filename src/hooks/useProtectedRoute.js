import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Custom hook to manage authentication verification and hydration check.
 */
export const useProtectedRoute = () => {
  const { isAuthenticated, loading, hydrate } = useAuthStore();

  useEffect(() => {
    // Attempt to load token and hydrate store state on hook mount
    hydrate();
  }, [hydrate]);

  return { isAuthenticated, loading };
};
