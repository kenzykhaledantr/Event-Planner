import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...textInputProps }: InputProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            theme.typography.label,
            { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs },
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          theme.typography.body,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.textPrimary,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            paddingVertical: theme.spacing.sm + 2,
            paddingHorizontal: theme.spacing.md,
          },
          style,
        ]}
        {...textInputProps}
      />
      {error && (
        <Text
          style={[
            theme.typography.caption,
            { color: theme.colors.danger, marginTop: theme.spacing.xs },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});