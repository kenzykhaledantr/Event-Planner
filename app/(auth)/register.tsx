import { View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useTheme } from '@/hooks/useTheme';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterScreen() {
  const theme = useTheme();
  const { form, onSubmit, isSubmitting } = useRegisterForm();
  const rootError = form.formState.errors.root?.message;

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: theme.spacing.lg }}
      style={{ backgroundColor: theme.colors.background }}
    >
      <Text style={[theme.typography.displayLg, { color: theme.colors.textPrimary, marginBottom: theme.spacing.xl }]}>
        Create Account
      </Text>

      <Controller
        control={form.control}
        name="displayName"
        render={({ field, fieldState }) => (
          <Input
            label="Full Name"
            placeholder="John Doe"
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
        name="email"
        render={({ field, fieldState }) => (
          <Input
            label="Email Address"
            placeholder="name@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
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
        name="password"
        render={({ field, fieldState }) => (
          <Input
            label="Password"
            placeholder="Min. 8 characters"
            secureTextEntry
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
      <Button label="Sign Up" onPress={onSubmit} loading={isSubmitting} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: theme.spacing.lg }}>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          Already have an account?{' '}
        </Text>
        <Link href="/(auth)/login" >
          <Text style={[theme.typography.bodyBold, { color: theme.colors.accent }]}>Log In</Text>
        </Link>
      </View>
    </ScrollView>
  );
}