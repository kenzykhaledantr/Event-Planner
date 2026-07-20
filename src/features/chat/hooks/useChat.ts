import { useEffect, useRef, useState } from 'react';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { chatService } from '../services/chatService';
import { ChatMessage } from '../types';
import { useAuthStore } from '@/store/authStore';

export function useChat(eventId: string) {
  const user = useAuthStore((s) => s.user);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [olderMessages, setOlderMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  useEffect(() => {
    const unsubscribe = chatService.subscribeToLiveMessages(eventId, (messages) => {
      setLiveMessages(messages);
      // The oldest message in the live window becomes our starting cursor
      // for "load more" — but only set it once, the first time messages arrive,
      // so it doesn't shift underneath an in-progress pagination.
      if (!cursorRef.current && messages.length > 0) {
        cursorRef.current = null; // set properly on first fetch below
      }
    });
    return unsubscribe;
  }, [eventId]);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    const cursorSourceMessages = olderMessages.length > 0 ? olderMessages : liveMessages;
    const lastMessage = cursorSourceMessages[cursorSourceMessages.length - 1];
    if (!lastMessage) return;

    setIsLoadingMore(true);
    try {
      // Re-fetch a lightweight doc snapshot to use as a proper cursor
      // (we only have plain data + id from state, not a QueryDocumentSnapshot).
      const { messages, lastDoc } = await chatService.fetchOlderMessagesAfterId(eventId, lastMessage.id);
      setOlderMessages((prev) => [...prev, ...messages]);
      setHasMore(!!lastDoc && messages.length > 0);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // De-duplicate: if a message exists in both live and older (edge case around
  // the boundary as new messages push old ones out of the live window),
  // prefer the live copy.
  const allMessages = [...liveMessages, ...olderMessages.filter(
    (old) => !liveMessages.some((live) => live.id === old.id)
  )];

  const sendMessage = async (text: string) => {
    if (!user || !text.trim()) return;
    await chatService.sendMessage(eventId, { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL }, text);
  };

  return { messages: allMessages, sendMessage, loadMore, isLoadingMore, hasMore };
}