# CompanyLogos Component

A flexible component for displaying collections of company logos, including partners, sponsors, payment methods, shipping providers, or brand partnerships. Features responsive layouts, grayscale effects, interactive capabilities, and preset configurations for common use cases.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { CompanyLogos } from '@/components/organisms/CompanyLogos';

// Basic usage
const logos = [
  { id: 'partner1', name: 'Partner 1', src: '/logos/partner1.svg' },
  { id: 'partner2', name: 'Partner 2', src: '/logos/partner2.svg' },
];

<CompanyLogos logos={logos} />

// With title and description
<CompanyLogos 
  logos={logos}
  showTitle={true}
  title="Our Partners"
  description="Trusted by industry leaders"
/>
```

## Component Props

### CompanyLogosProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logos` | `Logo[]` | - | **Required**. Array of logo objects |
| `title` | `string` | `'Our Partners'` | Section title |
| `description` | `string` | `'Trusted by leading companies worldwide'` | Section description |
| `showTitle` | `boolean` | `false` | Show title and description |
| `layout` | `'horizontal' \| 'vertical' \| 'grid'` | `'horizontal'` | Layout style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Gap between logos |
| `alignment` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'center'` | Logo alignment |
| `logoSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Individual logo size |
| `grayscale` | `boolean` | `true` | Apply grayscale filter |
| `interactive` | `boolean` | `false` | Make logos clickable |
| `columns` | `2 \| 3 \| 4 \| 5 \| 6 \| 'auto'` | `'auto'` | Grid columns (when layout is 'grid') |
| `className` | `string` | - | Additional CSS classes for logo container |
| `logoClassName` | `string` | - | Additional CSS classes for individual logos |
| `containerClassName` | `string` | - | Additional CSS classes for main container |
| `onLogoClick` | `(logo: Logo) => void` | - | Click handler for logos |

### Logo Interface

```tsx
interface Logo {
  id: string;
  name: string;
  src: string;
  href?: string;      // Optional link URL
  width?: number;     // Optional max width
  height?: number;    // Optional max height
}
```

## Preset Components

### ShippingPartnerLogos

Pre-configured for shipping partners with default logos (DHL, FedEx, Pos Indonesia, JNE Express).

```tsx
import { ShippingPartnerLogos } from '@/components/organisms/CompanyLogos';

<ShippingPartnerLogos showTitle={true} />

// With custom logos
<ShippingPartnerLogos 
  logos={customShippingLogos}
  grayscale={false}
/>
```

### PaymentPartnerLogos

Pre-configured for payment methods with default logos (Visa, Mastercard, PayPal, Apple Pay, Google Pay).

```tsx
import { PaymentPartnerLogos } from '@/components/organisms/CompanyLogos';

<PaymentPartnerLogos showTitle={true} />
```

### BrandPartnerLogos

Pre-configured for brand partnerships with sample logos.

```tsx
import { BrandPartnerLogos } from '@/components/organisms/CompanyLogos';

<BrandPartnerLogos 
  showTitle={true}
  layout="grid"
  columns={4}
/>
```

## Examples

### Basic Logo Display

```tsx
const partnerLogos = [
  { id: 'aws', name: 'AWS', src: '/logos/aws.svg' },
  { id: 'google', name: 'Google Cloud', src: '/logos/google-cloud.svg' },
  { id: 'azure', name: 'Microsoft Azure', src: '/logos/azure.svg' },
];

<CompanyLogos logos={partnerLogos} />
```

### Interactive Logos with Links

```tsx
const socialLogos = [
  { 
    id: 'github', 
    name: 'GitHub', 
    src: '/logos/github.svg',
    href: 'https://github.com/yourcompany'
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    src: '/logos/linkedin.svg',
    href: 'https://linkedin.com/company/yourcompany'
  },
];

<CompanyLogos 
  logos={socialLogos}
  interactive={true}
  grayscale={false}
/>
```

### Grid Layout

```tsx
<CompanyLogos 
  logos={logos}
  layout="grid"
  columns={4}
  showTitle={true}
  title="Technology Stack"
/>
```

### Responsive Grid

```tsx
<CompanyLogos 
  logos={logos}
  layout="grid"
  columns="auto" // 2 cols on mobile, up to 6 on desktop
/>
```

### Different Sizes

```tsx
// Small logos with tight spacing
<CompanyLogos 
  logos={logos}
  logoSize="sm"
  size="sm"
/>

// Large logos with more spacing
<CompanyLogos 
  logos={logos}
  logoSize="lg"
  size="lg"
/>
```

### Custom Click Handler

```tsx
function LogoShowcase() {
  const handleLogoClick = (logo: Logo) => {
    console.log(`Clicked on ${logo.name}`);
    // Navigate to partner page, show modal, etc.
  };

  return (
    <CompanyLogos 
      logos={logos}
      interactive={true}
      onLogoClick={handleLogoClick}
    />
  );
}
```

### Footer Integration

```tsx
function Footer() {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto">
        <ShippingPartnerLogos 
          showTitle={true}
          title="Free Shipping Partners"
          className="mb-8"
        />
        <PaymentPartnerLogos 
          showTitle={true}
          title="Secure Payment Methods"
        />
      </div>
    </footer>
  );
}
```

### Hero Section Integration

```tsx
function HeroSection() {
  return (
    <section className="hero-section">
      <h1>Trusted by Industry Leaders</h1>
      <CompanyLogos 
        logos={techGiants}
        grayscale={false}
        size="lg"
        logoSize="lg"
        className="mt-8"
      />
    </section>
  );
}
```

### Dark Theme

```tsx
<div className="bg-gray-900 p-8">
  <CompanyLogos 
    logos={logos}
    showTitle={true}
    title="Our Partners"
    grayscale={false} // Better visibility on dark
    className="[&_h2]:text-white [&_p]:text-gray-300"
  />
</div>
```

### Loading State

```tsx
function LogosWithLoading() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnerLogos().then(data => {
      setLogos(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    const placeholders = Array(6).fill(null).map((_, i) => ({
      id: `placeholder-${i}`,
      name: 'Loading',
      src: '/placeholder-logo.svg',
    }));

    return (
      <div className="animate-pulse">
        <CompanyLogos logos={placeholders} grayscale={false} />
      </div>
    );
  }

  return <CompanyLogos logos={logos} />;
}
```

## Layout Options

### Horizontal (Default)
```tsx
<CompanyLogos layout="horizontal" alignment="center" />
```

### Vertical
```tsx
<CompanyLogos layout="vertical" alignment="center" />
```

### Grid
```tsx
<CompanyLogos 
  layout="grid" 
  columns={4} // or "auto" for responsive
/>
```

## Styling

### Grayscale Effect
- Default: Logos are grayscale, color on hover
- Disabled: Full color logos always visible

### Size Variants
- `sm`: Compact display with minimal spacing
- `md`: Default balanced size
- `lg`: Larger logos with generous spacing

### Alignment Options
- `start`: Align to the start
- `center`: Center alignment (default)
- `end`: Align to the end  
- `between`: Space between logos
- `around`: Space around logos
- `evenly`: Even spacing

### Custom Styling

```tsx
<CompanyLogos 
  logos={logos}
  containerClassName="max-w-4xl mx-auto"
  className="bg-gray-50 rounded-lg p-6"
  logoClassName="hover:scale-110 transition-transform"
/>
```

## Default Logo Sets

### Shipping Partners
- DHL
- FedEx  
- Pos Indonesia
- JNE Express

### Payment Methods
- Visa
- Mastercard
- PayPal
- Apple Pay
- Google Pay

### Brand Examples
- Nike
- Adidas
- Apple
- Samsung

## Accessibility

- Alt text for all logo images
- Aria labels for interactive logos
- Title attributes for hover information
- Keyboard navigation support for interactive mode
- Proper heading hierarchy when title is shown

## Best Practices

1. **Logo Quality**: Use SVG format for crisp display at all sizes
2. **Consistent Sizing**: Provide logos with similar aspect ratios
3. **Performance**: Optimize logo files, consider lazy loading for many logos
4. **Grayscale**: Enable for professional look, disable for brand recognition
5. **Responsive**: Use `columns="auto"` for responsive grid layouts
6. **Accessibility**: Always provide meaningful `name` for each logo
7. **Interactive**: Only enable if logos should be clickable
8. **Loading**: Show placeholder logos during data fetching
9. **Dark Mode**: Consider disabling grayscale on dark backgrounds
10. **Grouping**: Group related logos (payments, shipping, etc.) in separate sections