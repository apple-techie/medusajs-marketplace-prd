# StepIndicator Component

A versatile step indicator component for multi-step processes like checkout flows, onboarding, form wizards, and progress tracking. Supports multiple variants, orientations, and interactive navigation.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { StepIndicator } from '@/components/molecules/StepIndicator';

// Basic usage
<StepIndicator
  steps={[
    { id: 'cart', label: 'Cart' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' }
  ]}
  currentStep={1}
/>

// With descriptions and icons
<StepIndicator
  steps={[
    { 
      id: 'cart', 
      label: 'Shopping Cart',
      description: 'Review your items',
      icon: 'shopping-cart'
    },
    { 
      id: 'shipping', 
      label: 'Shipping Info',
      description: 'Enter delivery address',
      icon: 'truck'
    }
  ]}
  currentStep="shipping"
  showDescription
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `Step[]` | - | **Required**. Array of step objects |
| `currentStep` | `number \| string` | - | Current step index or id |
| `variant` | `'default' \| 'simple' \| 'dotted' \| 'numbered'` | `'default'` | Visual variant |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout orientation |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `clickable` | `boolean` | `true` | Allow step navigation |
| `showDescription` | `boolean` | `true` | Show step descriptions |
| `showStepNumber` | `boolean` | `true` | Show step numbers (numbered variant) |
| `showConnector` | `boolean` | `true` | Show connectors between steps |
| `progressBar` | `boolean` | `false` | Show progress bar |
| `progressValue` | `number` | - | Custom progress percentage |
| `completedLabel` | `string` | `'Completed'` | Screen reader label for completed |
| `currentLabel` | `string` | `'Current step'` | Screen reader label for current |
| `upcomingLabel` | `string` | `'Upcoming'` | Screen reader label for upcoming |
| `errorLabel` | `string` | `'Error'` | Screen reader label for error |
| `className` | `string` | - | Container CSS classes |
| `stepClassName` | `string` | - | Step indicator CSS classes |
| `connectorClassName` | `string` | - | Connector CSS classes |
| `labelClassName` | `string` | - | Label CSS classes |
| `mobileCollapse` | `boolean` | `false` | Collapse on mobile |
| `mobileShowCurrent` | `boolean` | `true` | Show current step on mobile |
| `aria-label` | `string` | - | Accessibility label |

### Step Type

```tsx
interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  status?: 'completed' | 'current' | 'upcoming' | 'error';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}
```

## Variants

### Default
Standard step indicator with circles and labels.

```tsx
<StepIndicator
  steps={steps}
  currentStep={1}
  variant="default"
/>
```

### Simple
Outlined circles with minimal styling.

```tsx
<StepIndicator
  steps={steps}
  currentStep={2}
  variant="simple"
/>
```

### Numbered
Shows step numbers instead of icons.

```tsx
<StepIndicator
  steps={steps}
  currentStep={0}
  variant="numbered"
/>
```

### Dotted
Minimal dots without labels (good for many steps).

```tsx
<StepIndicator
  steps={steps}
  currentStep={3}
  variant="dotted"
/>
```

## Orientations

### Horizontal (Default)
```tsx
<StepIndicator
  steps={steps}
  currentStep={1}
  orientation="horizontal"
/>
```

### Vertical
```tsx
<StepIndicator
  steps={steps}
  currentStep={2}
  orientation="vertical"
  showDescription
/>
```

## Common Patterns

### Checkout Flow

```tsx
const checkoutSteps = [
  { id: 'cart', label: 'Cart', icon: 'shopping-cart' },
  { id: 'shipping', label: 'Shipping', icon: 'truck' },
  { id: 'payment', label: 'Payment', icon: 'credit-card' },
  { id: 'review', label: 'Review', icon: 'check-circle' }
];

<StepIndicator
  steps={checkoutSteps}
  currentStep="payment"
  progressBar
/>
```

### Onboarding Process

```tsx
const onboardingSteps = [
  {
    id: 'welcome',
    label: 'Welcome',
    description: 'Get started with our platform',
    icon: 'sparkles'
  },
  {
    id: 'profile',
    label: 'Create Profile',
    description: 'Tell us about yourself',
    icon: 'user'
  },
  {
    id: 'preferences',
    label: 'Set Preferences',
    description: 'Customize your experience',
    icon: 'sliders'
  }
];

<StepIndicator
  steps={onboardingSteps}
  currentStep={0}
  showDescription
  size="lg"
/>
```

### Order Tracking

```tsx
const trackingSteps = [
  {
    id: 'placed',
    label: 'Order Placed',
    description: 'Dec 15, 2023',
    status: 'completed'
  },
  {
    id: 'shipped',
    label: 'Shipped',
    description: 'Dec 16, 2023',
    status: 'completed'
  },
  {
    id: 'delivery',
    label: 'Out for Delivery',
    description: 'Expected today',
    status: 'current'
  },
  {
    id: 'delivered',
    label: 'Delivered',
    status: 'upcoming'
  }
];

<StepIndicator
  steps={trackingSteps}
  showDescription
  clickable={false}
/>
```

## Interactive Navigation

### With Click Handlers

```tsx
const [currentStep, setCurrentStep] = useState(0);

const steps = [
  { id: 'step1', label: 'Step 1', onClick: () => setCurrentStep(0) },
  { id: 'step2', label: 'Step 2', onClick: () => setCurrentStep(1) },
  { id: 'step3', label: 'Step 3', onClick: () => setCurrentStep(2) }
];

<StepIndicator
  steps={steps}
  currentStep={currentStep}
/>
```

### With URL Navigation

```tsx
const steps = [
  { id: 'cart', label: 'Cart', href: '/checkout/cart' },
  { id: 'shipping', label: 'Shipping', href: '/checkout/shipping' },
  { id: 'payment', label: 'Payment', href: '/checkout/payment' }
];

<StepIndicator
  steps={steps}
  currentStep={currentPath}
/>
```

### Disabled Steps

```tsx
<StepIndicator
  steps={[
    { id: 'step1', label: 'Step 1' },
    { id: 'step2', label: 'Step 2' },
    { id: 'step3', label: 'Step 3', disabled: true },
    { id: 'step4', label: 'Step 4', disabled: true }
  ]}
  currentStep={1}
/>
```

## Progress Bar

```tsx
// Automatic progress calculation
<StepIndicator
  steps={steps}
  currentStep={2}
  progressBar
/>

// Custom progress value
<StepIndicator
  steps={steps}
  currentStep={1}
  progressBar
  progressValue={65}
/>
```

## Error States

```tsx
const stepsWithError = [
  { id: 'info', label: 'Information', status: 'completed' },
  { id: 'payment', label: 'Payment', status: 'error' },
  { id: 'confirm', label: 'Confirm', status: 'upcoming' }
];

<StepIndicator
  steps={stepsWithError}
/>
```

## Form Wizard Example

```tsx
function FormWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  const steps = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'address', label: 'Address' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'review', label: 'Review' }
  ];
  
  const handleNext = () => {
    setCompletedSteps([...completedSteps, steps[currentStep].id]);
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };
  
  return (
    <>
      <StepIndicator
        steps={steps.map(step => ({
          ...step,
          status: completedSteps.includes(step.id) ? 'completed' : 
                 steps[currentStep].id === step.id ? 'current' : 'upcoming',
          onClick: () => {
            const index = steps.findIndex(s => s.id === step.id);
            if (index <= completedSteps.length) {
              setCurrentStep(index);
            }
          }
        }))}
      />
      
      <div className="mt-8">
        {/* Form content */}
        
        <div className="flex justify-between mt-6">
          <button onClick={handlePrevious} disabled={currentStep === 0}>
            Previous
          </button>
          <button onClick={handleNext} disabled={currentStep === steps.length - 1}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}
```

## Mobile Optimization

```tsx
// Collapse to show only current step on mobile
<StepIndicator
  steps={steps}
  currentStep={2}
  mobileCollapse
  mobileShowCurrent
/>
```

## Accessibility

- Semantic HTML with proper ARIA attributes
- Screen reader labels for all states
- Keyboard navigation support
- Focus indicators
- Current step announcement
- Progress percentage for screen readers

## Best Practices

1. **Clear Labels**: Use concise, descriptive step labels
2. **Icons**: Choose intuitive icons that represent each step
3. **Progress**: Show progress bar for long processes
4. **Error Handling**: Clearly indicate error states
5. **Mobile**: Use collapsed view for mobile devices
6. **Descriptions**: Add descriptions for complex workflows
7. **Navigation**: Allow backward navigation when appropriate
8. **Validation**: Disable forward navigation until step is complete