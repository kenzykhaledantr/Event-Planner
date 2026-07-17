import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useTheme } from '@/hooks/useTheme';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';


export default function LoginScreen() {
  const theme = useTheme();
  const { form, onSubmit, isSubmitting } = useLoginForm();
  const rootError = form.formState.errors.root?.message;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, padding: theme.spacing.lg }]}>
      <Text style={[theme.typography.displayLg, { color: theme.colors.textPrimary, marginBottom: theme.spacing.xl }]}>
        Welcome back
      </Text>

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

      <Link href="/(auth)/forgot-password" style={{ alignSelf: 'flex-end', marginTop: theme.spacing.sm }}>
        <Text style={[theme.typography.caption, { color: theme.colors.accent }]}>
          Forgot Password?
        </Text>
      </Link>

      {rootError && (
        <Text style={[theme.typography.caption, { color: theme.colors.danger, marginTop: theme.spacing.md }]}>
          {rootError}
        </Text>
      )}

      <View style={{ height: theme.spacing.lg }} />

      <Button label="Login" onPress={onSubmit} loading={isSubmitting} />

      
      

      <View style={styles.footer}>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          Don&apos;t have an account?{' '}
        </Text>
        <Link href="/(auth)/register">
          <Text style={[theme.typography.bodyBold, { color: theme.colors.accent }]}>Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});