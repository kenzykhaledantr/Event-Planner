import { View, Text, Image, ScrollView, Share, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { useEventDetails } from '@/features/events/hooks/useEventDetails';
import { useRsvp } from '@/features/events/hooks/useRsvp';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/features/events/services/eventService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import LoadingScreen  from '@/components/ui/LoadingScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { locationService } from '@/features/events/services/locationService';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const { event, isLoading } = useEventDetails(id);
const { isAttending, join, leave, isJoining, isLeaving } = useRsvp(id, event);

  const { data: attendees = [] } = useQuery({
    queryKey: ['event', id, 'attendees'],
    queryFn: () => eventService.listAttendees(id),
    enabled: !!event,
  });

  if (isLoading) return <LoadingScreen />;
  if (!event) return <EmptyState title="Event not found" message="This event may have been removed." />;

  const isOrganizer = user?.uid === event.organizerId;
  const seatsLeft = event.maxAttendees !== null ? event.maxAttendees - event.attendeeCount : null;
  const isFull = seatsLeft !== null && seatsLeft <= 0;

  const handleShare = () => {
    Share.share({
      message: `Check out "${event.title}" — ${event.location.address} on ${event.date.toDate().toLocaleDateString()}`,
    });
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      {event.coverImageURL ? (
        <Image source={{ uri: event.coverImageURL }} style={{ width: '100%', height: 220 }} />
      ) : (
        <View style={{ width: '100%', height: 220, backgroundColor: theme.colors.surfaceElevated }} />
      )}

      <View style={{ padding: theme.spacing.lg }}>
        <Badge label={event.category} tone="accent" />

        <Text style={[theme.typography.displayLg, { color: theme.colors.textPrimary, marginTop: theme.spacing.sm }]}>
          {event.title}
        </Text>

        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
          {event.date.toDate().toLocaleDateString()} · {event.startTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {event.endTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Pressable
  onPress={() => {
    if (event.location.coordinates) {
      locationService.openInMaps(
        event.location.coordinates.latitude,
        event.location.coordinates.longitude,
        event.title
      );
    }
  }}
  disabled={!event.location.coordinates}
>
  <Text
    style={[
      theme.typography.body,
      {
        color: event.location.coordinates ? theme.colors.accent : theme.colors.textSecondary,
        textDecorationLine: event.location.coordinates ? 'underline' : 'none',
      },
    ]}
  >
    {event.location.address}
  </Text>
</Pressable>

        <View style={{ height: theme.spacing.lg }} />

        <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>
          {event.description}
        </Text>

        <View style={{ height: theme.spacing.lg }} />

        {attendees.length > 0 && (
          <>
            <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
              {event.attendeeCount} attending
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {attendees.slice(0, 8).map((attendee) => (
                <View key={attendee.uid} style={{ marginRight: -12 }}>
                  <Avatar uri={attendee.photoURL} name={attendee.displayName} size={36} />
                </View>
              ))}
            </View>
            <View style={{ height: theme.spacing.lg }} />
          </>
        )}

        {seatsLeft !== null && (
          <Text style={[theme.typography.caption, { color: isFull ? theme.colors.danger : theme.colors.warning, marginBottom: theme.spacing.md }]}>
            {isFull ? 'This event is full' : `${seatsLeft} seats left`}
          </Text>
        )}

        {isOrganizer ? (
          <Button
            label="Manage Event"
            onPress={() => router.push(`/(protected)/event/${event.id}/edit`)}
          />
        ) : isAttending ? (
          <Button label="Leave Event" variant="secondary" onPress={leave} loading={isLeaving} />
        ) : (
          <Button
            label={isFull ? 'Event Full' : 'Buy Tickets / Join'}
            onPress={join}
            loading={isJoining}
            disabled={isFull}
          />
        )}

        <View style={{ height: theme.spacing.md }} />
        <Button label="Share Event" variant="ghost" onPress={handleShare} />
      </View>
    </ScrollView>
  );
}