import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase.config';
import { UpdateProfileInput } from '../types';
import { UserRole } from '@/features/auth/types';

export const profileService = {
  async updateProfile(uid: string, input: UpdateProfileInput): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      displayName: input.displayName,
      photoURL: input.photoURL || null,
    });
  },

  async setActiveRole(uid: string, role: UserRole): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      activeRole: role,
    });
  },
};