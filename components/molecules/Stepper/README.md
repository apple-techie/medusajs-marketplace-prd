# Stepper Component

A visual progress indicator component that guides users through multi-step processes. Perfect for checkouts, onboarding flows, form wizards, and order tracking. Supports both horizontal and vertical orientations with customizable steps and navigation.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Stepper, StepContent, StepNavigation, useStepper } from '@/components/molecules/Stepper';

// Basic stepper
<Stepper 
  steps={[
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Step 3' },
  ]}
  currentStep={1}
/>

// With descriptions (vertical)
<Stepper 
  steps={[
    { label: 'Account', description: 'Create your account' },
    { label: 'Profile', description: 'Set up your profile' },
    { label: 'Complete', description: 'Ready to go' },
  ]}
  currentStep={0}
  orientation="vertical"
/>

// Interactive with navigation
function StepperForm() {
  const { currentStep, nextStep, previousStep, goToStep } = useStepper(3);
  
  return (
    <div>
      <Stepper 
        steps={steps} 
        currentStep={currentStep}
        onStepClick={goToStep}
      />
      
      <StepContent step={0} currentStep={currentStep}>
        <p>Content for step 1</p>
      </StepContent>
      
      <StepNavigation
        currentStep={currentStep}
        totalSteps={3}
        onNext={nextStep}
        onPrevious={previousStep}
      />
    </div>
  );
}
```

## Component Props

### Stepper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepItem[]` | - | Array of step configurations (required) |
| `currentStep` | `number` | - | Current active step index (0-based) |
| `onStepClick` | `(index: number) => void` | - | Callback when step is clicked |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Step indicator size |
| `showConnector` | `boolean` | `true` | Show connecting lines |
| `clickable` | `boolean` | `true` | Allow clicking completed steps |
| `className` | `string` | - | Additional CSS classes |

### StepItem Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | `string` | Yes | Step label text |
| `description` | `string` | No | Additional description (shown in vertical mode) |
| `icon` | `ReactNode` | No | Custom icon for step |
| `content` | `ReactNode` | No | Step content (not used by Stepper) |

### StepContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `step` | `number` | - | Step index this content belongs to |
| `currentStep` | `number` | - | Current active step |
| `children` | `ReactNode` | - | Content to display |

### StepNavigation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentStep` | `number` | - | Current step index |
| `totalSteps` | `number` | - | Total number of steps |
| `onNext` | `() => void` | - | Next button callback |
| `onPrevious` | `() => void` | - | Previous button callback |
| `onComplete` | `() => void` | - | Complete button callback |
| `nextLabel` | `string` | `'Next'` | Next button text |
| `previousLabel` | `string` | `'Previous'` | Previous button text |
| `completeLabel` | `string` | `'Complete'` | Complete button text |
| `disableNavigation` | `boolean` | `false` | Disable all navigation |

## Examples

### E-commerce Use Cases

#### Checkout Process
```tsx
function CheckoutStepper() {
  const { currentStep, nextStep, previousStep, goToStep } = useStepper(4);
  
  const steps = [
    { 
      label: 'Cart',
      icon: <Icon icon="shoppingCart" size="sm" />
    },
    { 
      label: 'Shipping',
      icon: <Icon icon="truck" size="sm" />
    },
    { 
      label: 'Payment',
      icon: <Icon icon="creditCard" size="sm" />
    },
    { 
      label: 'Confirm',
      icon: <Icon icon="check" size="sm" />
    },
  ];
  
  return (
    <>
      <Stepper 
        steps={steps} 
        currentStep={currentStep}
        onStepClick={goToStep}
      />
      
      <StepContent step={0} currentStep={currentStep}>
        <CartReview />
      </StepContent>
      
      <StepContent step={1} currentStep={currentStep}>
        <ShippingForm />
      </StepContent>
      
      <StepContent step={2} currentStep={currentStep}>
        <PaymentForm />
      </StepContent>
      
      <StepContent step={3} currentStep={currentStep}>
        <OrderConfirmation />
      </StepContent>
      
      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={nextStep}
        onPrevious={previousStep}
        onComplete={placeOrder}
        completeLabel="Place Order"
      />
    </>
  );
}
```

#### Order Tracking
```tsx
function OrderTracking({ order }) {
  const getStepIndex = () => {
    switch (order.status) {
      case 'placed': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };
  
  const steps = [
    { 
      label: 'Order Placed',
      description: order.placedAt,
      icon: <Icon icon="check" size="sm" />
    },
    { 
      label: 'Processing',
      description: order.processedAt,
      icon: <Icon icon="package" size="sm" />
    },
    { 
      label: 'Shipped',
      description: order.shippedAt,
      icon: <Icon icon="truck" size="sm" />
    },
    { 
      label: 'Out for Delivery',
      description: order.outForDeliveryAt,
      icon: <Icon icon="mapPin" size="sm" />
    },
    { 
      label: 'Delivered',
      description: order.deliveredAt,
      icon: <Icon icon="home" size="sm" />
    },
  ];
  
  return (
    <Stepper 
      steps={steps} 
      currentStep={getStepIndex()}
      orientation="vertical"
      clickable={false}
    />
  );
}
```

#### Vendor Onboarding
```tsx
function VendorOnboarding() {
  const { currentStep, nextStep, previousStep } = useStepper(5);
  const [isValid, setIsValid] = useState(false);
  
  const steps = [
    { label: 'Business Info', description: 'Tell us about your business' },
    { label: 'Verification', description: 'Verify your identity' },
    { label: 'Banking', description: 'Payment information' },
    { label: 'Store Setup', description: 'Customize your store' },
    { label: 'Go Live', description: 'Launch your store' },
  ];
  
  return (
    <div>
      <Stepper 
        steps={steps} 
        currentStep={currentStep}
        orientation="vertical"
        clickable={false}
      />
      
      <div className="ml-16 mt-8">
        {currentStep === 0 && <BusinessInfoForm onValidate={setIsValid} />}
        {currentStep === 1 && <VerificationForm onValidate={setIsValid} />}
        {currentStep === 2 && <BankingForm onValidate={setIsValid} />}
        {currentStep === 3 && <StoreSetupForm onValidate={setIsValid} />}
        {currentStep === 4 && <LaunchReview onValidate={setIsValid} />}
        
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={nextStep}
          onPrevious={previousStep}
          onComplete={launchStore}
          disableNavigation={!isValid}
          completeLabel="Launch Store"
        />
      </div>
    </div>
  );
}
```

### Advanced Examples

#### Form Wizard with Validation
```tsx
function FormWizard() {
  const { currentStep, nextStep, previousStep, goToStep } = useStepper(3);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  
  const steps = [
    { label: 'Personal Info' },
    { label: 'Contact Details' },
    { label: 'Preferences' },
  ];
  
  const validateStep = () => {
    // Validation logic for current step
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };
  
  return (
    <>
      <Stepper 
        steps={steps} 
        currentStep={currentStep}
        onStepClick={(index) => {
          if (index < currentStep || validateStep()) {
            goToStep(index);
          }
        }}
      />
      
      {/* Step content with forms */}
      
      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onPrevious={previousStep}
        onComplete={submitForm}
      />
    </>
  );
}
```

#### Dynamic Steps
```tsx
function DynamicStepper({ workflow }) {
  const steps = workflow.steps.map(step => ({
    label: step.name,
    description: step.description,
    icon: getIconForStep(step.type),
  }));
  
  const { currentStep, nextStep, previousStep } = useStepper(steps.length);
  
  return (
    <Stepper 
      steps={steps} 
      currentStep={currentStep}
      orientation={steps.length > 4 ? 'vertical' : 'horizontal'}
    />
  );
}
```

#### Progress Indicator Only
```tsx
function ProgressSteps({ progress }) {
  const steps = [
    { label: 'Started' },
    { label: '25%' },
    { label: '50%' },
    { label: '75%' },
    { label: 'Complete' },
  ];
  
  const currentStep = Math.floor(progress / 25);
  
  return (
    <Stepper 
      steps={steps} 
      currentStep={currentStep}
      clickable={false}
      size="sm"
    />
  );
}
```

## Styling

### Sizes
```tsx
// Small - compact for limited space
<Stepper steps={steps} currentStep={0} size="sm" />

// Medium - default size
<Stepper steps={steps} currentStep={0} size="md" />

// Large - emphasized steps
<Stepper steps={steps} currentStep={0} size="lg" />
```

### Custom Styling
```tsx
// Custom colors via className
<Stepper 
  steps={steps} 
  currentStep={0}
  className="[&_.bg-primary-600]:bg-custom-color"
/>

// Custom step content
const stepsWithCustomIcons = [
  { 
    label: 'Upload',
    icon: <CustomUploadIcon className="w-4 h-4" />
  },
  { 
    label: 'Process',
    icon: <CustomProcessIcon className="w-4 h-4" />
  },
];
```

## useStepper Hook

The `useStepper` hook manages stepper state:

```tsx
const {
  currentStep,      // Current step index
  goToStep,         // Go to specific step
  nextStep,         // Go to next step
  previousStep,     // Go to previous step
  reset,            // Reset to first step
  isFirstStep,      // Boolean flag
  isLastStep,       // Boolean flag
} = useStepper(totalSteps, initialStep);
```

## Accessibility

- Proper ARIA attributes for step states
- Keyboard navigation support for clickable steps
- Clear visual indicators for step status
- Screen reader friendly labels and descriptions
- Focus management in navigation

## Best Practices

1. **Clear labels** - Use concise, action-oriented step names
2. **Visual feedback** - Show clear active, completed, and upcoming states
3. **Allow navigation** - Let users go back to completed steps when appropriate
4. **Validate progressively** - Validate each step before allowing progression
5. **Show progress** - Display step numbers or percentages
6. **Mobile friendly** - Consider vertical orientation on small screens
7. **Save state** - Persist progress for long processes

## Common Patterns

### With Router Integration
```tsx
function RoutedStepper() {
  const router = useRouter();
  const stepFromRoute = parseInt(router.query.step) || 0;
  
  const handleStepChange = (step: number) => {
    router.push(`?step=${step}`);
  };
  
  return (
    <Stepper 
      steps={steps} 
      currentStep={stepFromRoute}
      onStepClick={handleStepChange}
    />
  );
}
```

### With Form State Persistence
```tsx
function PersistentFormStepper() {
  const { currentStep, nextStep, previousStep } = useStepper(4);
  
  // Save form data to localStorage on each step
  const saveStepData = (data: any) => {
    localStorage.setItem(`step_${currentStep}`, JSON.stringify(data));
  };
  
  // Load saved data when returning to step
  const loadStepData = () => {
    const saved = localStorage.getItem(`step_${currentStep}`);
    return saved ? JSON.parse(saved) : {};
  };
  
  return (
    // Stepper implementation
  );
}
```