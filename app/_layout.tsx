import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useAuthListener } from '@/features/auth/hooks/useAuthListener';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import  LoadingScreen  from '@/components/ui/LoadingScreen';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  );
}

function AuthGate() {
  useAuthListener();

  const user = useAuthStore((s) => s.user);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const hydrateTheme = useThemeStore((s) => s.hydrate);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    hydrateTheme();
  }, []);

  useEffect(() => {
    if (isInitializing) return;

    const inProtectedGroup = segments[0] === '(protected)';

    if (!user && inProtectedGroup) {
      router.replace('/(auth)/login');
    } else if (user && !inProtectedGroup) {
      router.replace('/(protected)/(tabs)/home');
    }
  }, [user, isInitializing, segments]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return <Slot />;
}