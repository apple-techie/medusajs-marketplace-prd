# Design System Specifications

## Table of Contents
1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Component Library](#component-library)
6. [Layout System](#layout-system)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)

---

## 1. Overview

The design system provides a comprehensive set of guidelines, components, and patterns for building a consistent and cohesive user interface across the marketplace platform.

### Technology Stack
- **UI Framework**: Next.js 14 with App Router
- **Component Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

### Design Tools
- **Design Software**: Figma
- **Prototyping**: Figma Prototypes
- **Design Tokens**: Style Dictionary
- **Documentation**: Storybook

---

## 2. Design Principles

### 2.1 Core Principles

1. **Clarity**
   - Clear visual hierarchy
   - Intuitive navigation
   - Obvious interactive elements
   - Meaningful feedback

2. **Consistency**
   - Unified design language
   - Predictable patterns
   - Coherent interactions
   - Standard components

3. **Efficiency**
   - Minimal cognitive load
   - Quick task completion
   - Smart defaults
   - Progressive disclosure

4. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader support
   - High contrast options

5. **Responsiveness**
   - Mobile-first approach
   - Fluid layouts
   - Touch-friendly targets
   - Adaptive content

---

## 3. Color System

### 3.1 Color Palette

```css
/* Base Colors */
:root {
  /* Primary */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-800: #075985;
  --primary-900: #0c4a6e;
  
  /* Secondary */
  --secondary-50: #f8fafc;
  --secondary-100: #f1f5f9;
  --secondary-200: #e2e8f0;
  --secondary-300: #cbd5e1;
  --secondary-400: #94a3b8;
  --secondary-500: #64748b;
  --secondary-600: #475569;
  --secondary-700: #334155;
  --secondary-800: #1e293b;
  --secondary-900: #0f172a;
  
  /* Success */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-700: #15803d;
  
  /* Warning */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-700: #b45309;
  
  /* Error */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-700: #b91c1c;
}
```

### 3.2 Semantic Colors

```typescript
// tailwind.config.ts
export const semanticColors = {
  background: {
    DEFAULT: 'hsl(var(--background))',
    secondary: 'hsl(var(--secondary))',
    muted: 'hsl(var(--muted))',
  },
  foreground: {
    DEFAULT: 'hsl(var(--foreground))',
    muted: 'hsl(var(--muted-foreground))',
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
};
```

---

## 4. Typography

### 4.1 Font Stack

```css
/* Font Families */
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
               'Droid Sans', 'Helvetica Neue', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 
               'Fira Code', 'Fira Mono', 'Droid Sans Mono', 'Courier New', 
               monospace;
}
```

### 4.2 Type Scale

```typescript
// Typography scale
export const typography = {
  // Display
  'display-2xl': {
    fontSize: '4.5rem',
    lineHeight: '1',
    letterSpacing: '-0.02em',
    fontWeight: '700',
  },
  'display-xl': {
    fontSize: '3.75rem',
    lineHeight: '1',
    letterSpacing: '-0.02em',
    fontWeight: '700',
  },
  'display-lg': {
    fontSize: '3rem',
    lineHeight: '1',
    letterSpacing: '-0.02em',
    fontWeight: '600',
  },
  
  // Headings
  h1: {
    fontSize: '2.25rem',
    lineHeight: '2.5rem',
    fontWeight: '700',
  },
  h2: {
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: '600',
  },
  h3: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
    fontWeight: '600',
  },
  h4: {
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    fontWeight: '600',
  },
  h5: {
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    fontWeight: '600',
  },
  h6: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: '600',
  },
  
  // Body
  'body-lg': {
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
  },
  body: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  'body-sm': {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
  'body-xs': {
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
};
```

---

## 5. Component Library

### 5.1 Base Components

```tsx
// Button Component
export const Button = {
  variants: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  sizes: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  },
};

// Card Component
export const Card = {
  base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  header: 'flex flex-col space-y-1.5 p-6',
  title: 'text-2xl font-semibold leading-none tracking-tight',
  description: 'text-sm text-muted-foreground',
  content: 'p-6 pt-0',
  footer: 'flex items-center p-6 pt-0',
};

// Input Component
export const Input = {
  base: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
};
```

### 5.2 Composite Components

```tsx
// Metric Card
export function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                trend === 'up' ? "text-green-600" : "text-red-600"
              )}>
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {change}
              </div>
            )}
          </div>
          {Icon && (
            <div className="p-3 bg-muted rounded-lg">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Data Table
export function DataTable<T>({
  columns,
  data,
  searchKey,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  
  return (
    <div>
      {searchKey && (
        <div className="flex items-center py-4">
          <Input
            placeholder="Search..."
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          {/* Table implementation */}
        </Table>
      </div>
    </div>
  );
}
```

---

## 6. Layout System

### 6.1 Grid System

```css
/* 12-column grid system */
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

/* Responsive columns */
.col-span-full { grid-column: span 12 / span 12; }
.col-span-6 { grid-column: span 6 / span 6; }
.col-span-4 { grid-column: span 4 / span 4; }
.col-span-3 { grid-column: span 3 / span 3; }

@media (max-width: 768px) {
  .md\:col-span-full { grid-column: span 12 / span 12; }
  .md\:col-span-6 { grid-column: span 6 / span 6; }
}
```

### 6.2 Spacing System

```typescript
// Spacing scale
export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};
```

### 6.3 Container System

```css
/* Container widths */
.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1rem;
  padding-left: 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

@media (min-width: 1536px) {
  .container { max-width: 1536px; }
}
```

---

## 7. Responsive Design

### 7.1 Breakpoints

```typescript
// Breakpoint system
export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Large desktop
};
```

### 7.2 Mobile-First Patterns

```tsx
// Responsive Navigation
export function ResponsiveNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left">
            <MobileNavigation />
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        <DesktopNavigation />
      </nav>
    </>
  );
}

// Responsive Grid
export function ResponsiveGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </div>
  );
}
```

### 7.3 Touch Optimization

```css
/* Touch-friendly targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Hover states for touch devices */
@media (hover: hover) {
  .hover\:bg-accent:hover {
    background-color: var(--accent);
  }
}

/* Disable hover on touch devices */
@media (hover: none) {
  .hover\:bg-accent:hover {
    background-color: transparent;
  }
}
```

---

## 8. Accessibility

### 8.1 ARIA Patterns

```tsx
// Accessible Modal
export function AccessibleModal({ 
  open, 
  onClose, 
  title, 
  children 
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="dialog-title">{title}</DialogTitle>
        </DialogHeader>
        <div id="dialog-description">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Accessible Form
export function AccessibleForm() {
  return (
    <form>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">
            Email Address
            <span className="text-destructive ml-1" aria-label="required">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-destructive mt-1">
              {errors.email}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
```

### 8.2 Keyboard Navigation

```typescript
// Keyboard navigation hook
export function useKeyboardNavigation(items: any[]) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(items.length - 1, prev + 1));
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(items.length - 1);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length]);
  
  return { focusedIndex };
}
```

### 8.3 Screen Reader Support

```tsx
// Screen reader announcements
export function LiveRegion({ message, priority = 'polite' }: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Skip navigation
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background text-foreground p-2 rounded"
    >
      Skip to main content
    </a>
  );
}
```

---

## Summary

The design system provides:

1. **Consistent Visual Language** - Unified colors, typography, and spacing
2. **Reusable Components** - Pre-built UI components with variants
3. **Responsive Framework** - Mobile-first approach with breakpoints
4. **Accessibility Standards** - WCAG 2.1 AA compliance
5. **Developer Experience** - Clear documentation and patterns

This foundation ensures a cohesive user experience across all touchpoints of the marketplace platform.
