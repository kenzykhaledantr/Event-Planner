import { useState, useMemo } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Event } from '../types';

export function useEventFilters(events: Event[]) {
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = !category || event.category === category;
      const matchesSearch =
        !debouncedSearch ||
        event.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        event.tags.some((tag) => tag.includes(debouncedSearch.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [events, category, debouncedSearch]);

  return { searchInput, setSearchInput, category, setCategory, filteredEvents };
}