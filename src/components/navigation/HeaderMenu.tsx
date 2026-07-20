import { useState } from 'react';
import { View, Text, Pressable, Modal, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/features/auth/services/authService';
import { Avatar } from '@/components/ui/Avatar';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.78;

export function HeaderMenu() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const translateX = useSharedValue(-DRAWER_WIDTH);

  const open = () => {
    setIsOpen(true);
    translateX.value = withTiming(0, { duration: 250 });
  };

  const close = (after?: () => void) => {
    translateX.value = withTiming(-DRAWER_WIDTH, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(setIsOpen)(false);
        if (after) runOnJS(after)();
      }
    });
  };

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <>
      <Pressable onPress={open} hitSlop={12}>
        <Ionicons name="menu" size={26} color={theme.colors.textPrimary} />
      </Pressable>

      <Modal visible={isOpen} transparent animationType="none" onRequestClose={() => close()}>
        <View style={{ flex: 1, flexDirection: 'row',borderTopRightRadius: 40 }}>
          <Animated.View
            style={[
              { width: DRAWER_WIDTH,
      height: '100%',
      backgroundColor: theme.colors.surface,
      borderTopRightRadius: 40,
      borderBottomRightRadius: 40,
      overflow: 'hidden', },
              drawerStyle,
            ]}
          >
            <View
              style={{
                backgroundColor: theme.colors.accent,
                paddingTop: insets.top + theme.spacing.lg,
                paddingBottom: theme.spacing.lg,
                alignItems: 'center',
                
                
                
              }}
            >
              <Avatar uri={user?.photoURL} name={user?.displayName ?? '?'} size={72} />
              <Text style={[theme.typography.bodyBold, { color: '#FFFFFF', marginTop: theme.spacing.sm }]}>
                {user?.displayName}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 }}>
                {user?.email}
              </Text>
            </View>

            <View style={{ flex: 1, paddingTop: theme.spacing.md }}>
              <Pressable
                onPress={() => close(() => router.push('/(protected)/(tabs)/profile'))}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg }}
              >
                <Ionicons name="person-outline" size={20} color={theme.colors.accent} />
                <Text style={[theme.typography.body, { marginLeft: theme.spacing.md, color: theme.colors.textPrimary }]}>
                  Profile
                </Text>
              </Pressable>

              <Pressable
                onPress={() => close(() => router.push('/(protected)/settings'))}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg }}
              >
                <Ionicons name="settings-outline" size={20} color={theme.colors.accent} />
                <Text style={[theme.typography.body, { marginLeft: theme.spacing.md, color: theme.colors.textPrimary }]}>
                  Settings
                </Text>
              </Pressable>

              <View style={{ flex: 1 }} />

              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.border,
                  paddingTop: theme.spacing.sm,
                  paddingBottom: insets.bottom + theme.spacing.md,
                }}
              >
                <Pressable
                  onPress={() => close(() => authService.logout())}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg }}
                >
                  <Ionicons name="log-out-outline" size={20} color={theme.colors.textPrimary} />
                  <Text style={[theme.typography.body, { marginLeft: theme.spacing.md, color: theme.colors.textPrimary }]}>
                    Logout
                  </Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={() => close()} />
        </View>
      </Modal>
    </>
  );
}