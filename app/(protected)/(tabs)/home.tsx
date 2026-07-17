import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@/hooks/useTheme';
import { useEventFeed } from '@/features/events/hooks/useEventFeed';
import { useEventFilters } from '@/features/events/hooks/useEventFilters';
import { EventCard } from '@/features/events/components/EventCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

const CATEGORIES = ['Music', 'Tech', 'Art', 'Sports', 'Food', 'Business'];

export default function HomeScreen() {
  const theme = useTheme();
  const { events, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useEventFeed({});
  const { searchInput, setSearchInput, category, setCategory, filteredEvents } = useEventFilters(events);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: theme.spacing.lg }}>
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <Text style={[theme.typography.displayLg, { color: theme.colors.textPrimary }]}>
          Find your next pulse.
        </Text>
        <View style={{ height: theme.spacing.md }} />
        <Input
          placeholder="Search events, artists, or venues"
          value={searchInput}
          onChangeText={setSearchInput}
        />
        <View style={{ height: theme.spacing.sm }} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Button
            label="All"
            variant={category === null ? 'primary' : 'ghost'}
            onPress={() => setCategory(null)}
          />
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              label={cat}
              variant={category === cat ? 'primary' : 'ghost'}
              onPress={() => setCategory(cat)}
            />
          ))}
        </View>
      </View>

      <FlashList
        data={filteredEvents}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: theme.spacing.lg }}>
            <EventCard event={item} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              title="No events found"
              message="Try a different search or check back soon."
            />
          ) : null
        }
        contentContainerStyle={{ paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xl }}
      />
    </View>
  );
}