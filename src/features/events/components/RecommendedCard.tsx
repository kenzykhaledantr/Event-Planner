import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Event } from '../types';

interface RecommendedCardProps {
  event: Event;
}

export function RecommendedCard({ event }: RecommendedCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => router.push(`/(protected)/event/${event.id}`)}
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
      }}
    >
      {event.coverImageURL ? (
        <Image
          source={{ uri: event.coverImageURL }}
          style={{ width: 64, height: 64, borderRadius: theme.radius.sm }}
        />
      ) : (
        <View style={{ width: 64, height: 64, borderRadius: theme.radius.sm, backgroundColor: theme.colors.surfaceElevated }} />
      )}

      <View style={{ marginLeft: theme.spacing.md, flex: 1, justifyContent: 'center' }}>
        <Text style={[theme.typography.label, { color: theme.colors.accent, letterSpacing: 0.5 }]}>
          {event.category.toUpperCase()}
        </Text>
        <Text style={[theme.typography.bodyBold, { color: theme.colors.textPrimary, marginTop: 2 }]} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
          {event.date.toDate().toLocaleDateString([], { month: 'short', day: 'numeric' })} · {event.location.address}
        </Text>
      </View>
    </Pressable>
  );
}