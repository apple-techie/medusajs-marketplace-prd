# Skeleton Component

A comprehensive skeleton loading component family for displaying placeholder content while data is being loaded. Includes specialized skeletons for common UI patterns like text, avatars, cards, tables, and more.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { 
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  CardSkeleton,
  ProductSkeleton 
} from '@/components/atoms/Skeleton';

// Basic skeleton
<Skeleton width={200} height={20} />

// Text skeleton
<TextSkeleton lines={3} />

// Avatar skeleton
<AvatarSkeleton size="md" />

// Card skeleton
<CardSkeleton showImage showTitle showDescription />

// Product skeleton
<ProductSkeleton orientation="vertical" />
```

## Components

### Skeleton

The base component for all skeleton types.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string \| number` | - | Width of the skeleton |
| `height` | `string \| number` | - | Height of the skeleton |
| `variant` | `'default' \| 'primary' \| 'secondary' \| 'light' \| 'dark'` | `'default'` | Visual variant |
| `animation` | `'pulse' \| 'wave' \| 'none'` | `'pulse'` | Animation type |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Border radius |
| `as` | `'div' \| 'span' \| 'p'` | `'div'` | HTML element |
| `className` | `string` | - | Additional CSS classes |
| `aria-label` | `string` | `'Loading...'` | Accessibility label |

### TextSkeleton

Multi-line text placeholder.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lines` | `number` | `3` | Number of lines |
| `lineHeight` | `number` | `20` | Height of each line (px) |
| `spacing` | `number` | `8` | Space between lines (px) |
| `lastLineWidth` | `string \| number` | `'80%'` | Width of last line |
| `width` | `string \| number` | `'100%'` | Width of lines |

### AvatarSkeleton

Circular placeholder for user avatars.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |

### ButtonSkeleton

Button-shaped placeholder.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `width` | `string \| number` | - | Custom width |

### CardSkeleton

Complete card layout skeleton.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showImage` | `boolean` | `true` | Show image placeholder |
| `imageHeight` | `number` | `200` | Image height (px) |
| `showTitle` | `boolean` | `true` | Show title placeholder |
| `showDescription` | `boolean` | `true` | Show description |
| `descriptionLines` | `number` | `3` | Description lines |
| `showActions` | `boolean` | `true` | Show action buttons |
| `padding` | `boolean` | `true` | Apply padding |

### TableSkeleton

Table layout skeleton.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `number` | `5` | Number of rows |
| `columns` | `number` | `4` | Number of columns |
| `showHeader` | `boolean` | `true` | Show header row |
| `columnWidths` | `(string \| number)[]` | - | Custom column widths |

### FormSkeleton

Form layout skeleton.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fields` | `number` | `3` | Number of fields |
| `showLabels` | `boolean` | `true` | Show field labels |
| `showButton` | `boolean` | `true` | Show submit button |

### ProductSkeleton

E-commerce product skeleton.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showBadge` | `boolean` | `true` | Show badge placeholder |
| `showRating` | `boolean` | `true` | Show rating placeholder |
| `showPrice` | `boolean` | `true` | Show price placeholder |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout orientation |

### ListItemSkeleton

List item skeleton.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showAvatar` | `boolean` | `true` | Show avatar |
| `showSecondaryText` | `boolean` | `true` | Show subtitle |
| `showAction` | `boolean` | `false` | Show action button |

## Examples

### Basic Shapes

```tsx
// Rectangle
<Skeleton width={200} height={100} />

// Square
<Skeleton width={100} height={100} />

// Circle
<Skeleton width={50} height={50} rounded="full" />

// Pill
<Skeleton width={120} height={40} rounded="full" />
```

### Text Content

```tsx
// Paragraph
<TextSkeleton lines={3} />

// Article
<TextSkeleton lines={5} lineHeight={24} spacing={12} />

// With varying line widths
<TextSkeleton 
  lines={4} 
  lastLineWidth="60%"
/>
```

### User Interface Elements

```tsx
// User avatar with name
<div className="flex items-center gap-3">
  <AvatarSkeleton size="md" />
  <div>
    <Skeleton width={120} height={16} />
    <Skeleton width={80} height={14} className="mt-1" />
  </div>
</div>

// Button group
<div className="flex gap-2">
  <ButtonSkeleton size="md" />
  <ButtonSkeleton size="md" width={100} />
</div>
```

### Card Layouts

```tsx
// Blog post card
<CardSkeleton 
  imageHeight={250}
  descriptionLines={2}
/>

// Product card
<ProductSkeleton 
  showBadge
  showRating
  showPrice
/>

// Minimal card
<CardSkeleton 
  showImage={false}
  showActions={false}
  descriptionLines={1}
/>
```

### Data Tables

```tsx
// Basic table
<TableSkeleton rows={5} columns={4} />

// Custom columns
<TableSkeleton 
  rows={3}
  columns={4}
  columnWidths={['40%', '20%', '20%', '20%']}
/>

// No header
<TableSkeleton 
  rows={5}
  columns={3}
  showHeader={false}
/>
```

### Forms

```tsx
// Login form
<FormSkeleton fields={2} />

// Complex form
<FormSkeleton 
  fields={5}
  showLabels
  showButton
/>

// Inline form
<FormSkeleton 
  fields={3}
  showLabels={false}
/>
```

### Complete Pages

```tsx
// Product listing page
function ProductListingSkeleton() {
  return (
    <div>
      {/* Filters */}
      <div className="mb-6">
        <Skeleton width={200} height={40} />
      </div>
      
      {/* Product grid */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Dashboard
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border rounded">
            <Skeleton width="60%" height={16} className="mb-2" />
            <Skeleton width="80%" height={32} />
          </div>
        ))}
      </div>
      
      {/* Chart */}
      <Skeleton width="100%" height={300} rounded="lg" />
      
      {/* Table */}
      <TableSkeleton rows={5} columns={5} />
    </div>
  );
}
```

## Animation Styles

### Pulse (Default)
```tsx
<Skeleton animation="pulse" />
```

### Wave/Shimmer
```tsx
<Skeleton animation="wave" />
```
Note: Requires custom CSS animation:
```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.2) 80%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### No Animation
```tsx
<Skeleton animation="none" />
```

## Accessibility

- Uses `role="status"` for screen readers
- Includes `aria-busy="true"` attribute
- Customizable `aria-label` for context
- Semantic HTML structure

## Best Practices

1. **Match real content**: Skeleton should closely match the actual content layout
2. **Use appropriate animations**: Pulse for most cases, wave for lists
3. **Group related skeletons**: Wrap related skeletons in containers
4. **Responsive design**: Ensure skeletons adapt to different screen sizes
5. **Performance**: Limit number of animated skeletons on screen
6. **Timing**: Show skeletons immediately, hide after content loads
7. **Consistency**: Use same skeleton styles throughout the app
8. **Dark mode**: Test skeletons in both light and dark themes
9. **Loading states**: Combine with loading spinners for long operations
10. **Fallback content**: Provide meaningful loading messages