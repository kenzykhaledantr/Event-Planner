import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase.config';
import { AppUser, RegisterInput, LoginInput } from '../types';

export const authService = {
  async register({ displayName, email, password }: RegisterInput): Promise<void> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });

    await setDoc(doc(db, 'users', credential.user.uid), {
      displayName,
      email,
      photoURL: null,
      activeRole: 'attendee',
      favoriteEventIds: [],
      createdAt: serverTimestamp(),
      pushToken: null,
    });

    await sendEmailVerification(credential.user);
  },

  async login({ email, password }: LoginInput): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  async resendVerificationEmail(): Promise<void> {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  },

  async fetchUserProfile(uid: string): Promise<AppUser | null> {
    const snapshot = await getDoc(doc(db, 'users', uid));
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return {
      uid,
      displayName: data.displayName,
      email: data.email,
      photoURL: data.photoURL,
      activeRole: data.activeRole,
      favoriteEventIds: data.favoriteEventIds ?? [],
    };
  },

  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};