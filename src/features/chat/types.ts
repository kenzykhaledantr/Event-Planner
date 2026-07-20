import { Timestamp } from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderPhotoURL: string | null;
  text: string;
  createdAt: Timestamp;
}