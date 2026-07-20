import { Timestamp, GeoPoint } from 'firebase/firestore';

export type EventVisibility = 'public' | 'private';
export type EventStatus = 'active' | 'archived' | 'cancelled';

export interface EventLocation {
  address: string;
  coordinates: GeoPoint | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImageURL: string | null;
  date: Timestamp;
  startTime: Timestamp;
  endTime: Timestamp;
  location: EventLocation;
  maxAttendees: number | null;
  attendeeCount: number;
  organizerId: string;
  visibility: EventVisibility;
  tags: string[];
  price: number | null;
  status: EventStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Attendee {
  uid: string;
  displayName: string;
  photoURL: string | null;
  joinedAt: Timestamp;
}

export interface CreateEventInput {
  title: string;
  description: string;
  category: string;
  coverImageURL: string | null;
  date: Date;
  startTime: Date;
  endTime: Date;
  location: EventLocation;
  maxAttendees: number | null;
  visibility: EventVisibility;
  tags: string[];
  price: number | null;
}

export interface EventFilters {
  category?: string;
  visibility?: EventVisibility;
  dateFrom?: Date;
  dateTo?: Date;
}