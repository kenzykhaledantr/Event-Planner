import { useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';

export function useAuthListener() {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitializing = useAuthStore((s) => s.setInitializing);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setInitializing(false);
        return;
      }

      let profile = await authService.fetchUserProfile(firebaseUser.uid);

      // Self-healing: covers the edge case where the profile doc write
      // failed during registration (see authService.register note above).
      if (!profile) {
        profile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName ?? 'New User',
          email: firebaseUser.email ?? '',
          photoURL: firebaseUser.photoURL,
          activeRole: 'attendee',
          favoriteEventIds: [],
        };
      }

      setUser(profile);
      setInitializing(false);
    });

    return unsubscribe;
  }, [setUser, setInitializing]);
}