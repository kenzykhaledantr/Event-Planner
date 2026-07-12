import { useColorScheme } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { buildTheme } from '../theme';

export function useTheme() {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((state) => state.preference);

  const resolvedMode =
    preference === 'system' ? (systemScheme ?? 'dark') : preference;

  return buildTheme(resolvedMode);
}