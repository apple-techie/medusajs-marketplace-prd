# Footer Component

A comprehensive footer component designed for e-commerce and marketplace applications. Features multiple sections for navigation, app downloads, newsletter signup, social links, and company information. Fully responsive and customizable to fit various business needs.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Footer } from '@/components/organisms/Footer';

// Basic usage
<Footer 
  companyName="Neo Mart"
  tagline="Your trusted marketplace for all your needs."
/>

// With newsletter and social links
<Footer 
  companyName="Neo Mart"
  showNewsletter={true}
  socialLinks={{
    facebook: 'https://facebook.com/neomart',
    twitter: 'https://twitter.com/neomart',
    instagram: 'https://instagram.com/neomart',
  }}
  onNewsletterSubmit={async (email) => {
    await subscribeToNewsletter(email);
  }}
/>
```

## Component Props

### FooterProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `companyName` | `string` | `'Neo Mart'` | Company or brand name |
| `tagline` | `string` | Default app download message | Company tagline or description |
| `sections` | `FooterSection[]` | Default sections (Support, Company, Legal) | Navigation sections |
| `appStoreLinks` | `AppStoreLink[]` | Google Play & App Store | App download links |
| `qrCodeUrl` | `string` | - | QR code image URL for app download |
| `showNewsletter` | `boolean` | `false` | Show newsletter signup section |
| `newsletterTitle` | `string` | `'Subscribe to our Newsletter'` | Newsletter section title |
| `newsletterDescription` | `string` | Default description | Newsletter section description |
| `onNewsletterSubmit` | `(email: string) => void \| Promise<void>` | No-op | Newsletter submission handler |
| `className` | `string` | - | Additional CSS classes |
| `copyrightText` | `string` | Auto-generated with current year | Copyright notice |
| `socialLinks` | `object` | - | Social media links |

### FooterSection Interface

```tsx
interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}
```

### AppStoreLink Interface

```tsx
interface AppStoreLink {
  type: 'google' | 'apple';
  url: string;
}
```

### SocialLinks Interface

```tsx
interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}
```

## Examples

### E-commerce Marketplace Footer

```tsx
function MarketplaceFooter() {
  const marketplaceSections = [
    {
      title: 'For Buyers',
      links: [
        { label: 'How to Buy', href: '/how-to-buy' },
        { label: 'Buyer Protection', href: '/buyer-protection' },
        { label: 'Shipping Info', href: '/shipping' },
        { label: 'Returns & Refunds', href: '/returns' },
      ],
    },
    {
      title: 'For Sellers',
      links: [
        { label: 'Start Selling', href: '/start-selling' },
        { label: 'Seller Center', href: '/seller-center' },
        { label: 'Fees & Pricing', href: '/fees' },
        { label: 'Seller Support', href: '/seller-support' },
      ],
    },
    {
      title: 'Categories',
      links: [
        { label: 'Electronics', href: '/category/electronics' },
        { label: 'Fashion', href: '/category/fashion' },
        { label: 'Home & Garden', href: '/category/home' },
        { label: 'View All', href: '/categories' },
      ],
    },
  ];

  return (
    <Footer
      companyName="MarketPlace Pro"
      tagline="Connect buyers and sellers worldwide"
      sections={marketplaceSections}
      showNewsletter={true}
      socialLinks={{
        facebook: 'https://facebook.com/marketplace',
        instagram: 'https://instagram.com/marketplace',
        twitter: 'https://twitter.com/marketplace',
      }}
    />
  );
}
```

### Minimal Footer

```tsx
function MinimalFooter() {
  return (
    <Footer
      companyName="Simple Store"
      sections={[
        {
          title: 'Company',
          links: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { label: 'Terms', href: '/terms' },
            { label: 'Privacy', href: '/privacy' },
          ],
        },
      ]}
      appStoreLinks={[]} // Hide app download section
    />
  );
}
```

### With Newsletter Integration

```tsx
function NewsletterFooter() {
  const handleNewsletterSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) throw new Error('Subscription failed');
      
      // Show success message
      toast.success('Successfully subscribed!');
    } catch (error) {
      // Handle error
      toast.error('Failed to subscribe. Please try again.');
      throw error; // Re-throw to trigger error state in component
    }
  };

  return (
    <Footer
      companyName="Newsletter Store"
      showNewsletter={true}
      newsletterTitle="Get 10% Off"
      newsletterDescription="Subscribe and receive exclusive offers!"
      onNewsletterSubmit={handleNewsletterSubmit}
    />
  );
}
```

### With App Download QR Code

```tsx
function AppPromoFooter() {
  return (
    <Footer
      companyName="Mobile First Store"
      qrCodeUrl="/images/app-qr-code.png"
      appStoreLinks={[
        { 
          type: 'google', 
          url: 'https://play.google.com/store/apps/details?id=com.store' 
        },
        { 
          type: 'apple', 
          url: 'https://apps.apple.com/app/store/id123456' 
        },
      ]}
    />
  );
}
```

### Dark Theme Footer

```tsx
function DarkFooter() {
  return (
    <div className="dark">
      <Footer
        companyName="Dark Store"
        className="bg-gray-900 text-white [&_.text-neutral-600]:text-gray-400"
        socialLinks={{
          facebook: '#',
          twitter: '#',
          instagram: '#',
        }}
      />
    </div>
  );
}
```

### Custom Copyright

```tsx
function CustomCopyrightFooter() {
  return (
    <Footer
      companyName="Legal Store"
      copyrightText="© 2024 Legal Store LLC. All rights reserved. | Terms | Privacy | Cookies"
    />
  );
}
```

## Features

### Sections
- **Support**: Help center, shipping info, order tracking
- **Company**: About, careers, press, blog
- **Legal**: Terms, privacy policy, cookie policy
- **Custom**: Add any custom sections as needed

### App Download
- Google Play and App Store badges
- Optional QR code for quick scanning
- Customizable download messaging

### Newsletter
- Email subscription form
- Success/error state handling
- Loading states during submission
- Email validation

### Social Media
- Icon links for major platforms
- Proper external link attributes
- Accessible with screen readers

### Responsive Design
- Mobile-first approach
- Stacked layout on small screens
- Grid layout on larger screens
- Optimized spacing for all devices

## Styling

### Layout Structure

```tsx
<footer>
  <container>
    {/* Main content area */}
    <div className="grid">
      {/* Company info + App download */}
      <div className="lg:col-span-4">...</div>
      
      {/* Navigation sections */}
      <div className="lg:col-span-5">...</div>
      
      {/* Newsletter (optional) */}
      <div className="lg:col-span-3">...</div>
    </div>
    
    {/* Bottom bar */}
    <div className="border-t">
      {/* Copyright */}
      {/* Social links */}
    </div>
  </container>
</footer>
```

### Customization

```css
/* Custom footer styles */
.custom-footer {
  /* Override background */
  @apply bg-brand-900;
  
  /* Override text colors */
  @apply text-brand-100;
  
  /* Override link hover */
  & a:hover {
    @apply text-brand-300;
  }
}
```

## Accessibility

- Semantic HTML structure with `<footer>` element
- Proper heading hierarchy (h2 for company name, h3 for sections)
- Accessible form with email input type
- External links marked with proper attributes
- Social media links include aria-labels
- Keyboard navigation support
- Focus indicators on interactive elements

## Best Practices

1. **Content Organization**: Group related links logically
2. **Link Limits**: Keep sections to 5-7 links maximum
3. **Mobile First**: Test on mobile devices first
4. **Newsletter**: Always handle errors gracefully
5. **App Links**: Use actual store URLs when available
6. **Social Links**: Only show platforms you're active on
7. **Copyright**: Update year automatically
8. **Performance**: Lazy load QR code image
9. **SEO**: Use descriptive link text
10. **Legal**: Ensure all required legal links are present