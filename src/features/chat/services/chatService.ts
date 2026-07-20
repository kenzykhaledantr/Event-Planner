import {
  collection, addDoc, query, orderBy, limit, startAfter,
  onSnapshot, getDocs, serverTimestamp, Unsubscribe,
  QueryDocumentSnapshot, DocumentData,doc, getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase.config';
import { ChatMessage } from '../types';


const LIVE_PAGE_SIZE = 30;
const HISTORY_PAGE_SIZE = 20;

function messagesRef(eventId: string) {
  return collection(db, 'events', eventId, 'messages');
}

export const chatService = {
  sendMessage(
    eventId: string,
    sender: { uid: string; displayName: string; photoURL: string | null },
    text: string
  ): Promise<unknown> {
    return addDoc(messagesRef(eventId), {
      senderId: sender.uid,
      senderName: sender.displayName,
      senderPhotoURL: sender.photoURL,
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
  },

  subscribeToLiveMessages(
    eventId: string,
    callback: (messages: ChatMessage[]) => void
  ): Unsubscribe {
    const q = query(messagesRef(eventId), orderBy('createdAt', 'desc'), limit(LIVE_PAGE_SIZE));
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage));
      callback(messages);
    });
  },

  async fetchOlderMessages(
    eventId: string,
    cursor: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ messages: ChatMessage[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    const q = query(
      messagesRef(eventId),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(HISTORY_PAGE_SIZE)
    );
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;
      return { messages, lastDoc };
      
    },
 

async fetchOlderMessagesAfterId(
  eventId: string,
  afterMessageId: string
): Promise<{ messages: ChatMessage[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const cursorSnap = await getDoc(doc(db, 'events', eventId, 'messages', afterMessageId));
  if (!cursorSnap.exists()) return { messages: [], lastDoc: null };

  const q = query(
    messagesRef(eventId),
    orderBy('createdAt', 'desc'),
    startAfter(cursorSnap),
    limit(HISTORY_PAGE_SIZE)
  );
  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage));
  const lastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;
  return { messages, lastDoc };
}
};