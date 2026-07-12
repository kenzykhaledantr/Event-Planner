import { View, Text, ScrollView, Image } from 'react-native';
import { Controller } from 'react-hook-form';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { useProfileForm } from '@/features/profile/hooks/useProfileForm';
import { useToggleRole } from '@/features/profile/hooks/useToggleRole';
import { authService } from '@/features/auth/services/authService';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SegmentedToggle } from '@/components/ui/SegmentedToggle';

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const { form, onSubmit, isSubmitting } = useProfileForm();
  const { activeRole, toggleRole, isSaving } = useToggleRole();
  const rootError = form.formState.errors.root?.message;
  const watchedPhotoURL = form.watch('photoURL');

  if (!user) return null; // Root layout guard guarantees this rarely renders, but keeps TS happy.

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: theme.spacing.lg }}
    >
      <Text style={[theme.typography.displayLg, { color: theme.colors.textPrimary, marginBottom: theme.spacing.lg }]}>
        Profile
      </Text>

      <View style={{ alignItems: 'center', marginBottom: theme.spacing.lg }}>
        <Avatar uri={watchedPhotoURL || user.photoURL} name={user.displayName} size={88} />
      </View>

      <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
        Mode
      </Text>
      <SegmentedToggle
        segments={[
          { label: 'Attendee', value: 'attendee' },
          { label: 'Organizer', value: 'organizer' },
        ]}
        value={activeRole}
        onChange={toggleRole}
        disabled={isSaving}
      />

      <View style={{ height: theme.spacing.xl }} />

      <Controller
        control={form.control}
        name="displayName"
        render={({ field, fieldState }) => (
          <Input
            label="Full Name"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <View style={{ height: theme.spacing.md }} />

      <Controller
        control={form.control}
        name="photoURL"
        render={({ field, fieldState }) => (
          <Input
            label="Avatar Image URL"
            placeholder="https://example.com/photo.jpg"
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      {rootError && (
        <Text style={[theme.typography.caption, { color: theme.colors.danger, marginTop: theme.spacing.md }]}>
          {rootError}
        </Text>
      )}

      <View style={{ height: theme.spacing.lg }} />
      <Button label="Save Changes" onPress={onSubmit} loading={isSubmitting} />

      <View style={{ height: theme.spacing.xl }} />
      <Button label="Log Out" variant="ghost" onPress={() => authService.logout()} />
    </ScrollView>
  );
}