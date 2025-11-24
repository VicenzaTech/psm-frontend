import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for the auth state to be loaded from localStorage
    if (!isLoading) {
      setIsInitialized(true);
      if (!isAuthenticated && router.pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading || !isInitialized) {
    return <div>Loading...</div>; // Or a nice loading spinner
  }

  // If not authenticated, don't render children (will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}