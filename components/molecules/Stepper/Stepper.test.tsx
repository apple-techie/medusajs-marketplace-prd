import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper, StepContent, StepNavigation, useStepper } from './Stepper';
import { renderHook, act } from '@testing-library/react';

describe('Stepper Component', () => {
  const mockSteps = [
    { label: 'Step 1', description: 'First step description' },
    { label: 'Step 2', description: 'Second step description' },
    { label: 'Step 3', description: 'Third step description' },
  ];

  it('renders all steps', () => {
    render(<Stepper steps={mockSteps} currentStep={0} />);
    
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('shows correct step numbers', () => {
    render(<Stepper steps={mockSteps} currentStep={0} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('applies correct status classes', () => {
    const { container } = render(<Stepper steps={mockSteps} currentStep={1} />);
    
    const indicators = container.querySelectorAll('[class*="rounded-full"]');
    
    // First step should be complete
    expect(indicators[0]).toHaveClass('bg-primary-600', 'text-white');
    
    // Second step should be active
    expect(indicators[1]).toHaveClass('bg-primary-600', 'text-white', 'ring-4');
    
    // Third step should be upcoming
    expect(indicators[2]).toHaveClass('bg-neutral-200', 'text-neutral-600');
  });

  it('shows check icon for completed steps', () => {
    const { container } = render(<Stepper steps={mockSteps} currentStep={2} />);
    
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(2); // Two completed steps should have check icons
  });

  it('handles step click', () => {
    const handleStepClick = jest.fn();
    render(
      <Stepper 
        steps={mockSteps} 
        currentStep={2} 
        onStepClick={handleStepClick}
      />
    );
    
    // Click on completed step
    fireEvent.click(screen.getByText('Step 1'));
    expect(handleStepClick).toHaveBeenCalledWith(0);
    
    // Click on active step
    fireEvent.click(screen.getByText('Step 3'));
    expect(handleStepClick).toHaveBeenCalledWith(2);
  });

  it('prevents clicking on upcoming steps', () => {
    const handleStepClick = jest.fn();
    render(
      <Stepper 
        steps={mockSteps} 
        currentStep={0} 
        onStepClick={handleStepClick}
      />
    );
    
    fireEvent.click(screen.getByText('Step 3'));
    expect(handleStepClick).not.toHaveBeenCalled();
  });

  it('disables clicking when clickable is false', () => {
    const handleStepClick = jest.fn();
    render(
      <Stepper 
        steps={mockSteps} 
        currentStep={1} 
        onStepClick={handleStepClick}
        clickable={false}
      />
    );
    
    fireEvent.click(screen.getByText('Step 1'));
    expect(handleStepClick).not.toHaveBeenCalled();
  });

  it('renders with custom icons', () => {
    const stepsWithIcons = [
      { label: 'Step 1', icon: <span data-testid="icon-1">📝</span> },
      { label: 'Step 2', icon: <span data-testid="icon-2">📦</span> },
    ];
    
    render(<Stepper steps={stepsWithIcons} currentStep={0} />);
    
    expect(screen.getByTestId('icon-1')).toBeInTheDocument();
    expect(screen.getByTestId('icon-2')).toBeInTheDocument();
  });

  it('renders connectors by default', () => {
    const { container } = render(<Stepper steps={mockSteps} currentStep={1} />);
    
    const connectors = container.querySelectorAll('[class*="bg-primary-600"]:not([class*="rounded-full"])');
    expect(connectors.length).toBeGreaterThan(0);
  });

  it('hides connectors when showConnector is false', () => {
    const { container } = render(
      <Stepper steps={mockSteps} currentStep={1} showConnector={false} />
    );
    
    const connectors = container.querySelectorAll('[class*="mx-2"]');
    expect(connectors).toHaveLength(0);
  });

  it('renders in vertical orientation', () => {
    const { container } = render(
      <Stepper steps={mockSteps} currentStep={0} orientation="vertical" />
    );
    
    const stepper = container.firstChild;
    expect(stepper).toHaveClass('flex-col');
    
    // Check descriptions are shown in vertical mode
    expect(screen.getByText('First step description')).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { container: smContainer } = render(
      <Stepper steps={mockSteps} currentStep={0} size="sm" />
    );
    const smIndicator = smContainer.querySelector('[class*="rounded-full"]');
    expect(smIndicator).toHaveClass('h-8', 'w-8', 'text-xs');

    const { container: lgContainer } = render(
      <Stepper steps={mockSteps} currentStep={0} size="lg" />
    );
    const lgIndicator = lgContainer.querySelector('[class*="rounded-full"]');
    expect(lgIndicator).toHaveClass('h-12', 'w-12', 'text-base');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Stepper steps={mockSteps} currentStep={0} className="custom-stepper" />
    );
    expect(container.firstChild).toHaveClass('custom-stepper');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Stepper ref={ref} steps={mockSteps} currentStep={0} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('StepContent Component', () => {
  it('renders content for current step', () => {
    render(
      <StepContent step={1} currentStep={1}>
        <p>Step 1 content</p>
      </StepContent>
    );
    
    expect(screen.getByText('Step 1 content')).toBeInTheDocument();
  });

  it('does not render content for other steps', () => {
    render(
      <StepContent step={2} currentStep={1}>
        <p>Step 2 content</p>
      </StepContent>
    );
    
    expect(screen.queryByText('Step 2 content')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <StepContent step={1} currentStep={1} className="custom-content">
        Content
      </StepContent>
    );
    
    expect(screen.getByText('Content').parentElement).toHaveClass('custom-content');
  });
});

describe('StepNavigation Component', () => {
  it('renders navigation buttons', () => {
    render(
      <StepNavigation currentStep={1} totalSteps={3} />
    );
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables previous button on first step', () => {
    render(
      <StepNavigation currentStep={0} totalSteps={3} />
    );
    
    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  it('shows complete button on last step', () => {
    render(
      <StepNavigation currentStep={2} totalSteps={3} />
    );
    
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('handles navigation callbacks', () => {
    const handleNext = jest.fn();
    const handlePrevious = jest.fn();
    const handleComplete = jest.fn();
    
    const { rerender } = render(
      <StepNavigation 
        currentStep={1} 
        totalSteps={3}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onComplete={handleComplete}
      />
    );
    
    fireEvent.click(screen.getByText('Previous'));
    expect(handlePrevious).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Next'));
    expect(handleNext).toHaveBeenCalledTimes(1);
    
    // Move to last step
    rerender(
      <StepNavigation 
        currentStep={2} 
        totalSteps={3}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onComplete={handleComplete}
      />
    );
    
    fireEvent.click(screen.getByText('Complete'));
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('uses custom button labels', () => {
    render(
      <StepNavigation 
        currentStep={1} 
        totalSteps={3}
        previousLabel="Back"
        nextLabel="Continue"
        completeLabel="Finish"
      />
    );
    
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('disables all buttons when disableNavigation is true', () => {
    render(
      <StepNavigation 
        currentStep={1} 
        totalSteps={3}
        disableNavigation
      />
    );
    
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });
});

describe('useStepper Hook', () => {
  it('initializes with default step', () => {
    const { result } = renderHook(() => useStepper(3));
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
  });

  it('initializes with custom initial step', () => {
    const { result } = renderHook(() => useStepper(3, 1));
    expect(result.current.currentStep).toBe(1);
  });

  it('navigates to next step', () => {
    const { result } = renderHook(() => useStepper(3));
    
    act(() => {
      result.current.nextStep();
    });
    
    expect(result.current.currentStep).toBe(1);
  });

  it('navigates to previous step', () => {
    const { result } = renderHook(() => useStepper(3, 2));
    
    act(() => {
      result.current.previousStep();
    });
    
    expect(result.current.currentStep).toBe(1);
  });

  it('prevents navigation beyond bounds', () => {
    const { result } = renderHook(() => useStepper(3));
    
    // Try to go before first step
    act(() => {
      result.current.previousStep();
    });
    expect(result.current.currentStep).toBe(0);
    
    // Go to last step
    act(() => {
      result.current.goToStep(2);
    });
    
    // Try to go beyond last step
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(2);
  });

  it('goes to specific step', () => {
    const { result } = renderHook(() => useStepper(5));
    
    act(() => {
      result.current.goToStep(3);
    });
    
    expect(result.current.currentStep).toBe(3);
  });

  it('resets to first step', () => {
    const { result } = renderHook(() => useStepper(3, 2));
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.currentStep).toBe(0);
  });

  it('correctly identifies first and last steps', () => {
    const { result } = renderHook(() => useStepper(3));
    
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
    
    act(() => {
      result.current.goToStep(2);
    });
    
    expect(result.current.isFirstStep).toBe(false);
    expect(result.current.isLastStep).toBe(true);
  });
});