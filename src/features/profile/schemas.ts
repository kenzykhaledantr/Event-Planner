import { z } from 'zod';

export const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  photoURL: z
    .string()
    .url('Enter a valid image URL')
    .or(z.literal(''))
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;