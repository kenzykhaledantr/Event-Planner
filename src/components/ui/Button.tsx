import { Pressable, Text, StyleSheet, ActivityIndicator, PressableProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
  ...pressableProps
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === 'primary'
      ? theme.colors.accent
      : variant === 'secondary'
      ? theme.colors.surfaceElevated
      : 'transparent';

  const textColor =
    variant === 'primary' ? theme.colors.onAccent : theme.colors.textPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderRadius: theme.radius.md,
          paddingVertical: theme.spacing.sm + 4,
          paddingHorizontal: theme.spacing.lg,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: theme.colors.border,
        },
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[theme.typography.bodyBold, { color: textColor }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});