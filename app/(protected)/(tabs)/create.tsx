import { View, Text, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/hooks/useTheme';
import { useEventForm } from '@/features/events/hooks/useEventForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SegmentedToggle } from '@/components/ui/SegmentedToggle';
import { TagInput } from '@/features/events/components/TagInput';
import { useLocationPicker } from '@/features/events/hooks/useLocationPicker';

const CATEGORIES = ['Music', 'Tech', 'Art', 'Sports', 'Food', 'Business'];

export default function CreateEventScreen() {
  const theme = useTheme();
  const { form, onSubmit, isSubmitting } = useEventForm();
    const { pickCurrentLocation, isFetching } = useLocationPicker();
  const rootError = form.formState.errors.root?.message;

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: theme.spacing.lg }}
    >
      <Text style={[theme.typography.displayLg, { color: theme.colors.textPrimary, marginBottom: theme.spacing.xs }]}>
        Create New Event
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xl }]}>
        Fill in the details below to publish your event.
      </Text>

      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Input
            label="Event Title"
            placeholder="Enter a descriptive name"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <View style={{ height: theme.spacing.md }} />

      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Input
            label="Description"
            placeholder="What's this event about?"
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: 'top' }}
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <View style={{ height: theme.spacing.md }} />

      <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
        Category
      </Text>
      <Controller
        control={form.control}
        name="category"
        render={({ field }) => (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                label={cat}
                variant={field.value === cat ? 'primary' : 'ghost'}
                onPress={() => field.onChange(cat)}
              />
            ))}
          </View>
        )}
      />

      <View style={{ height: theme.spacing.lg }} />

      <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
        Visibility
      </Text>
      <Controller
        control={form.control}
        name="visibility"
        render={({ field }) => (
          <SegmentedToggle
            segments={[
              { label: 'Public (Discovery On)', value: 'public' },
              { label: 'Private', value: 'private' },
            ]}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <View style={{ height: theme.spacing.lg }} />

      <Controller
        control={form.control}
        name="date"
        render={({ field }) => (
          <View>
            <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
              Date
            </Text>
            <DateTimePicker
              value={field.value}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => selectedDate && field.onChange(selectedDate)}
            />
          </View>
        )}
      />

      <View style={{ height: theme.spacing.md }} />

      <Controller
        control={form.control}
        name="startTime"
        render={({ field }) => (
          <View>
            <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
              Start Time
            </Text>
            <DateTimePicker
              value={field.value}
              mode="time"
              display="default"
              onChange={(_, selectedDate) => selectedDate && field.onChange(selectedDate)}
            />
          </View>
        )}
      />

      <View style={{ height: theme.spacing.md }} />

      <Controller
        control={form.control}
        name="endTime"
        render={({ field, fieldState }) => (
          <View>
            <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
              End Time
            </Text>
            <DateTimePicker
              value={field.value}
              mode="time"
              display="default"
              onChange={(_, selectedDate) => selectedDate && field.onChange(selectedDate)}
            />
            {fieldState.error && (
              <Text style={[theme.typography.caption, { color: theme.colors.danger, marginTop: theme.spacing.xs }]}>
                {fieldState.error.message}
              </Text>
            )}
          </View>
        )}
      />

      <View style={{ height: theme.spacing.md }} />

      <Controller
  control={form.control}
  name="address"
  render={({ field, fieldState }) => (
    <View>
      <Input
        label="Location"
        placeholder="Venue name or address"
        value={field.value}
        onChangeText={field.onChange}
        error={fieldState.error?.message}
      />
      <View style={{ height: theme.spacing.sm }} />
      <Button
        label="Use Current Location"
        variant="secondary"
        loading={isFetching}
        onPress={() =>
          pickCurrentLocation((result) => {
            field.onChange(result.address);
            form.setValue('latitude', result.latitude);
            form.setValue('longitude', result.longitude);
          })
        }
      />
    </View>
  )}
/>

      <View style={{ height: theme.spacing.md }} />

      <Controller
        control={form.control}
        name="coverImageURL"
        render={({ field, fieldState }) => (
          <Input
            label="Event Cover Image URL"
            placeholder="https://example.com/cover.jpg"
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <View style={{ height: theme.spacing.md }} />

      <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
        <View style={{ flex: 1 }}>
          <Controller
            control={form.control}
            name="maxAttendees"
            render={({ field, fieldState }) => (
              <Input
                label="Max Attendees"
                placeholder="Leave blank for unlimited"
                keyboardType="number-pad"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Input
                label="Price ($)"
                placeholder="Free"
                keyboardType="decimal-pad"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </View>
      </View>

      <View style={{ height: theme.spacing.md }} />

      <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
        Tags
      </Text>
      <Controller
        control={form.control}
        name="tags"
        render={({ field }) => <TagInput value={field.value} onChange={field.onChange} />}
      />

      {rootError && (
        <Text style={[theme.typography.caption, { color: theme.colors.danger, marginTop: theme.spacing.md }]}>
          {rootError}
        </Text>
      )}

      <View style={{ height: theme.spacing.xl }} />
      <Button label="Publish Event" onPress={onSubmit} loading={isSubmitting} />
    </ScrollView>
  );
}