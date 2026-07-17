import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/ui/Badge';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const theme = useTheme();
  const seatsLeft = event.maxAttendees ? event.maxAttendees - event.attendeeCount : null;

  return (
    <Pressable
      onPress={() => router.push(`/(protected)/event/${event.id}`)}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.md,
      }}
    >
      {event.coverImageURL ? (
        <Image source={{ uri: event.coverImageURL }} style={{ width: '100%', height: 140 }} />
      ) : (
        <View style={{ width: '100%', height: 140, backgroundColor: theme.colors.surfaceElevated }} />
      )}

      <View style={{ padding: theme.spacing.md }}>
        <Badge label={event.category} tone="accent" />
        <Text
          style={[theme.typography.heading, { color: theme.colors.textPrimary, marginTop: theme.spacing.sm }]}
          numberOfLines={1}
        >
          {event.title}
        </Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
          {event.date.toDate().toLocaleDateString()} · {event.location.address}
        </Text>

        {seatsLeft !== null && (
          <Text style={[theme.typography.caption, { color: seatsLeft <= 5 ? theme.colors.warning : theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
            {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Sold out'}
          </Text>
        )}
      </View>
    </Pressable>
  );
}