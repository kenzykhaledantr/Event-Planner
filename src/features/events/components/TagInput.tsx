import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagInput({ value, onChange, maxTags = 6 }: TagInputProps) {
  const theme = useTheme();
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const trimmed = draft.trim().toLowerCase();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setDraft('');
      return;
    }
    if (value.length >= maxTags) return;
    onChange([...value, trimmed]);
    setDraft('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <View>
      <View style={styles.row}>
        {value.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => removeTag(tag)}
            style={[
              styles.chip,
              {
                backgroundColor: theme.colors.surfaceElevated,
                borderRadius: theme.radius.full,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.xs,
                marginRight: theme.spacing.xs,
                marginBottom: theme.spacing.xs,
              },
            ]}
          >
            <Text style={[theme.typography.caption, { color: theme.colors.textPrimary }]}>
              {tag} ✕
            </Text>
          </Pressable>
        ))}
      </View>

      {value.length < maxTags && (
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={addTag}
          placeholder="Type a tag and press enter"
          placeholderTextColor={theme.colors.textSecondary}
          returnKeyType="done"
          style={[
            theme.typography.body,
            {
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center' },
});