// MedusaJS Marketplace Design System
// Generated from Figma design tokens
// Last synced: July 20, 2025

const colors = require('./tailwind-colors');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Import colors from separate file
      colors: colors.colors,
      
      // Typography System
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      
      fontSize: {
        // xs: 12px
        'xs': ['12px', { lineHeight: '16px' }],
        // sm: 14px
        'sm': ['14px', { lineHeight: '20px' }],
        // base: 16px
        'base': ['16px', { lineHeight: '24px' }],
        // lg: 18px
        'lg': ['18px', { lineHeight: '28px' }],
        // xl: 20px
        'xl': ['20px', { lineHeight: '28px' }],
        // 2xl: 24px
        '2xl': ['24px', { lineHeight: '32px' }],
        // 3xl: 30px
        '3xl': ['30px', { lineHeight: '36px' }],
        // 4xl: 36px
        '4xl': ['36px', { lineHeight: '40px' }],
        // 5xl: 48px
        '5xl': ['48px', { lineHeight: '1.5' }],
        // 6xl: 60px
        '6xl': ['60px', { lineHeight: '1.5' }],
        // 7xl: 72px
        '7xl': ['72px', { lineHeight: '1.5' }],
        // 8xl: 96px
        '8xl': ['96px', { lineHeight: '1.5' }],
        // 9xl: 128px
        '9xl': ['128px', { lineHeight: '1.5' }],
      },
      
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      
      // Additional spacing if needed from your design
      spacing: {
        // Add custom spacing values here
      },
      
      // Box shadows from your design
      boxShadow: {
        'card': '0px 2px 8px rgba(0, 0, 0, 0.08)',
        'dropdown': '0px 4px 16px rgba(0, 0, 0, 0.12)',
        'modal': '0px 8px 32px rgba(0, 0, 0, 0.16)',
      },
      
      // Border radius
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}