import { Platform } from 'react-native';

export const Colors = {
  primary: '#2E7D32',
  primaryLight: '#66BB6A',
  primaryDark: '#1B5E20',
  secondary: '#0284c7',
  accent: '#F9A825',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  surface: '#ffffff',
  background: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  borderFocused: '#2E7D32',
  text: '#0f172a',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  textInverse: '#ffffff',
  overlay: 'rgba(0,0,0,0.5)',
  shadow: '#000000',
  light: {
    text: '#0f172a',
    background: '#f8fafc',
    tint: '#2E7D32',
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#2E7D32',
    card: '#ffffff',
    border: '#e2e8f0',
    notification: '#ef4444',
  },
  dark: {
    text: '#f1f5f9',
    background: '#0f172a',
    tint: '#34d399',
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: '#34d399',
    card: '#1e293b',
    border: '#334155',
    notification: '#ef4444',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  captionBold: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  smallBold: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
