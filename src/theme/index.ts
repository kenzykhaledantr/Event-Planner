import { darkColors, lightColors } from './colors';
import { spacing, radius } from './spacing';
import { typography } from './typography';

export function buildTheme(mode: 'light' | 'dark') {
  return {
    mode,
    colors: mode === 'dark' ? darkColors : lightColors,
    spacing,
    radius,
    typography,
  };
}

export type Theme = ReturnType<typeof buildTheme>;