import { useInfiniteQuery } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import { EventFilters } from '../types';

export function useEventFeed(filters: EventFilters) {
  const query = useInfiniteQuery({
    queryKey: ['events', 'feed', filters],
    queryFn: ({ pageParam }) => eventService.listPublicEvents(filters, pageParam),
    initialPageParam: undefined as any,
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
  });

  const events = query.data?.pages.flatMap((page) => page.events) ?? [];

  return {
    events,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}