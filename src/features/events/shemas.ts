import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(80),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.string().min(1, 'Select a category'),
  coverImageURL: z.string().url('Enter a valid image URL').or(z.literal('')).optional(),
  date: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  address: z.string().min(3, 'Enter a location'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  maxAttendees: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : null))
    .refine((v) => v === null || v > 0, 'Must be a positive number'),
  visibility: z.enum(['public', 'private']),
  tags: z.array(z.string()).max(6, 'Up to 6 tags'),
  price: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : null))
    .refine((v) => v === null || v >= 0, 'Price cannot be negative'),
}).refine((data) => data.endTime > data.startTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
});


// what the form fields hold (strings)
export type EventFormInput = z.input<typeof eventSchema>;
export type EventFormValues = z.output<typeof eventSchema>; 