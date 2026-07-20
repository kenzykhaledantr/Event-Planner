import { View, Text, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { useEventFeed } from '@/features/events/hooks/useEventFeed';
import { useEventFilters } from '@/features/events/hooks/useEventFilters';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FeaturedEventCard } from '@/features/events/components/FeaturedEventCard';
import { RecommendedCard } from '@/features/events/components/RecommendedCard';

const CATEGORIES = ['Music', 'Tech', 'Art', 'Sports', 'Food', 'Business'];
const FEATURED_CARD_WIDTH = Dimensions.get('window').width * 0.82;

export default function HomeScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const { events, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useEventFeed({});
  const { searchInput, setSearchInput, category, setCategory, filteredEvents } = useEventFilters(events);

  const featuredEvents = filteredEvents.slice(0, 5);
  const recommendedEvents = filteredEvents.slice(5);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlashList
        data={recommendedEvents}
        keyExtractor={(item) => item.id}
       
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: theme.spacing.lg }}>
            <RecommendedCard event={item} />
          </View>
        )}
        ListEmptyComponent={
          !isLoading && filteredEvents.length === 0 ? (
            <EmptyState title="No events found" message="Try a different search or category." />
          ) : null
        }
        ListHeaderComponent={
          <View>
            <Header
              title="EventPulse"
              onMenuPress={() => router.push('/(protected)/(tabs)/profile')}
              avatarUri={user?.photoURL}
              avatarName={user?.displayName ?? '?'}
              onAvatarPress={() => router.push('/(protected)/(tabs)/profile')}
            />

            <View style={{ paddingHorizontal: theme.spacing.lg }}>
              <Text style={[theme.typography.displayLg, { color: theme.colors.textPrimary, marginTop: theme.spacing.sm }]}>
                Find your next pulse.
              </Text>

              <View style={{ height: theme.spacing.md }} />
              <Input
                placeholder="Search events, artists, or venues"
                value={searchInput}
                onChangeText={setSearchInput}
              />
            </View>

            <View style={{ height: theme.spacing.lg }} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.sm }}
            >
              <Button label="All" variant={category === null ? 'primary' : 'ghost'} onPress={() => setCategory(null)} />
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  label={cat}
                  variant={category === cat ? 'primary' : 'ghost'}
                  onPress={() => setCategory(cat)}
                />
              ))}
            </ScrollView>

            {featuredEvents.length > 0 && (
              <>
                <View style={{ height: theme.spacing.lg }} />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: theme.spacing.lg,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>Featured Pulse</Text>
                  <Text style={[theme.typography.bodyBold, { color: theme.colors.accent }]}>See More</Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.md }}
                >
                  {featuredEvents.map((event) => (
                    <FeaturedEventCard key={event.id} event={event} width={FEATURED_CARD_WIDTH} />
                  ))}
                </ScrollView>
              </>
            )}

            <View style={{ height: theme.spacing.lg }} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: theme.spacing.lg,
                marginBottom: theme.spacing.sm,
              }}
            >
              <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>Recommended for You</Text>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: theme.colors.surfaceElevated,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="options-outline" size={18} color={theme.colors.textPrimary} />
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
}