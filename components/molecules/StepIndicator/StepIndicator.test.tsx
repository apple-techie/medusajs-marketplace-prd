import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepIndicator } from './StepIndicator';

// Mock components
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, size }: any) => (
    <span data-testid={`icon-${icon}`} data-size={size}>
      {icon}
    </span>
  ),
}));

describe('StepIndicator Component', () => {
  const defaultSteps = [
    { id: 'cart', label: 'Cart' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ];

  it('renders all steps', () => {
    render(<StepIndicator steps={defaultSteps} />);
    
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('renders with current step by index', () => {
    render(<StepIndicator steps={defaultSteps} currentStep={1} />);
    
    const shippingStep = screen.getByText('Shipping').closest('div');
    expect(shippingStep?.parentElement).toHaveAttribute('aria-current', 'step');
  });

  it('renders with current step by id', () => {
    render(<StepIndicator steps={defaultSteps} currentStep="payment" />);
    
    const paymentStep = screen.getByText('Payment').closest('div');
    expect(paymentStep?.parentElement).toHaveAttribute('aria-current', 'step');
  });

  it('renders with step descriptions', () => {
    const stepsWithDesc = [
      { id: 'cart', label: 'Cart', description: 'Review your items' },
      { id: 'shipping', label: 'Shipping', description: 'Enter address' },
    ];
    
    render(<StepIndicator steps={stepsWithDesc} showDescription />);
    
    expect(screen.getByText('Review your items')).toBeInTheDocument();
    expect(screen.getByText('Enter address')).toBeInTheDocument();
  });

  it('renders with step icons', () => {
    const stepsWithIcons = [
      { id: 'cart', label: 'Cart', icon: 'shopping-cart' },
      { id: 'shipping', label: 'Shipping', icon: 'truck' },
    ];
    
    render(<StepIndicator steps={stepsWithIcons} />);
    
    expect(screen.getByTestId('icon-shopping-cart')).toBeInTheDocument();
    expect(screen.getByTestId('icon-truck')).toBeInTheDocument();
  });

  it('shows completed steps with check icon', () => {
    render(<StepIndicator steps={defaultSteps} currentStep={2} />);
    
    // First two steps should be completed
    const checkIcons = screen.getAllByTestId('icon-check');
    expect(checkIcons).toHaveLength(2);
  });

  it('renders with custom status', () => {
    const stepsWithStatus = [
      { id: 'cart', label: 'Cart', status: 'completed' as const },
      { id: 'shipping', label: 'Shipping', status: 'error' as const },
      { id: 'payment', label: 'Payment', status: 'current' as const },
      { id: 'review', label: 'Review', status: 'upcoming' as const },
    ];
    
    render(<StepIndicator steps={stepsWithStatus} />);
    
    expect(screen.getByTestId('icon-check')).toBeInTheDocument(); // completed
    expect(screen.getByTestId('icon-x')).toBeInTheDocument(); // error
  });

  it('handles step clicks', () => {
    const handleClick = jest.fn();
    const clickableSteps = defaultSteps.map(step => ({
      ...step,
      onClick: handleClick,
    }));
    
    render(<StepIndicator steps={clickableSteps} clickable />);
    
    fireEvent.click(screen.getByText('Shipping'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('handles step href navigation', () => {
    const stepsWithHref = [
      { id: 'cart', label: 'Cart', href: '/cart' },
      { id: 'shipping', label: 'Shipping', href: '/shipping' },
    ];
    
    // Mock window.location.href
    delete (window as any).location;
    window.location = { href: '' } as any;
    
    render(<StepIndicator steps={stepsWithHref} clickable />);
    
    fireEvent.click(screen.getByText('Cart'));
    expect(window.location.href).toBe('/cart');
  });

  it('disables clickable behavior when specified', () => {
    const handleClick = jest.fn();
    const clickableSteps = defaultSteps.map(step => ({
      ...step,
      onClick: handleClick,
    }));
    
    render(<StepIndicator steps={clickableSteps} clickable={false} />);
    
    fireEvent.click(screen.getByText('Shipping'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('disables individual steps', () => {
    const handleClick = jest.fn();
    const stepsWithDisabled = [
      { id: 'cart', label: 'Cart', onClick: handleClick },
      { id: 'shipping', label: 'Shipping', onClick: handleClick, disabled: true },
    ];
    
    render(<StepIndicator steps={stepsWithDisabled} clickable />);
    
    fireEvent.click(screen.getByText('Shipping'));
    expect(handleClick).not.toHaveBeenCalled();
    
    fireEvent.click(screen.getByText('Cart'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders numbered variant', () => {
    render(<StepIndicator steps={defaultSteps} variant="numbered" />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders simple variant', () => {
    render(<StepIndicator steps={defaultSteps} variant="simple" />);
    
    const firstStep = screen.getByText('Cart').closest('div')?.parentElement;
    expect(firstStep?.querySelector('div')).toHaveClass('border-2');
  });

  it('renders dotted variant', () => {
    render(<StepIndicator steps={defaultSteps} variant="dotted" />);
    
    // In dotted variant, labels are not shown
    expect(screen.queryByText('Cart')).not.toBeInTheDocument();
  });

  it('renders vertical orientation', () => {
    render(<StepIndicator steps={defaultSteps} orientation="vertical" />);
    
    const container = screen.getByRole('list');
    expect(container).toHaveClass('flex-col');
  });

  it('renders different sizes', () => {
    const { rerender } = render(
      <StepIndicator steps={defaultSteps} size="sm" />
    );
    
    expect(screen.getByTestId('icon-check')).toHaveAttribute('data-size', 'xs');
    
    rerender(<StepIndicator steps={defaultSteps} size="lg" currentStep={1} />);
    expect(screen.getByTestId('icon-check')).toHaveAttribute('data-size', 'md');
  });

  it('renders with progress bar', () => {
    render(
      <StepIndicator
        steps={defaultSteps}
        currentStep={2}
        progressBar
      />
    );
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveStyle({ width: '50%' }); // 2 of 4 steps = 50%
  });

  it('renders with custom progress value', () => {
    render(
      <StepIndicator
        steps={defaultSteps}
        progressBar
        progressValue={75}
      />
    );
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveStyle({ width: '75%' });
  });

  it('hides connectors when specified', () => {
    render(
      <StepIndicator
        steps={defaultSteps}
        showConnector={false}
      />
    );
    
    // Connectors have specific height classes
    expect(screen.queryByText('', { selector: '.h-0.5' })).not.toBeInTheDocument();
  });

  it('renders mobile collapsed view', () => {
    render(
      <StepIndicator
        steps={defaultSteps}
        currentStep={1}
        mobileCollapse
        mobileShowCurrent
      />
    );
    
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
    expect(screen.getByText('Shipping')).toBeInTheDocument();
  });

  it('applies custom classes', () => {
    render(
      <StepIndicator
        steps={defaultSteps}
        className="custom-class"
        stepClassName="custom-step"
        connectorClassName="custom-connector"
        labelClassName="custom-label"
      />
    );
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-class');
  });

  it('uses custom labels for screen readers', () => {
    render(
      <StepIndicator
        steps={defaultSteps}
        currentStep={1}
        completedLabel="Done"
        currentLabel="Active"
        upcomingLabel="Next"
      />
    );
    
    expect(screen.getByText('Done')).toHaveClass('sr-only');
    expect(screen.getByText('Active')).toHaveClass('sr-only');
    expect(screen.getAllByText('Next')).toHaveLength(2); // Two upcoming steps
  });

  it('uses aria-label when provided', () => {
    render(
      <StepIndicator
        steps={defaultSteps}
        aria-label="Checkout progress"
      />
    );
    
    expect(screen.getByLabelText('Checkout progress')).toBeInTheDocument();
  });

  it('handles error status with error label', () => {
    const stepsWithError = [
      { id: 'payment', label: 'Payment', status: 'error' as const },
    ];
    
    render(
      <StepIndicator
        steps={stepsWithError}
        errorLabel="Failed"
      />
    );
    
    expect(screen.getByText('Failed')).toHaveClass('sr-only');
  });

  it('automatically detects current step when not specified', () => {
    const stepsWithStatus = [
      { id: 'cart', label: 'Cart', status: 'completed' as const },
      { id: 'shipping', label: 'Shipping', status: 'completed' as const },
      { id: 'payment', label: 'Payment' },
      { id: 'review', label: 'Review' },
    ];
    
    render(<StepIndicator steps={stepsWithStatus} />);
    
    const paymentStep = screen.getByText('Payment').closest('div');
    expect(paymentStep?.parentElement).toHaveAttribute('aria-current', 'step');
  });

  it('hides step numbers when specified', () => {
    render(
      <StepIndicator
        steps={defaultSteps}
        variant="numbered"
        showStepNumber={false}
      />
    );
    
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });
});