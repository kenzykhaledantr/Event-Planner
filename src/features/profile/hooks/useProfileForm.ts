import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { profileSchema, ProfileFormValues } from '../schemas';
import { profileService } from '../services/profileService';
import { useAuthStore } from '@/store/authStore';

export function useProfileForm() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName ?? '',
      photoURL: user?.photoURL ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!user) throw new Error('Not authenticated');
      await profileService.updateProfile(user.uid, {
        displayName: values.displayName,
        photoURL: values.photoURL || null,
      });
      return values;
    },
    onSuccess: (values) => {
      if (!user) return;
      setUser({
        ...user,
        displayName: values.displayName,
        photoURL: values.photoURL || null,
      });
    },
    onError: () => {
      form.setError('root', { message: 'Could not save changes. Please try again.' });
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return { form, onSubmit, isSubmitting: mutation.isPending };
}