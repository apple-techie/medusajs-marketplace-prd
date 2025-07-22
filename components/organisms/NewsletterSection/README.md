# NewsletterSection Component

A versatile newsletter signup section with multiple variants, form validation, and customization options. Includes email collection, preferences, and various visual styles.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { NewsletterSection, SimpleNewsletter } from '@/components/organisms/NewsletterSection';

// Basic newsletter section
<NewsletterSection
  onSubmit={async (data) => {
    await subscribeToNewsletter(data);
  }}
/>

// With preferences and name field
<NewsletterSection
  showNameField
  showPreferences
  preferences={[
    { label: 'Daily Deals', value: 'deals' },
    { label: 'New Products', value: 'products' }
  ]}
  onSubmit={handleSubmit}
/>

// Simple inline newsletter
<SimpleNewsletter
  title="Get updates"
  onSubmit={handleEmailSubmit}
/>
```

## Props

### NewsletterSection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Stay in the Loop'` | Section title |
| `subtitle` | `string` | - | Optional subtitle |
| `description` | `string` | Default message | Section description |
| `variant` | `'default' \| 'minimal' \| 'centered' \| 'split' \| 'inline'` | `'default'` | Visual variant |
| `layout` | `'stacked' \| 'horizontal'` | `'stacked'` | Form layout |
| `showNameField` | `boolean` | `false` | Show name input |
| `showPreferences` | `boolean` | `false` | Show preference checkboxes |
| `preferences` | `Array<{label, value}>` | `[]` | Preference options |
| `theme` | `'light' \| 'dark' \| 'gradient' \| 'custom'` | `'light'` | Color theme |
| `backgroundImage` | `string` | - | Background image URL |
| `backgroundGradient` | `string` | - | CSS gradient |
| `showIcon` | `boolean` | `true` | Show icon |
| `icon` | `string` | `'mail'` | Icon name |
| `benefits` | `string[]` | Default list | Benefits list |
| `showBenefits` | `boolean` | `true` | Show benefits |
| `subscriberCount` | `number` | - | Subscriber count |
| `showSubscriberCount` | `boolean` | `true` | Show count |
| `testimonial` | `object` | - | Customer testimonial |
| `privacyText` | `string` | Default text | Privacy message |
| `privacyLink` | `string` | - | Privacy policy URL |
| `termsLink` | `string` | - | Terms of service URL |
| `placeholder` | `string` | `'Enter your email'` | Email placeholder |
| `buttonText` | `string` | `'Subscribe'` | Submit button text |
| `successMessage` | `string` | Default message | Success message |
| `errorMessage` | `string` | Default message | Error message |
| `loading` | `boolean` | `false` | Loading state |
| `onSubmit` | `function` | - | Submit handler |
| `className` | `string` | - | Section CSS classes |
| `contentClassName` | `string` | - | Content CSS classes |
| `formClassName` | `string` | - | Form CSS classes |
| `aria-label` | `string` | - | Accessibility label |

### SimpleNewsletter

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Subscribe to our newsletter'` | Title text |
| `placeholder` | `string` | `'Enter your email'` | Email placeholder |
| `buttonText` | `string` | `'Subscribe'` | Button text |
| `onSubmit` | `(email: string) => void` | - | Submit handler |
| `className` | `string` | - | CSS classes |

## Variants

### Default
Standard newsletter section with stacked layout and all features.

```tsx
<NewsletterSection variant="default" />
```

### Minimal
Compact version without icon or extra features.

```tsx
<NewsletterSection variant="minimal" />
```

### Centered
Center-aligned content ideal for landing pages.

```tsx
<NewsletterSection variant="centered" />
```

### Split
Two-column layout with content and form separated.

```tsx
<NewsletterSection variant="split" />
```

### Inline
Horizontal single-line layout for headers/footers.

```tsx
<NewsletterSection variant="inline" />
```

## Themes

### Light Theme (Default)
```tsx
<NewsletterSection theme="light" />
```

### Dark Theme
```tsx
<NewsletterSection theme="dark" />
```

### Gradient Theme
```tsx
<NewsletterSection theme="gradient" />
```

### Custom Theme
```tsx
<NewsletterSection 
  theme="custom"
  backgroundImage="background.jpg"
/>
```

## Form Fields

### Email Only (Default)
```tsx
<NewsletterSection />
```

### With Name Field
```tsx
<NewsletterSection showNameField />
```

### With Preferences
```tsx
<NewsletterSection
  showPreferences
  preferences={[
    { label: 'Daily Newsletter', value: 'daily' },
    { label: 'Weekly Digest', value: 'weekly' },
    { label: 'Special Offers', value: 'offers' }
  ]}
/>
```

## Features

### Benefits List
```tsx
<NewsletterSection
  benefits={[
    '20% off first order',
    'Exclusive member deals',
    'Early access to sales',
    'Free shipping'
  ]}
/>
```

### Subscriber Count
```tsx
<NewsletterSection
  subscriberCount={50000}
  showSubscriberCount
/>
```

### Testimonial
```tsx
<NewsletterSection
  testimonial={{
    text: 'Best newsletter ever!',
    author: 'Jane Doe',
    role: 'Happy Customer',
    avatar: 'avatar.jpg'
  }}
/>
```

### Privacy Links
```tsx
<NewsletterSection
  privacyText="We respect your privacy"
  privacyLink="/privacy-policy"
  termsLink="/terms-of-service"
/>
```

## Form Validation

The component includes built-in email validation:

```tsx
<NewsletterSection
  onSubmit={async (data) => {
    // data.email is guaranteed to be valid
    // data.name is included if showNameField is true
    // data.preferences is included if showPreferences is true
  }}
/>
```

## Loading & Error States

```tsx
// Loading state
<NewsletterSection loading />

// Custom messages
<NewsletterSection
  successMessage="Welcome! Check your inbox."
  errorMessage="Oops! Please try again."
/>
```

## Examples

### E-commerce Footer
```tsx
<NewsletterSection
  variant="default"
  title="Get Exclusive Deals"
  description="Join our newsletter for special offers"
  showNameField
  benefits={[
    '15% off welcome coupon',
    'Free shipping on orders $50+',
    'Early access to sales'
  ]}
  subscriberCount={25000}
/>
```

### Landing Page Hero
```tsx
<NewsletterSection
  variant="centered"
  theme="gradient"
  title="Launch Announcement"
  subtitle="Be the First to Know"
  description="Get notified when we launch"
  icon="rocket"
  buttonText="Notify Me"
/>
```

### Blog Sidebar
```tsx
<NewsletterSection
  variant="minimal"
  title="Weekly Articles"
  showPreferences
  preferences={[
    { label: 'Tech News', value: 'tech' },
    { label: 'Tutorials', value: 'tutorials' },
    { label: 'Industry Updates', value: 'industry' }
  ]}
/>
```

### Header Bar
```tsx
<SimpleNewsletter
  title="Get 10% off"
  buttonText="Sign Up"
/>
```

## Accessibility

- Email input validation with ARIA attributes
- Error messages linked to inputs
- Keyboard navigation support
- Screen reader friendly labels
- Focus management
- Proper heading hierarchy

## Best Practices

1. **Clear Value Proposition**: Explain what subscribers will receive
2. **Minimal Fields**: Only ask for necessary information
3. **Social Proof**: Show subscriber count or testimonials
4. **Privacy Assurance**: Include privacy text and links
5. **Mobile Optimization**: Test on mobile devices
6. **Loading States**: Show feedback during submission
7. **Success Confirmation**: Clear success messages
8. **Easy Unsubscribe**: Mention in privacy text
9. **Preference Options**: Let users choose content types
10. **A/B Testing**: Try different variants and messages