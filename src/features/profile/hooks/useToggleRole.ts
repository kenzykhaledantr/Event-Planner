import { useMutation } from '@tanstack/react-query';
import { profileService } from '../services/profileService';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/features/auth/types';

export function useToggleRole() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const mutation = useMutation({
    mutationFn: (role: UserRole) => {
      if (!user) throw new Error('Not authenticated');
      return profileService.setActiveRole(user.uid, role);
    },
    onMutate: async (role) => {
      // Optimistic update: flip the UI instantly, before Firestore confirms.
      const previousUser = user;
      if (user) setUser({ ...user, activeRole: role });
      return { previousUser };
    },
    onError: (_err, _role, context) => {
      // Roll back if the write failed.
      if (context?.previousUser) setUser(context.previousUser);
    },
  });

  return {
    activeRole: user?.activeRole ?? 'attendee',
    toggleRole: (role: UserRole) => mutation.mutate(role),
    isSaving: mutation.isPending,
  };
}