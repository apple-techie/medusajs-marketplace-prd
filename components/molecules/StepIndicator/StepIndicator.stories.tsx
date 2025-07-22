import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { StepIndicator, Step } from './StepIndicator';

const meta = {
  title: 'Molecules/StepIndicator',
  component: StepIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'simple', 'dotted', 'numbered'],
      description: 'Visual variant',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    clickable: {
      control: 'boolean',
      description: 'Allow step navigation',
    },
    showDescription: {
      control: 'boolean',
      description: 'Show step descriptions',
    },
    showConnector: {
      control: 'boolean',
      description: 'Show connectors between steps',
    },
    progressBar: {
      control: 'boolean',
      description: 'Show progress bar',
    },
  },
} satisfies Meta<typeof StepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic checkout flow
const checkoutSteps: Step[] = [
  { id: 'cart', label: 'Cart' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

// Basic step indicator
export const Default: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 1,
  },
};

// With descriptions
export const WithDescriptions: Story = {
  args: {
    steps: [
      { id: 'cart', label: 'Shopping Cart', description: 'Review your items' },
      { id: 'shipping', label: 'Shipping Info', description: 'Enter delivery address' },
      { id: 'payment', label: 'Payment Method', description: 'Add payment details' },
      { id: 'review', label: 'Review Order', description: 'Confirm and submit' },
    ],
    currentStep: 'shipping',
    showDescription: true,
  },
};

// With icons
export const WithIcons: Story = {
  args: {
    steps: [
      { id: 'cart', label: 'Cart', icon: 'shopping-cart' },
      { id: 'shipping', label: 'Shipping', icon: 'truck' },
      { id: 'payment', label: 'Payment', icon: 'credit-card' },
      { id: 'review', label: 'Review', icon: 'check-circle' },
    ],
    currentStep: 2,
  },
};

// Numbered variant
export const Numbered: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 1,
    variant: 'numbered',
  },
};

// Simple variant
export const Simple: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 2,
    variant: 'simple',
  },
};

// Dotted variant
export const Dotted: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 1,
    variant: 'dotted',
  },
};

// Vertical orientation
export const Vertical: Story = {
  args: {
    steps: [
      { id: 'account', label: 'Create Account', description: 'Sign up for an account' },
      { id: 'profile', label: 'Complete Profile', description: 'Add your information' },
      { id: 'preferences', label: 'Set Preferences', description: 'Customize your experience' },
      { id: 'confirm', label: 'Confirm Email', description: 'Verify your email address' },
    ],
    currentStep: 2,
    orientation: 'vertical',
    showDescription: true,
  },
};

// With progress bar
export const WithProgressBar: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 2,
    progressBar: true,
  },
};

// Custom progress value
export const CustomProgress: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 2,
    progressBar: true,
    progressValue: 75,
  },
};

// With error state
export const WithError: Story = {
  args: {
    steps: [
      { id: 'cart', label: 'Cart', status: 'completed' },
      { id: 'shipping', label: 'Shipping', status: 'completed' },
      { id: 'payment', label: 'Payment', status: 'error' },
      { id: 'review', label: 'Review', status: 'upcoming' },
    ],
  },
};

// All completed
export const AllCompleted: Story = {
  args: {
    steps: checkoutSteps.map(step => ({ ...step, status: 'completed' as const })),
  },
};

// Different sizes
export const SmallSize: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 1,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 2,
    size: 'lg',
  },
};

// Non-clickable
export const NonClickable: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 1,
    clickable: false,
  },
};

// With disabled steps
export const WithDisabledSteps: Story = {
  args: {
    steps: [
      { id: 'cart', label: 'Cart' },
      { id: 'shipping', label: 'Shipping' },
      { id: 'payment', label: 'Payment', disabled: true },
      { id: 'review', label: 'Review', disabled: true },
    ],
    currentStep: 1,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    
    const steps: Step[] = [
      { id: 'cart', label: 'Cart', icon: 'shopping-cart' },
      { id: 'shipping', label: 'Shipping', icon: 'truck' },
      { id: 'payment', label: 'Payment', icon: 'credit-card' },
      { id: 'review', label: 'Review', icon: 'check-circle' },
    ].map((step, index) => ({
      ...step,
      onClick: () => setCurrentStep(index),
    }));

    return (
      <div className="space-y-8 w-full max-w-2xl">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          progressBar
        />
        
        <div className="text-center p-8 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            {steps[currentStep].label}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Click on any step to navigate
          </p>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="px-4 py-2 bg-primary-600 text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};

// Onboarding flow
export const OnboardingFlow: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    
    const steps: Step[] = [
      {
        id: 'welcome',
        label: 'Welcome',
        description: 'Get started with our platform',
        icon: 'sparkles',
      },
      {
        id: 'connect',
        label: 'Connect Accounts',
        description: 'Link your social accounts',
        icon: 'link',
      },
      {
        id: 'customize',
        label: 'Customize',
        description: 'Set your preferences',
        icon: 'sliders',
      },
      {
        id: 'complete',
        label: 'All Set!',
        description: 'Start using the platform',
        icon: 'rocket',
      },
    ];

    return (
      <div className="w-full max-w-3xl">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          showDescription
          size="lg"
          progressBar
        />
        
        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentStep((currentStep + 1) % steps.length)}
            className="px-6 py-3 bg-primary-600 text-white rounded-md"
          >
            Continue to Next Step
          </button>
        </div>
      </div>
    );
  },
};

// Order status tracking
export const OrderTracking: Story = {
  render: () => {
    const steps: Step[] = [
      {
        id: 'placed',
        label: 'Order Placed',
        description: 'Dec 15, 2023',
        icon: 'check-circle',
        status: 'completed',
      },
      {
        id: 'confirmed',
        label: 'Confirmed',
        description: 'Dec 15, 2023',
        icon: 'clipboard-check',
        status: 'completed',
      },
      {
        id: 'shipped',
        label: 'Shipped',
        description: 'Dec 16, 2023',
        icon: 'truck',
        status: 'completed',
      },
      {
        id: 'delivery',
        label: 'Out for Delivery',
        description: 'Expected today',
        icon: 'package',
        status: 'current',
      },
      {
        id: 'delivered',
        label: 'Delivered',
        description: 'Pending',
        icon: 'home',
        status: 'upcoming',
      },
    ];

    return (
      <StepIndicator
        steps={steps}
        showDescription
        clickable={false}
      />
    );
  },
};

// Form wizard
export const FormWizard: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    
    const steps: Step[] = [
      { id: 'personal', label: 'Personal Info' },
      { id: 'address', label: 'Address' },
      { id: 'preferences', label: 'Preferences' },
      { id: 'review', label: 'Review' },
    ];
    
    const handleNext = () => {
      if (currentStep < steps.length - 1) {
        setCompletedSteps([...completedSteps, steps[currentStep].id]);
        setCurrentStep(currentStep + 1);
      }
    };

    return (
      <div className="w-full max-w-2xl space-y-8">
        <StepIndicator
          steps={steps.map(step => ({
            ...step,
            status: completedSteps.includes(step.id) ? 'completed' : 
                   steps[currentStep].id === step.id ? 'current' : 'upcoming',
          }))}
          variant="simple"
        />
        
        <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">
            {steps[currentStep].label}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Fill in your {steps[currentStep].label.toLowerCase()} below.
          </p>
          
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="px-6 py-2 bg-primary-600 text-white rounded-md disabled:opacity-50"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next Step'}
          </button>
        </div>
      </div>
    );
  },
};

// Mobile collapsed
export const MobileCollapsed: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 2,
    mobileCollapse: true,
    mobileShowCurrent: true,
  },
};

// Without connectors
export const WithoutConnectors: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 1,
    showConnector: false,
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded-lg">
      <StepIndicator
        steps={[
          { id: 'start', label: 'Start', icon: 'play' },
          { id: 'process', label: 'Process', icon: 'cpu' },
          { id: 'review', label: 'Review', icon: 'eye' },
          { id: 'complete', label: 'Complete', icon: 'check' },
        ]}
        currentStep={2}
        progressBar
      />
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};