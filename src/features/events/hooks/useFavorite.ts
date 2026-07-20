import { useMutation } from '@tanstack/react-query';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase.config';
import { useAuthStore } from '@/store/authStore';

export function useFavorite(eventId: string) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isFavorited = user?.favoriteEventIds.includes(eventId) ?? false;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        favoriteEventIds: isFavorited ? arrayRemove(eventId) : arrayUnion(eventId),
      });
    },
    onMutate: () => {
      if (!user) return;
      const updated = isFavorited
        ? user.favoriteEventIds.filter((id) => id !== eventId)
        : [...user.favoriteEventIds, eventId];
      setUser({ ...user, favoriteEventIds: updated });
    },
  });

  return { isFavorited, toggleFavorite: () => mutation.mutate() };
}