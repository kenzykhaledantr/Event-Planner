import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, limit, startAfter, Timestamp, serverTimestamp,
  QueryDocumentSnapshot, DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase.config';
import { Event, CreateEventInput, EventFilters } from '../types';
import { runTransaction, increment, onSnapshot, Unsubscribe, limit as fbLimit } from 'firebase/firestore';
import { Attendee } from '../types';

const EVENTS_COLLECTION = 'events';
const PAGE_SIZE = 10;

function toEventDocData(input: CreateEventInput, organizerId: string) {
  return {
    title: input.title,
    description: input.description,
    category: input.category,
    coverImageURL: input.coverImageURL,
    date: Timestamp.fromDate(input.date),
    startTime: Timestamp.fromDate(input.startTime),
    endTime: Timestamp.fromDate(input.endTime),
    location: input.location,
    maxAttendees: input.maxAttendees,
    attendeeCount: 0,
    organizerId,
    visibility: input.visibility,
    tags: input.tags,
    price: input.price,
    status: 'active' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export const eventService = {
  async createEvent(input: CreateEventInput, organizerId: string): Promise<string> {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), toEventDocData(input, organizerId));
    return docRef.id;
  },

  async getEventById(eventId: string): Promise<Event | null> {
    const snapshot = await getDoc(doc(db, EVENTS_COLLECTION, eventId));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Event;
  },

  async updateEvent(eventId: string, updates: Partial<CreateEventInput>): Promise<void> {
    const payload: Record<string, unknown> = { ...updates, updatedAt: serverTimestamp() };
    if (updates.date) payload.date = Timestamp.fromDate(updates.date);
    if (updates.startTime) payload.startTime = Timestamp.fromDate(updates.startTime);
    if (updates.endTime) payload.endTime = Timestamp.fromDate(updates.endTime);

    await updateDoc(doc(db, EVENTS_COLLECTION, eventId), payload);
  },

  async deleteEvent(eventId: string): Promise<void> {
    await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
  },

  async listPublicEvents(
    filters: EventFilters,
    cursor?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ events: Event[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    const constraints = [
      where('visibility', '==', 'public'),
      where('status', '==', 'active'),
    ];

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }

    let q = query(
      collection(db, EVENTS_COLLECTION),
      ...constraints,
      orderBy('date', 'asc'),
      limit(PAGE_SIZE)
    );

    if (cursor) {
      q = query(
        collection(db, EVENTS_COLLECTION),
        ...constraints,
        orderBy('date', 'asc'),
        startAfter(cursor),
        limit(PAGE_SIZE)
      );
    }

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Event));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;

    return { events, lastDoc };
  },

  async listOrganizerEvents(organizerId: string): Promise<Event[]> {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where('organizerId', '==', organizerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Event));
  },
  async joinEvent(eventId: string, attendee: { uid: string; displayName: string; photoURL: string | null }): Promise<void> {
  const eventRef = doc(db, EVENTS_COLLECTION, eventId);
  const attendeeRef = doc(db, EVENTS_COLLECTION, eventId, 'attendees', attendee.uid);

  await runTransaction(db, async (tx) => {
    const eventSnap = await tx.get(eventRef);
    const attendeeSnap = await tx.get(attendeeRef);

    if (!eventSnap.exists()) throw new Error('Event not found');
    if (attendeeSnap.exists()) return; // Already joined — idempotent no-op.

    const eventData = eventSnap.data();
    if (eventData.maxAttendees !== null && eventData.attendeeCount >= eventData.maxAttendees) {
      throw new Error('EVENT_FULL');
    }

    tx.set(attendeeRef, {
      uid: attendee.uid,
      displayName: attendee.displayName,
      photoURL: attendee.photoURL,
      joinedAt: serverTimestamp(),
    });
    tx.update(eventRef, { attendeeCount: increment(1), updatedAt: serverTimestamp() });
  });
},

async leaveEvent(eventId: string, uid: string): Promise<void> {
  const eventRef = doc(db, EVENTS_COLLECTION, eventId);
  const attendeeRef = doc(db, EVENTS_COLLECTION, eventId, 'attendees', uid);

  await runTransaction(db, async (tx) => {
    const attendeeSnap = await tx.get(attendeeRef);
    if (!attendeeSnap.exists()) return; // Not joined — idempotent no-op.

    tx.delete(attendeeRef);
    tx.update(eventRef, { attendeeCount: increment(-1), updatedAt: serverTimestamp() });
  });
},

async listAttendees(eventId: string, max = 12): Promise<Attendee[]> {
  const q = query(collection(db, EVENTS_COLLECTION, eventId, 'attendees'), fbLimit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Attendee);
},

subscribeToEvent(eventId: string, callback: (event: Event | null) => void): Unsubscribe {
  return onSnapshot(doc(db, EVENTS_COLLECTION, eventId), (snap) => {
    callback(snap.exists() ? ({ id: snap.id, ...snap.data() } as Event) : null);
  });
},

subscribeToAttendeeStatus(eventId: string, uid: string, callback: (isAttending: boolean) => void): Unsubscribe {
  return onSnapshot(doc(db, EVENTS_COLLECTION, eventId, 'attendees', uid), (snap) => {
    callback(snap.exists());
  });
},
};