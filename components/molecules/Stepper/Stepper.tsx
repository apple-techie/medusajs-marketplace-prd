import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define stepper variants
const stepperVariants = cva(
  'flex',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row items-center',
        vertical: 'flex-col',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      size: 'md',
    },
  }
);

const stepVariants = cva(
  'flex items-center',
  {
    variants: {
      orientation: {
        horizontal: 'flex-1',
        vertical: 'w-full',
      },
      status: {
        complete: '',
        active: '',
        upcoming: '',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      status: 'upcoming',
    },
  }
);

const stepIndicatorVariants = cva(
  'relative flex items-center justify-center rounded-full transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
      },
      status: {
        complete: 'bg-primary-600 text-white',
        active: 'bg-primary-600 text-white ring-4 ring-primary-100',
        upcoming: 'bg-neutral-200 text-neutral-600',
      },
    },
    defaultVariants: {
      size: 'md',
      status: 'upcoming',
    },
  }
);

const stepConnectorVariants = cva(
  'transition-all duration-200',
  {
    variants: {
      orientation: {
        horizontal: 'h-0.5 flex-1 mx-2',
        vertical: 'w-0.5 flex-1 my-2 ml-5',
      },
      status: {
        complete: 'bg-primary-600',
        active: 'bg-neutral-300',
        upcoming: 'bg-neutral-300',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      status: 'upcoming',
    },
  }
);

// Types
export interface StepperProps extends VariantProps<typeof stepperVariants> {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  className?: string;
  showConnector?: boolean;
  clickable?: boolean;
}

export interface StepItem {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
}

// Helper function to determine step status
const getStepStatus = (stepIndex: number, currentStep: number): 'complete' | 'active' | 'upcoming' => {
  if (stepIndex < currentStep) return 'complete';
  if (stepIndex === currentStep) return 'active';
  return 'upcoming';
};

// Icons
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5 4.5L6 12L2.5 8.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Main Stepper component
export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ 
    steps, 
    currentStep, 
    onStepClick, 
    className, 
    orientation = 'horizontal',
    size = 'md',
    showConnector = true,
    clickable = true,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(stepperVariants({ orientation, size }), className)}
        {...props}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index, currentStep);
          const isLast = index === steps.length - 1;
          const isClickable = clickable && (status === 'complete' || status === 'active');
          
          return (
            <div
              key={index}
              className={cn(
                stepVariants({ orientation, status }),
                orientation === 'vertical' && 'relative'
              )}
            >
              <button
                type="button"
                className={cn(
                  'flex items-center focus:outline-none',
                  orientation === 'horizontal' ? 'flex-col' : 'flex-row',
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                )}
                onClick={() => isClickable && onStepClick?.(index)}
                disabled={!isClickable}
              >
                <div className={stepIndicatorVariants({ size, status })}>
                  {status === 'complete' ? (
                    <CheckIcon />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                
                <div
                  className={cn(
                    'text-left',
                    orientation === 'horizontal' ? 'mt-2 text-center' : 'ml-3 flex-1'
                  )}
                >
                  <p
                    className={cn(
                      'font-medium',
                      size === 'sm' && 'text-sm',
                      size === 'md' && 'text-base',
                      size === 'lg' && 'text-lg',
                      status === 'complete' && 'text-primary-600',
                      status === 'active' && 'text-neutral-900',
                      status === 'upcoming' && 'text-neutral-500'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && orientation === 'vertical' && (
                    <p
                      className={cn(
                        'mt-1',
                        size === 'sm' && 'text-xs',
                        size === 'md' && 'text-sm',
                        size === 'lg' && 'text-base',
                        status === 'upcoming' ? 'text-neutral-400' : 'text-neutral-600'
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </button>
              
              {/* Connector */}
              {showConnector && !isLast && (
                <div
                  className={cn(
                    stepConnectorVariants({ 
                      orientation, 
                      status: getStepStatus(index + 1, currentStep) === 'upcoming' ? 'upcoming' : 'complete'
                    }),
                    orientation === 'vertical' && 'absolute left-5 top-12'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';

// Step content component
export interface StepContentProps {
  step: number;
  currentStep: number;
  children: React.ReactNode;
  className?: string;
}

export const StepContent = React.forwardRef<HTMLDivElement, StepContentProps>(
  ({ step, currentStep, children, className, ...props }, ref) => {
    if (step !== currentStep) return null;
    
    return (
      <div
        ref={ref}
        className={cn('mt-8', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StepContent.displayName = 'StepContent';

// Navigation component
export interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  completeLabel?: string;
  className?: string;
  disableNavigation?: boolean;
}

export const StepNavigation = React.forwardRef<HTMLDivElement, StepNavigationProps>(
  ({ 
    currentStep, 
    totalSteps, 
    onNext, 
    onPrevious, 
    onComplete,
    nextLabel = 'Next',
    previousLabel = 'Previous',
    completeLabel = 'Complete',
    className,
    disableNavigation = false,
    ...props 
  }, ref) => {
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;
    
    return (
      <div
        ref={ref}
        className={cn('flex justify-between mt-8', className)}
        {...props}
      >
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep || disableNavigation}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors',
            isFirstStep || disableNavigation
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          )}
        >
          {previousLabel}
        </button>
        
        <button
          type="button"
          onClick={isLastStep ? onComplete : onNext}
          disabled={disableNavigation}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors',
            disableNavigation
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          )}
        >
          {isLastStep ? completeLabel : nextLabel}
        </button>
      </div>
    );
  }
);

StepNavigation.displayName = 'StepNavigation';

// Hook for managing stepper state
export const useStepper = (totalSteps: number, initialStep = 0) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  
  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };
  
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const reset = () => {
    setCurrentStep(0);
  };
  
  return {
    currentStep,
    goToStep,
    nextStep,
    previousStep,
    reset,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
  };
};

export { stepperVariants, stepVariants, stepIndicatorVariants, stepConnectorVariants };