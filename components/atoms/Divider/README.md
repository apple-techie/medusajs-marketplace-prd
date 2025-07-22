# Divider Component

A flexible divider component for creating visual separation between content sections. Supports horizontal and vertical orientations, multiple styles, text labels, and icons.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { 
  Divider, 
  SectionDivider, 
  VerticalDivider, 
  GradientDivider 
} from '@/components/atoms/Divider';

// Basic horizontal divider
<Divider />

// Divider with text
<Divider>Section Title</Divider>

// Vertical divider
<VerticalDivider />

// Section divider with icon
<SectionDivider icon={<Icon icon="star" />}>Featured</SectionDivider>

// Gradient divider
<GradientDivider />
```

## Component Props

### DividerProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Divider direction |
| `variant` | `'solid' \| 'dashed' \| 'dotted' \| 'gradient'` | `'solid'` | Visual style |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'muted' \| 'strong'` | `'default'` | Color variant |
| `thickness` | `'thin' \| 'medium' \| 'thick'` | `'thin'` | Line thickness |
| `spacing` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Spacing around divider |
| `children` | `React.ReactNode` | - | Text content for labeled divider |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'center'` | Text alignment |
| `textClassName` | `string` | - | CSS classes for text |
| `className` | `string` | - | Additional CSS classes |
| `as` | `'div' \| 'hr'` | `'hr'` | HTML element (hr for horizontal only) |
| `aria-orientation` | `'horizontal' \| 'vertical'` | - | ARIA orientation |

### SectionDividerProps

Extends DividerProps with:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ReactNode` | - | Icon to display |
| `iconPosition` | `'left' \| 'center' \| 'right'` | `'center'` | Icon position |
| `iconClassName` | `string` | - | CSS classes for icon wrapper |

## Examples

### Basic Dividers

```tsx
// Horizontal divider
<Divider />

// Vertical divider
<VerticalDivider />

// Gradient divider
<GradientDivider />
```

### Style Variants

```tsx
// Solid line (default)
<Divider variant="solid" />

// Dashed line
<Divider variant="dashed" />

// Dotted line
<Divider variant="dotted" />

// Gradient fade
<Divider variant="gradient" />
```

### Colors

```tsx
// Default gray
<Divider color="default" />

// Primary brand color
<Divider color="primary" />

// Muted (lighter)
<Divider color="muted" />

// Strong (darker)
<Divider color="strong" />
```

### Thickness

```tsx
// Thin (1px)
<Divider thickness="thin" />

// Medium (2px)
<Divider thickness="medium" />

// Thick (4px)
<Divider thickness="thick" />
```

### Spacing

```tsx
// No spacing
<Divider spacing="none" />

// Small spacing
<Divider spacing="sm" />

// Large spacing
<Divider spacing="lg" />
```

### With Text

```tsx
// Centered text
<Divider>Section Title</Divider>

// Left aligned
<Divider textAlign="left">Chapter 1</Divider>

// Right aligned
<Divider textAlign="right">Page 42</Divider>

// Custom text styling
<Divider textClassName="text-primary-600 font-semibold">
  Premium Content
</Divider>
```

### With Icons

```tsx
// Icon only
<SectionDivider icon={<Icon icon="star" />} />

// Icon with text
<SectionDivider icon={<Icon icon="sparkles" />}>
  Featured Products
</SectionDivider>

// Multiple icons
<SectionDivider 
  icon={
    <>
      <Icon icon="star" />
      <Icon icon="star" />
      <Icon icon="star" />
    </>
  }
/>

// Custom icon styling
<SectionDivider 
  icon={<Icon icon="heart" />}
  iconClassName="text-danger-500"
>
  Customer Favorites
</SectionDivider>
```

### Real-World Use Cases

#### Login Form

```tsx
function LoginForm() {
  return (
    <div className="max-w-sm mx-auto">
      <button className="w-full py-2 border rounded">
        Sign in with Google
      </button>
      
      <Divider className="my-6">or</Divider>
      
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
```

#### Navigation Bar

```tsx
function NavBar() {
  return (
    <nav className="flex items-center">
      <a href="/home">Home</a>
      <VerticalDivider spacing="none" />
      <a href="/products">Products</a>
      <VerticalDivider spacing="none" />
      <a href="/about">About</a>
      <VerticalDivider spacing="none" />
      <a href="/contact">Contact</a>
    </nav>
  );
}
```

#### Product Sections

```tsx
function ProductSections() {
  return (
    <div>
      <section>
        <h2>Best Sellers</h2>
        {/* Products grid */}
      </section>
      
      <SectionDivider 
        icon={<Icon icon="fire" />}
        color="primary"
        thickness="medium"
      >
        Hot Deals
      </SectionDivider>
      
      <section>
        <h2>Limited Time Offers</h2>
        {/* Products grid */}
      </section>
    </div>
  );
}
```

#### Pricing Tiers

```tsx
function PricingTable() {
  return (
    <div className="flex">
      <div className="flex-1 text-center">
        <h3>Basic</h3>
        <p className="text-3xl">$9/mo</p>
      </div>
      
      <VerticalDivider thickness="medium" />
      
      <div className="flex-1 text-center">
        <h3>Pro</h3>
        <p className="text-3xl">$29/mo</p>
      </div>
      
      <VerticalDivider thickness="medium" />
      
      <div className="flex-1 text-center">
        <h3>Enterprise</h3>
        <p className="text-3xl">$99/mo</p>
      </div>
    </div>
  );
}
```

#### Footer

```tsx
function Footer() {
  return (
    <footer>
      <div className="footer-content">
        {/* Footer links and content */}
      </div>
      
      <GradientDivider thickness="medium" />
      
      <div className="text-center py-4">
        <p className="text-sm text-neutral-600">
          © 2024 Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

## Styling

### Dark Mode

All divider variants automatically adapt to dark mode:

```tsx
// Light mode: neutral-200
// Dark mode: neutral-800
<Divider />

// Custom dark mode handling
<Divider className="dark:bg-neutral-700" />
```

### Custom Styling

```tsx
// Custom colors
<Divider className="bg-red-500" />

// Custom gradients
<Divider 
  variant="gradient" 
  className="from-blue-500 via-purple-500 to-pink-500" 
/>

// Custom spacing
<Divider className="my-12" />
```

## Accessibility

- Uses semantic `<hr>` element for horizontal dividers when possible
- Includes `role="separator"` for screen readers
- `aria-orientation` attribute for proper announcement
- Text content is accessible and properly associated

## Best Practices

1. **Use semantic HTML**: Prefer `<hr>` for content separation
2. **Consistent spacing**: Use the spacing prop instead of margins
3. **Clear hierarchy**: Use stronger dividers for major sections
4. **Accessible text**: Ensure divider text has sufficient contrast
5. **Vertical in flex**: Use VerticalDivider inside flex containers
6. **Gradient sparingly**: Reserve gradients for special emphasis
7. **Icon meaning**: Use icons that reinforce section purpose
8. **Responsive design**: Test dividers on mobile layouts
9. **Dark mode**: Verify visibility in both light and dark themes
10. **Performance**: Limit gradient animations for better performance