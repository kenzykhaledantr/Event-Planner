import { View, Image, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface AvatarProps {
  uri?: string | null;
  name: string;
  size?: number;
}

export function Avatar({ uri, name, size = 56 }: AvatarProps) {
  const theme = useTheme();
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={dimensionStyle} />;
  }

  return (
    <View
      style={[
        styles.fallback,
        dimensionStyle,
        { backgroundColor: theme.colors.accent },
      ]}
    >
      <Text style={{ color: theme.colors.onAccent, fontSize: size * 0.4, fontWeight: '700' }}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center' },
});