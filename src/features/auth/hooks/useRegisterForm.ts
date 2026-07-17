import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { registerSchema, RegisterFormValues } from '../schemas';
import { authService } from '../services/authService';

export function useRegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: authService.register,
    onError: (error) => {
      form.setError('root', { message: mapAuthError(error) });
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return { form, onSubmit, isSubmitting: mutation.isPending };
}

function mapAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Please choose a stronger password.';
    default:
      return 'Something went wrong. Please try again.';
  }
}