import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/store/themeStore';
import { SegmentedToggle } from '@/components/ui/SegmentedToggle';

export default function SettingsScreen() {
  const theme = useTheme();
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg }}>
      <Text style={[theme.typography.displayLg, { color: theme.colors.textPrimary, marginBottom: theme.spacing.xl }]}>
        Settings
      </Text>

      <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
        Appearance
      </Text>
      <SegmentedToggle
        segments={[
          { label: 'System', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
        value={preference}
        onChange={setPreference}
      />
    </View>
  );
}