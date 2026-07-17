import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { eventService } from '../services/eventService';
import { useAuthStore } from '@/store/authStore';

export function useRsvp(eventId: string) {
  const user = useAuthStore((s) => s.user);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    if (!user) return;
    return eventService.subscribeToAttendeeStatus(eventId, user.uid, setIsAttending);
  }, [eventId, user?.uid]);

  const joinMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('Not authenticated');
      return eventService.joinEvent(eventId, {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    },
    onError: (error) => {
      if (error instanceof Error && error.message === 'EVENT_FULL') {
        Alert.alert('Event Full', 'This event has reached its maximum capacity.');
      } else {
        Alert.alert('Something went wrong', 'Please try again.');
      }
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('Not authenticated');
      return eventService.leaveEvent(eventId, user.uid);
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