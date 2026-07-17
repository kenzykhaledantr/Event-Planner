import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase.config';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuthRequest() {
  return Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
}

export async function completeGoogleSignIn(idToken: string): Promise<void> {
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, credential);
  const user = userCredential.user;

  const profileRef = doc(db, 'users', user.uid);
  const existing = await getDoc(profileRef);

  if (!existing.exists()) {
    await setDoc(profileRef, {
      displayName: user.displayName ?? 'New User',
      email: user.email ?? '',
      photoURL: user.photoURL,
      activeRole: 'attendee',
      favoriteEventIds: [],
      createdAt: serverTimestamp(),
      pushToken: null,
    });
  }
}