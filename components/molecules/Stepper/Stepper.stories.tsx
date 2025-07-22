import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Stepper, StepContent, StepNavigation, useStepper } from './Stepper';
import { Icon } from '../../atoms/Icon/Icon';

const meta = {
  title: 'Molecules/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    currentStep: {
      control: 'number',
      min: 0,
    },
    showConnector: {
      control: 'boolean',
    },
    clickable: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example
export const Default: Story = {
  args: {
    steps: [
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3' },
      { label: 'Step 4' },
    ],
    currentStep: 1,
  },
};

// With descriptions
export const WithDescriptions: Story = {
  args: {
    steps: [
      { label: 'Account Details', description: 'Enter your basic information' },
      { label: 'Shipping Address', description: 'Where should we deliver?' },
      { label: 'Payment Method', description: 'How would you like to pay?' },
      { label: 'Review Order', description: 'Confirm your purchase' },
    ],
    currentStep: 1,
    orientation: 'vertical',
  },
};

// With icons
export const WithIcons: Story = {
  args: {
    steps: [
      { label: 'Cart', icon: <Icon icon="shoppingCart" size="sm" /> },
      { label: 'Shipping', icon: <Icon icon="truck" size="sm" /> },
      { label: 'Payment', icon: <Icon icon="creditCard" size="sm" /> },
      { label: 'Complete', icon: <Icon icon="check" size="sm" /> },
    ],
    currentStep: 2,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const { currentStep, nextStep, previousStep, goToStep } = useStepper(4);
    
    const steps = [
      { label: 'Personal Info' },
      { label: 'Address' },
      { label: 'Payment' },
      { label: 'Confirmation' },
    ];
    
    return (
      <div>
        <Stepper 
          steps={steps} 
          currentStep={currentStep}
          onStepClick={goToStep}
        />
        
        <div className="mt-8 p-6 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">
            Step {currentStep + 1}: {steps[currentStep].label}
          </h3>
          <p className="text-neutral-600">
            This is the content for {steps[currentStep].label}.
          </p>
        </div>
        
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={nextStep}
          onPrevious={previousStep}
          onComplete={() => alert('Process completed!')}
        />
      </div>
    );
  },
};

// E-commerce checkout
export const CheckoutProcess: Story = {
  render: () => {
    const { currentStep, nextStep, previousStep, goToStep } = useStepper(4);
    
    const steps = [
      { 
        label: 'Cart Review',
        description: 'Review your items',
        icon: <Icon icon="shoppingCart" size="sm" />
      },
      { 
        label: 'Shipping Info',
        description: 'Enter delivery details',
        icon: <Icon icon="truck" size="sm" />
      },
      { 
        label: 'Payment',
        description: 'Select payment method',
        icon: <Icon icon="creditCard" size="sm" />
      },
      { 
        label: 'Confirmation',
        description: 'Review and confirm',
        icon: <Icon icon="check" size="sm" />
      },
    ];
    
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8">Checkout</h2>
        
        <Stepper 
          steps={steps} 
          currentStep={currentStep}
          onStepClick={goToStep}
        />
        
        <StepContent step={0} currentStep={currentStep}>
          <div className="mt-8 p-6 bg-neutral-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Shopping Cart</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-white rounded">
                <span>Wireless Headphones</span>
                <span>$299.99</span>
              </div>
              <div className="flex justify-between p-3 bg-white rounded">
                <span>Phone Case</span>
                <span>$19.99</span>
              </div>
              <div className="border-t pt-3 font-medium flex justify-between">
                <span>Total</span>
                <span>$319.98</span>
              </div>
            </div>
          </div>
        </StepContent>
        
        <StepContent step={1} currentStep={currentStep}>
          <div className="mt-8 p-6 bg-neutral-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
            <form className="space-y-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input 
                type="text" 
                placeholder="Address" 
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="City" 
                  className="px-4 py-2 border rounded-lg"
                />
                <input 
                  type="text" 
                  placeholder="ZIP Code" 
                  className="px-4 py-2 border rounded-lg"
                />
              </div>
            </form>
          </div>
        </StepContent>
        
        <StepContent step={2} currentStep={currentStep}>
          <div className="mt-8 p-6 bg-neutral-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 bg-white rounded-lg border cursor-pointer">
                <input type="radio" name="payment" className="mr-3" />
                <Icon icon="creditCard" className="mr-3" />
                <span>Credit Card</span>
              </label>
              <label className="flex items-center p-3 bg-white rounded-lg border cursor-pointer">
                <input type="radio" name="payment" className="mr-3" />
                <span>PayPal</span>
              </label>
            </div>
          </div>
        </StepContent>
        
        <StepContent step={3} currentStep={currentStep}>
          <div className="mt-8 p-6 bg-neutral-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Order Confirmation</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Items:</strong> 2 products - $319.98</p>
              <p><strong>Shipping:</strong> John Doe, 123 Main St</p>
              <p><strong>Payment:</strong> Credit Card ending in 1234</p>
            </div>
            <div className="mt-4 p-4 bg-success-50 text-success-700 rounded-lg">
              Ready to place your order!
            </div>
          </div>
        </StepContent>
        
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={nextStep}
          onPrevious={previousStep}
          onComplete={() => alert('Order placed successfully!')}
          nextLabel="Continue"
          previousLabel="Back"
          completeLabel="Place Order"
        />
      </div>
    );
  },
};

// Vendor onboarding
export const VendorOnboarding: Story = {
  render: () => {
    const { currentStep, nextStep, previousStep } = useStepper(5);
    
    const steps = [
      { label: 'Business Info', description: 'Tell us about your business' },
      { label: 'Verification', description: 'Verify your identity' },
      { label: 'Bank Details', description: 'Set up payment information' },
      { label: 'Store Setup', description: 'Customize your storefront' },
      { label: 'Go Live', description: 'Launch your store' },
    ];
    
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2">Become a Vendor</h2>
        <p className="text-neutral-600 mb-8">Complete these steps to start selling</p>
        
        <Stepper 
          steps={steps} 
          currentStep={currentStep}
          orientation="vertical"
          clickable={false}
        />
        
        <div className="mt-8 ml-16">
          <div className="p-6 bg-white border rounded-lg">
            <h3 className="text-lg font-medium mb-2">
              {steps[currentStep].label}
            </h3>
            <p className="text-neutral-600 mb-4">
              {steps[currentStep].description}
            </p>
            {/* Form content would go here */}
            <p className="text-sm text-neutral-500">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          
          <StepNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={nextStep}
            onPrevious={previousStep}
            onComplete={() => alert('Welcome aboard!')}
            completeLabel="Launch Store"
          />
        </div>
      </div>
    );
  },
};

// Sizes
export const Sizes: Story = {
  render: () => {
    const steps = [
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3' },
    ];
    
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-medium mb-4">Small</h3>
          <Stepper steps={steps} currentStep={1} size="sm" />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">Medium (Default)</h3>
          <Stepper steps={steps} currentStep={1} size="md" />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">Large</h3>
          <Stepper steps={steps} currentStep={1} size="lg" />
        </div>
      </div>
    );
  },
};

// Vertical orientation
export const Vertical: Story = {
  render: () => {
    const steps = [
      { 
        label: 'Account Created',
        description: 'Your account has been successfully created'
      },
      { 
        label: 'Profile Setup',
        description: 'Add your personal information and preferences'
      },
      { 
        label: 'Email Verified',
        description: 'Verify your email address to continue'
      },
      { 
        label: 'Ready to Go',
        description: 'Start exploring the marketplace'
      },
    ];
    
    return (
      <div className="max-w-md">
        <Stepper 
          steps={steps} 
          currentStep={2}
          orientation="vertical"
        />
      </div>
    );
  },
};

// Without connectors
export const NoConnectors: Story = {
  args: {
    steps: [
      { label: 'Draft' },
      { label: 'Review' },
      { label: 'Approved' },
      { label: 'Published' },
    ],
    currentStep: 1,
    showConnector: false,
  },
};

// Non-clickable
export const NonClickable: Story = {
  args: {
    steps: [
      { label: 'Processing' },
      { label: 'Shipping' },
      { label: 'Delivered' },
    ],
    currentStep: 1,
    clickable: false,
  },
};

// Order tracking
export const OrderTracking: Story = {
  render: () => {
    const trackingSteps = [
      { 
        label: 'Order Placed',
        description: 'Jan 20, 2:30 PM',
        icon: <Icon icon="check" size="sm" />
      },
      { 
        label: 'Processing',
        description: 'Jan 20, 3:15 PM',
        icon: <Icon icon="package" size="sm" />
      },
      { 
        label: 'Shipped',
        description: 'Jan 21, 10:00 AM',
        icon: <Icon icon="truck" size="sm" />
      },
      { 
        label: 'Out for Delivery',
        description: 'Expected today',
        icon: <Icon icon="mapPin" size="sm" />
      },
      { 
        label: 'Delivered',
        description: 'Pending',
        icon: <Icon icon="home" size="sm" />
      },
    ];
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-6">Track Your Order</h3>
          <p className="text-sm text-neutral-600 mb-8">Order #12345</p>
          
          <Stepper 
            steps={trackingSteps} 
            currentStep={3}
            orientation="vertical"
            clickable={false}
          />
          
          <div className="mt-8 p-4 bg-primary-50 text-primary-700 rounded-lg">
            <p className="font-medium">Your package is out for delivery!</p>
            <p className="text-sm mt-1">Expected delivery by 6:00 PM today</p>
          </div>
        </div>
      </div>
    );
  },
};

// Form wizard
export const FormWizard: Story = {
  render: () => {
    const { currentStep, nextStep, previousStep, goToStep } = useStepper(3);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      company: '',
    });
    
    const steps = [
      { label: 'Personal', icon: <Icon icon="user" size="sm" /> },
      { label: 'Company', icon: <Icon icon="building" size="sm" /> },
      { label: 'Complete', icon: <Icon icon="check" size="sm" /> },
    ];
    
    const canProceed = () => {
      switch (currentStep) {
        case 0:
          return formData.name && formData.email;
        case 1:
          return formData.company;
        default:
          return true;
      }
    };
    
    return (
      <div className="max-w-2xl mx-auto">
        <Stepper 
          steps={steps} 
          currentStep={currentStep}
          onStepClick={goToStep}
        />
        
        <div className="mt-8">
          <StepContent step={0} currentStep={currentStep}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </StepContent>
          
          <StepContent step={1} currentStep={currentStep}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </StepContent>
          
          <StepContent step={2} currentStep={currentStep}>
            <div className="text-center py-8">
              <Icon icon="checkCircle" size="xl" className="mx-auto mb-4 text-success-600" />
              <h3 className="text-lg font-medium">Setup Complete!</h3>
              <p className="text-neutral-600 mt-2">
                Welcome {formData.name} from {formData.company}
              </p>
            </div>
          </StepContent>
          
          <StepNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={nextStep}
            onPrevious={previousStep}
            onComplete={() => alert('Setup completed!')}
            disableNavigation={!canProceed()}
          />
        </div>
      </div>
    );
  },
};