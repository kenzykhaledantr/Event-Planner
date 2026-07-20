import { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import { Event } from '../types';

export function useEventDetails(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = eventService.subscribeToEvent(eventId, (data) => {
      setEvent(data);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [eventId]);

  return { event, isLoading };
}