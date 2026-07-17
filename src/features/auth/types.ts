export type UserRole = 'attendee' | 'organizer';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  activeRole: UserRole;
  favoriteEventIds: string[];
}

export interface RegisterInput {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

