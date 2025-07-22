import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Toast, ToastContainer, useToast } from './Toast';

const meta = {
  title: 'Molecules/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger', 'info'],
    },
    position: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    },
    duration: {
      control: 'number',
    },
    persistent: {
      control: 'boolean',
    },
    showIcon: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic toasts
export const Default: Story = {
  args: {
    message: 'This is Toast',
    onClose: () => console.log('Toast closed'),
  },
};

export const WithDescription: Story = {
  args: {
    message: 'Operation completed',
    description: 'Your changes have been saved successfully.',
    onClose: () => {},
  },
};

export const WithAction: Story = {
  args: {
    message: 'Item deleted',
    action: {
      label: 'Undo',
      onClick: () => console.log('Undo clicked'),
    },
    onClose: () => {},
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Toast 
        message="Default notification" 
        onClose={() => {}}
      />
      <Toast 
        variant="success"
        message="Order placed successfully!" 
        onClose={() => {}}
      />
      <Toast 
        variant="warning"
        message="Low stock warning" 
        onClose={() => {}}
      />
      <Toast 
        variant="danger"
        message="Payment failed" 
        onClose={() => {}}
      />
      <Toast 
        variant="info"
        message="New feature available" 
        onClose={() => {}}
      />
    </div>
  ),
};

// Positions
export const Positions: Story = {
  render: () => {
    const [position, setPosition] = useState<'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'>('top-right');
    const [showToast, setShowToast] = useState(false);
    
    return (
      <div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Position:</label>
            <select 
              value={position} 
              onChange={(e) => setPosition(e.target.value as any)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="top-left">Top Left</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>
          <button
            onClick={() => setShowToast(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Show Toast
          </button>
        </div>
        
        {showToast && (
          <Toast
            position={position}
            message={`Toast at ${position}`}
            variant="success"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    );
  },
};

// E-commerce examples
export const OrderSuccess: Story = {
  render: () => (
    <Toast
      variant="success"
      message="Order placed successfully!"
      description="Order #12345 will be delivered by tomorrow."
      action={{
        label: 'View Order',
        onClick: () => console.log('View order'),
      }}
      onClose={() => {}}
    />
  ),
};

export const PaymentError: Story = {
  render: () => (
    <Toast
      variant="danger"
      message="Payment failed"
      description="Your card was declined. Please try another payment method."
      action={{
        label: 'Update Payment',
        onClick: () => console.log('Update payment'),
      }}
      onClose={() => {}}
    />
  ),
};

export const LowStock: Story = {
  render: () => (
    <Toast
      variant="warning"
      message="Low stock alert"
      description="Only 3 items left in stock. Order soon!"
      onClose={() => {}}
    />
  ),
};

export const CartUpdate: Story = {
  render: () => (
    <Toast
      variant="info"
      message="Item added to cart"
      action={{
        label: 'View Cart',
        onClick: () => console.log('View cart'),
      }}
      onClose={() => {}}
    />
  ),
};

// Interactive example with hook
export const ToastManager: Story = {
  render: () => {
    const { toasts, addToast, removeToast } = useToast();
    
    const showSuccessToast = () => {
      addToast({
        variant: 'success',
        message: 'Product saved successfully!',
        description: 'Your changes have been applied.',
      });
    };
    
    const showErrorToast = () => {
      addToast({
        variant: 'danger',
        message: 'Error saving product',
        description: 'Please check your input and try again.',
      });
    };
    
    const showInfoToast = () => {
      addToast({
        variant: 'info',
        message: 'Tip: Use keyboard shortcuts',
        description: 'Press Ctrl+S to save your changes quickly.',
        persistent: true,
      });
    };
    
    return (
      <div>
        <div className="space-x-2">
          <button
            onClick={showSuccessToast}
            className="px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700"
          >
            Success Toast
          </button>
          <button
            onClick={showErrorToast}
            className="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700"
          >
            Error Toast
          </button>
          <button
            onClick={showInfoToast}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Info Toast (Persistent)
          </button>
        </div>
        
        <ToastContainer position="top-right">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </ToastContainer>
      </div>
    );
  },
};

// Multiple toasts
export const MultipleToasts: Story = {
  render: () => (
    <ToastContainer position="top-right">
      <Toast
        variant="success"
        message="File uploaded"
        onClose={() => {}}
      />
      <Toast
        variant="info"
        message="Processing image..."
        onClose={() => {}}
      />
      <Toast
        variant="warning"
        message="Large file size"
        description="Files over 10MB may take longer to process."
        onClose={() => {}}
      />
    </ToastContainer>
  ),
};

// Custom duration
export const CustomDuration: Story = {
  render: () => {
    const [showShort, setShowShort] = useState(false);
    const [showLong, setShowLong] = useState(false);
    
    return (
      <div className="space-y-4">
        <div>
          <button
            onClick={() => setShowShort(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 mr-2"
          >
            Show 2s Toast
          </button>
          <button
            onClick={() => setShowLong(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Show 10s Toast
          </button>
        </div>
        
        {showShort && (
          <Toast
            message="Quick notification (2s)"
            duration={2000}
            onClose={() => setShowShort(false)}
          />
        )}
        
        {showLong && (
          <Toast
            message="Long notification (10s)"
            description="This toast will stay visible for 10 seconds."
            duration={10000}
            variant="info"
            onClose={() => setShowLong(false)}
          />
        )}
      </div>
    );
  },
};

// Vendor notifications
export const VendorNotifications: Story = {
  render: () => (
    <div className="space-y-4">
      <Toast
        variant="success"
        message="New order received!"
        description="Order #54321 from John Doe - $125.99"
        action={{
          label: 'View Order',
          onClick: () => {},
        }}
        onClose={() => {}}
      />
      <Toast
        variant="warning"
        message="Commission tier changing"
        description="You're $500 away from Gold tier (20% commission)"
        onClose={() => {}}
      />
      <Toast
        variant="info"
        message="Inventory sync completed"
        description="235 products updated from your catalog"
        onClose={() => {}}
      />
    </div>
  ),
};

// Custom icons
export const CustomIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <Toast
        message="Custom icon toast"
        icon={<span className="text-2xl">🎉</span>}
        onClose={() => {}}
      />
      <Toast
        message="Another custom icon"
        icon={<span className="text-2xl">📦</span>}
        onClose={() => {}}
      />
      <Toast
        message="No icon toast"
        showIcon={false}
        onClose={() => {}}
      />
    </div>
  ),
};

// Full example
export const CompleteExample: Story = {
  render: () => {
    const [toasts, setToasts] = useState<Array<{
      id: string;
      variant: 'default' | 'success' | 'warning' | 'danger' | 'info';
      message: string;
      description?: string;
    }>>([]);
    
    const addToast = (toast: Omit<typeof toasts[0], 'id'>) => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { ...toast, id }]);
    };
    
    const removeToast = (id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
    };
    
    const scenarios = [
      {
        label: 'Add to Cart',
        toast: {
          variant: 'success' as const,
          message: 'Added to cart',
          description: 'Premium Leather Wallet added to your cart',
        },
      },
      {
        label: 'Save Product',
        toast: {
          variant: 'success' as const,
          message: 'Product saved',
          description: 'Your changes have been saved successfully',
        },
      },
      {
        label: 'Delete Item',
        toast: {
          variant: 'warning' as const,
          message: 'Item deleted',
          description: 'This action cannot be undone',
        },
      },
      {
        label: 'Network Error',
        toast: {
          variant: 'danger' as const,
          message: 'Connection failed',
          description: 'Please check your internet connection',
        },
      },
    ];
    
    return (
      <div>
        <div className="grid grid-cols-2 gap-2 max-w-md">
          {scenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => addToast(scenario.toast)}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-sm"
            >
              {scenario.label}
            </button>
          ))}
        </div>
        
        <ToastContainer position="bottom-right">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              {...toast}
              duration={5000}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </ToastContainer>
      </div>
    );
  },
};