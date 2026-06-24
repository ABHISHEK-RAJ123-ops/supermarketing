export const COLORS = {
  background: '#F8F9FA', // 60% Dominant Neutral (Off-White)
  surface: '#FFFFFF', // Clean white for cards
  primary: '#1A2530', // 30% Secondary Structural (Deep Slate)
  secondary: '#2C3E50', // Lighter variant of structural
  accent: '#00B86B', // 10% Vibrant Accent (Fresh Green)
  accentDark: '#009959',
  text: '#1A2530',
  textLight: '#6C7A89',
  border: '#EAECEE',
  error: '#FF4D4D',
  success: '#00B86B',
  warning: '#FFC107',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  xxl: 32,
  radius: 12, // Uniform 12px rounded corners
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
};
