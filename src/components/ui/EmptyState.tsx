import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  const theme = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: theme.spacing.xxl, paddingHorizontal: theme.spacing.lg }}>
      <Text style={[theme.typography.heading, { color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }]}>
        {title}
      </Text>
      {message && (
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>
          {message}
        </Text>
      )}
    </View>
  );
}