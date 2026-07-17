import { create } from 'zustand';
import { AppUser } from '@/features/auth/types';

interface AuthState {
  user: AppUser | null;
  isInitializing: boolean;
  setUser: (user: AppUser | null) => void;
  setInitializing: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitializing: true,
  setUser: (user) => set({ user }),
  setInitializing: (value) => set({ isInitializing: value }),
}));