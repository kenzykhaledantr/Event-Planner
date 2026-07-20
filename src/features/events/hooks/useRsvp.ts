import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { eventService } from '../services/eventService';
import { useAuthStore } from '@/store/authStore';
import { notificationService } from '@/features/notifications/services/notificationService';
import { Event } from '../types';
export function useRsvp(eventId: string, event: Event | null) {
  const user = useAuthStore((s) => s.user);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    if (!user) return;
    return eventService.subscribeToAttendeeStatus(eventId, user.uid, setIsAttending);
  }, [eventId, user?.uid]);

  const joinMutation = useMutation({
  mutationFn: async () => {
    if (!user) throw new Error('Not authenticated');
    await eventService.joinEvent(eventId, {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  },
  onSuccess: async () => {
    if (event?.startTime) {
      const notificationId = await notificationService.scheduleEventReminder(
        eventId,
        event.title,
        event.startTime.toDate()
      );
      if (notificationId) {
        await notificationService.saveReminderMapping(eventId, notificationId);
      }
    }
  },
  onError: (error) => {
    // ...unchanged from Phase 8
  },
});

// Update leaveMutation:
const leaveMutation = useMutation({
  mutationFn: () => {
    if (!user) throw new Error('Not authenticated');
    return eventService.leaveEvent(eventId, user.uid);
  },
  onSuccess: async () => {
    const notificationId = await notificationService.getReminderMapping(eventId);
    if (notificationId) {
      await notificationService.cancelReminder(notificationId);
      await notificationService.clearReminderMapping(eventId);
    }
  },
});
  return {
    isAttending,
    join: () => joinMutation.mutate(),
    leave: () => leaveMutation.mutate(),
    isJoining: joinMutation.isPending,
    isLeaving: leaveMutation.isPending,
  };
}