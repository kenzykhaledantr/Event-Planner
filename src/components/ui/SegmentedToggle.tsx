import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface Segment<T extends string> {
  label: string;
  value: T;
}

interface SegmentedToggleProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function SegmentedToggle<T extends string>({
  segments,
  value,
  onChange,
  disabled = false,
}: SegmentedToggleProps<T>) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: theme.colors.surface, borderRadius: theme.radius.full, padding: 4 },
      ]}
    >
      {segments.map((segment) => {
        const isActive = segment.value === value;
        return (
          <Pressable
            key={segment.value}
            disabled={disabled}
            onPress={() => onChange(segment.value)}
            style={[
              styles.segment,
              {
                borderRadius: theme.radius.full,
                backgroundColor: isActive ? theme.colors.accent : 'transparent',
                paddingVertical: theme.spacing.sm,
              },
            ]}
          >
            <Text
              style={[
                theme.typography.bodyBold,
                { color: isActive ? theme.colors.onAccent : theme.colors.textSecondary },
              ]}
            >
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row' },
  segment: { flex: 1, alignItems: 'center' },
});