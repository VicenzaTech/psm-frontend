// _app.tsx
import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../components/AuthProvider';
import { useAuthStore } from '../stores/useAuthStore';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false);
  const initializeAuth = useAuthStore(state => state.initializeAuth);

  useEffect(() => {
    // Initialize auth when component mounts
    initializeAuth();
    setIsMounted(true);
  }, [initializeAuth]);

  if (!isMounted) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;