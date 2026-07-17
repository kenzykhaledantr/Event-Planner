export const palette = {
  violet50: '#F5F3FF',
  violet400: '#A78BFA',
  violet500: '#8B5CF6',
  violet600: '#7C3AED',
  violet700: '#6D28D9',

  neutral0: '#FFFFFF',
  neutral50: '#F9FAFB',
  neutral200: '#E5E7EB',
  neutral400: '#9CA3AF',
  neutral600: '#4B5563',
  neutral800: '#1F2937',
  neutral900: '#111117',
  neutral950: '#0B0B12',

  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
} as const;

export const darkColors = {
  background: palette.neutral950,
  surface: palette.neutral900,
  surfaceElevated: palette.neutral800,
  border: '#26262F',
  textPrimary: palette.neutral0,
  textSecondary: palette.neutral400,
  accent: palette.violet500,
  accentPressed: palette.violet600,
  onAccent: palette.neutral0,
  success: palette.success,
  danger: palette.danger,
  warning: palette.warning,
};

export const lightColors = {
  background: palette.neutral50,
  surface: palette.neutral0,
  surfaceElevated: palette.neutral0,
  border: palette.neutral200,
  textPrimary: palette.neutral900,
  textSecondary: palette.neutral600,
  accent: palette.violet600,
  accentPressed: palette.violet700,
  onAccent: palette.neutral0,
  success: palette.success,
  danger: palette.danger,
  warning: palette.warning,
};

export type ThemeColors = typeof darkColors;