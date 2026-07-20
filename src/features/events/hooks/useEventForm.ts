import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { eventSchema, EventFormInput ,  EventFormValues} from '../shemas';
import { eventService } from '../services/eventService';
import { Event } from '../types';
import { useAuthStore } from '@/store/authStore';
import { GeoPoint } from 'firebase/firestore';

interface UseEventFormOptions {
  existingEvent?: Event;
}

export function useEventForm({ existingEvent }: UseEventFormOptions = {}) {
  const user = useAuthStore((s) => s.user);
  const isEditMode = !!existingEvent;

  const form = useForm<EventFormInput,
  any,
  EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: existingEvent
      ? {
          title: existingEvent.title,
          description: existingEvent.description,
          category: existingEvent.category,
          coverImageURL: existingEvent.coverImageURL ?? '',
          date: existingEvent.date.toDate(),
          startTime: existingEvent.startTime.toDate(),
          endTime: existingEvent.endTime.toDate(),
          address: existingEvent.location.address,
          maxAttendees: existingEvent.maxAttendees?.toString() ?? '',
          visibility: existingEvent.visibility,
          tags: existingEvent.tags,
          price: existingEvent.price?.toString() ?? '',
        }
      : {
          title: '',
          description: '',
          category: '',
          coverImageURL: '',
          date: new Date(),
          startTime: new Date(),
          endTime: new Date(),
          address: '',
          maxAttendees: '',
          visibility: 'public',
          tags: [],
          price: '',
        },
  });

  const mutation = useMutation({
    mutationFn: async (values: EventFormValues) => {
      if (!user) throw new Error('Not authenticated');

      const payload = {
        title: values.title,
        description: values.description,
        category: values.category,
        coverImageURL: values.coverImageURL || null,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        // In useEventForm's mutationFn payload:
location: {
  address: values.address,
  coordinates: values.latitude && values.longitude
    ? new GeoPoint(values.latitude, values.longitude)
    : null,
},
        maxAttendees: values.maxAttendees,
        visibility: values.visibility,
        tags: values.tags,
        price: values.price,
      };

      if (isEditMode) {
        await eventService.updateEvent(existingEvent.id, payload);
        return existingEvent.id;
      }
      
      return eventService.createEvent(payload, user.uid);
    },
    onSuccess: (eventId) => {
      router.replace(`/(protected)/event/${eventId}`);
    },
    onError: () => {
      form.setError('root', { message: 'Could not save event. Please try again.' });
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return { form, onSubmit, isSubmitting: mutation.isPending, isEditMode };
}