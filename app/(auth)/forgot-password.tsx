import { View, Text } from 'react-native';
import { Controller } from 'react-hook-form';
import { useTheme } from '@/hooks/useTheme';
import { useForgotPasswordForm } from '@/features/auth/hooks/useForgotPasswordForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const { form, onSubmit, isSubmitting, isSuccess } = useForgotPasswordForm();

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <Text style={[theme.typography.heading, { color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }]}>
        Reset your password
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }]}>
        Enter your email and we&apos;ll send you a link to reset your password.
      </Text>

      {isSuccess ? (
        <Text style={[theme.typography.body, { color: theme.colors.success }]}>
          Check your inbox — a reset link is on its way.
        </Text>
      ) : (
        <>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Input
                label="Email Address"
                autoCapitalize="none"
                keyboardType="email-address"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <View style={{ height: theme.spacing.lg }} />
          <Button label="Send Reset Link" onPress={onSubmit} loading={isSubmitting} />
        </>
      )}
    </View>
  );
}