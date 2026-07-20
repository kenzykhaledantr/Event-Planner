import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Avatar } from './Avatar';
import { HeaderMenu } from '@/components/navigation/HeaderMenu';

interface HeaderProps {
  title: string;
  avatarUri?: string | null;
  avatarName?: string;
  onAvatarPress?: () => void;
}

export function Header({ title,  avatarUri, avatarName, onAvatarPress }: HeaderProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
              marginBottom: theme.spacing.sm,
        marginTop: 20
      }}
    >
      <HeaderMenu />

      <Text style={[theme.typography.heading, { color: theme.colors.accent }]}>{title}</Text>

      <Pressable onPress={onAvatarPress} hitSlop={8}>
        <Avatar uri={avatarUri} name={avatarName ?? '?'} size={36} />
      </Pressable>
    </View>
  );
}