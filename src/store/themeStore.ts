import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeState {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'theme_preference';

export const useThemeStore = create<ThemeState>((set) => ({
  preference: 'system',
  setPreference: (pref) => {
    set({ preference: pref });
    SecureStore.setItemAsync(STORAGE_KEY, pref).catch(() => {});
  },
  hydrate: async () => {
    const stored = await SecureStore.getItemAsync(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      set({ preference: stored });
    }
  },
}));