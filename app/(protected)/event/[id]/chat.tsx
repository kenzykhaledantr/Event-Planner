import { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { useChat } from '@/features/chat/hooks/useChat';
import { Avatar } from '@/components/ui/Avatar';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const { messages, sendMessage, loadMore, isLoadingMore } = useChat(id);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlashList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        renderItem={({ item }) => {
          const isMine = item.senderId === user?.uid;
          return (
            <View
              style={{
                flexDirection: isMine ? 'row-reverse' : 'row',
                padding: theme.spacing.sm,
                alignItems: 'flex-end',
              }}
            >
              <Avatar uri={item.senderPhotoURL} name={item.senderName} size={28} />
              <View
                style={{
                  backgroundColor: isMine ? theme.colors.accent : theme.colors.surface,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.sm,
                  marginHorizontal: theme.spacing.xs,
                  maxWidth: '75%',
                }}
              >
                <Text style={{ color: isMine ? theme.colors.onAccent : theme.colors.textPrimary }}>
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          padding: theme.spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.textSecondary}
          style={{
            flex: 1,
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.full,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
          }}
          onSubmitEditing={handleSend}
        />
        <Pressable onPress={handleSend} style={{ justifyContent: 'center', marginLeft: theme.spacing.sm }}>
          <Text style={{ color: theme.colors.accent, fontWeight: '700' }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}