// Typography System
// Generated from Figma design tokens
// Last synced: July 20, 2025

export const typography = {
  // Display text styles (for large headings)
  display: {
    '9xl': {
      regular: 'text-9xl font-regular',
      medium: 'text-9xl font-medium',
      semibold: 'text-9xl font-semibold',
      bold: 'text-9xl font-bold',
    },
    '8xl': {
      regular: 'text-8xl font-regular',
      medium: 'text-8xl font-medium',
      semibold: 'text-8xl font-semibold',
      bold: 'text-8xl font-bold',
    },
    '7xl': {
      regular: 'text-7xl font-regular',
      medium: 'text-7xl font-medium',
      semibold: 'text-7xl font-semibold',
      bold: 'text-7xl font-bold',
    },
    '6xl': {
      regular: 'text-6xl font-regular',
      medium: 'text-6xl font-medium',
      semibold: 'text-6xl font-semibold',
      bold: 'text-6xl font-bold',
    },
    '5xl': {
      regular: 'text-5xl font-regular',
      medium: 'text-5xl font-medium',
      semibold: 'text-5xl font-semibold',
      bold: 'text-5xl font-bold',
    },
  },
  
  // Heading styles
  heading: {
    '4xl': {
      regular: 'text-4xl font-regular',
      medium: 'text-4xl font-medium',
      semibold: 'text-4xl font-semibold',
      bold: 'text-4xl font-bold',
    },
    '3xl': {
      regular: 'text-3xl font-regular',
      medium: 'text-3xl font-medium',
      semibold: 'text-3xl font-semibold',
      bold: 'text-3xl font-bold',
    },
    '2xl': {
      regular: 'text-2xl font-regular',
      medium: 'text-2xl font-medium',
      semibold: 'text-2xl font-semibold',
      bold: 'text-2xl font-bold',
    },
    'xl': {
      regular: 'text-xl font-regular',
      medium: 'text-xl font-medium',
      semibold: 'text-xl font-semibold',
      bold: 'text-xl font-bold',
    },
  },
  
  // Body text styles
  body: {
    'lg': {
      regular: 'text-lg font-regular',
      medium: 'text-lg font-medium',
      semibold: 'text-lg font-semibold',
      bold: 'text-lg font-bold',
    },
    'base': {
      regular: 'text-base font-regular',
      medium: 'text-base font-medium',
      semibold: 'text-base font-semibold',
      bold: 'text-base font-bold',
    },
    'sm': {
      regular: 'text-sm font-regular',
      medium: 'text-sm font-medium',
      semibold: 'text-sm font-semibold',
      bold: 'text-sm font-bold',
    },
    'xs': {
      regular: 'text-xs font-regular',
      medium: 'text-xs font-medium',
      semibold: 'text-xs font-semibold',
      bold: 'text-xs font-bold',
    },
  },
};

// Semantic typography classes for common use cases
export const textStyles = {
  // Page titles
  pageTitle: 'text-4xl font-bold text-neutral-900',
  
  // Section headers
  sectionTitle: 'text-2xl font-semibold text-neutral-900',
  sectionSubtitle: 'text-lg font-medium text-neutral-700',
  
  // Card headers
  cardTitle: 'text-xl font-semibold text-neutral-900',
  cardSubtitle: 'text-base font-medium text-neutral-700',
  
  // Body text
  bodyLarge: 'text-lg font-regular text-neutral-800',
  body: 'text-base font-regular text-neutral-800',
  bodySmall: 'text-sm font-regular text-neutral-700',
  
  // UI elements
  buttonText: 'text-base font-medium',
  inputLabel: 'text-sm font-medium text-neutral-900',
  inputHelp: 'text-xs font-regular text-neutral-600',
  
  // Navigation
  navLink: 'text-base font-medium text-neutral-700 hover:text-primary-600',
  navLinkActive: 'text-base font-semibold text-primary-600',
  
  // Pricing
  priceDisplay: 'text-2xl font-bold text-neutral-900',
  priceOriginal: 'text-lg font-regular text-neutral-500 line-through',
  
  // Status text
  statusSuccess: 'text-sm font-medium text-success-700',
  statusWarning: 'text-sm font-medium text-warning-700',
  statusError: 'text-sm font-medium text-danger-700',
  
  // Metadata
  timestamp: 'text-xs font-regular text-neutral-600',
  badge: 'text-xs font-semibold uppercase tracking-wide',
};

// Helper function to combine typography classes
export function text(size: keyof typeof typography.body, weight: keyof typeof typography.body.base) {
  return typography.body[size]?.[weight] || typography.body.base.regular;
}