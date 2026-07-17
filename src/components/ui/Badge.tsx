import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface BadgeProps {
  label: string;
  tone?: 'accent' | 'success' | 'neutral';
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const theme = useTheme();

  const backgroundColor =
    tone === 'accent' ? theme.colors.accent
    : tone === 'success' ? theme.colors.success
    : theme.colors.surfaceElevated;

  return (
    <View
      style={{
        backgroundColor,
        borderRadius: theme.radius.full,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={[theme.typography.caption, { color: tone === 'neutral' ? theme.colors.textPrimary : theme.colors.onAccent }]}>
        {label}
      </Text>
    </View>
  );
}