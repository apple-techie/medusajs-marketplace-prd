# MedusaJS Marketplace Design System

This design system is generated from Figma design tokens and provides a consistent visual language for the marketplace platform.

## Setup

### 1. Install Dependencies

```bash
npm install -D tailwindcss @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
npm install inter-ui  # or use Google Fonts
```

### 2. Import Tailwind Config

```javascript
// tailwind.config.js
module.exports = require('./design-system/tailwind.config.js');
```

### 3. Add Inter Font

```tsx
// app/layout.tsx or _document.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});
```

## Design Tokens

### Colors

Our color system includes 6 color families:

- **Neutral**: Gray scale for text and backgrounds
- **Primary**: Purple for primary actions and brand
- **Secondary**: Blue for secondary actions
- **Success**: Green for positive states
- **Warning**: Yellow for warnings
- **Danger**: Red for errors and destructive actions

Each color has 10 shades from 50 (lightest) to 900 (darkest).

### Typography

The typography system uses Inter font with:

- **Sizes**: xs (12px) to 9xl (128px)
- **Weights**: regular (400), medium (500), semibold (600), bold (700)
- **Line Heights**: Optimized for readability

## Usage Examples

### Using Colors

```tsx
// Background colors
<div className="bg-primary-500">Primary background</div>
<div className="bg-neutral-100">Light gray background</div>

// Text colors
<p className="text-neutral-900">Dark text</p>
<p className="text-primary-600">Primary text</p>

// Border colors
<div className="border border-neutral-300">Card with border</div>
```

### Using Typography

```tsx
import { textStyles } from '@/design-system/typography';

// Semantic styles
<h1 className={textStyles.pageTitle}>Page Title</h1>
<h2 className={textStyles.sectionTitle}>Section Title</h2>
<p className={textStyles.body}>Body text</p>

// Direct typography classes
<h1 className="text-4xl font-bold">Custom heading</h1>
<p className="text-base font-regular">Custom paragraph</p>
```

### Common Patterns

#### Card Component
```tsx
<div className="bg-white rounded-lg shadow-card p-6">
  <h3 className={textStyles.cardTitle}>Card Title</h3>
  <p className={textStyles.bodySmall}>Card description</p>
</div>
```

#### Button Styles
```tsx
// Primary button
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium">
  Primary Button
</button>

// Secondary button
<button className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-md font-medium">
  Secondary Button
</button>
```

#### Form Input
```tsx
<div className="space-y-1">
  <label className={textStyles.inputLabel}>Email</label>
  <input 
    type="email" 
    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
  />
  <p className={textStyles.inputHelp}>We'll never share your email</p>
</div>
```

## Component Integration

When creating components from Figma:

1. Use the exact color tokens (e.g., `text-neutral-900` not `text-gray-900`)
2. Use the typography system for consistent text styles
3. Apply the shadow classes for elevation
4. Use the border radius scale for consistency

## Figma Sync

To update design tokens from Figma:

1. Select the Colors frame in Figma
2. Run `mcp__figma__get_variable_defs` to get latest colors
3. Select Typography frame
4. Run `mcp__figma__get_variable_defs` to get latest typography
5. Update the relevant files in this directory

Last synced: July 20, 2025