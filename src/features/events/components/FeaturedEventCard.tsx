import { View, Text, ImageBackground, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/ui/Badge';
import { Event } from '../types';

interface FeaturedEventCardProps {
  event: Event;
  width: number;
}

export function FeaturedEventCard({ event, width }: FeaturedEventCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => router.push(`/(protected)/event/${event.id}`)}
      style={{ width, height: 200, borderRadius: theme.radius.lg, overflow: 'hidden' }}
    >
      <ImageBackground
        source={{ uri: event.coverImageURL ?? undefined }}
        style={{ flex: 1, justifyContent: 'space-between' }}
      >
        <View style={{ padding: theme.spacing.md }}>
          <Badge label={event.category} tone="accent" />
        </View>

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={{ padding: theme.spacing.md }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
            <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', marginLeft: 6, fontSize: 12 }}>
              {event.date.toDate().toLocaleDateString([], { month: 'short', day: 'numeric' })} ·{' '}
              {event.startTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>

          <Text style={[theme.typography.heading, { color: '#FFFFFF' }]} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 }} numberOfLines={2}>
            {event.description}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}