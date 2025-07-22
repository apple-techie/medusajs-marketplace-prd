import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';

export interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  status?: 'completed' | 'current' | 'upcoming' | 'error';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface StepIndicatorProps {
  // Steps
  steps: Step[];
  currentStep?: number | string;
  
  // Display options
  variant?: 'default' | 'simple' | 'dotted' | 'numbered';
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  
  // Behavior
  clickable?: boolean;
  showDescription?: boolean;
  showStepNumber?: boolean;
  showConnector?: boolean;
  
  // Progress
  progressBar?: boolean;
  progressValue?: number;
  
  // Labels
  completedLabel?: string;
  currentLabel?: string;
  upcomingLabel?: string;
  errorLabel?: string;
  
  // Styling
  className?: string;
  stepClassName?: string;
  connectorClassName?: string;
  labelClassName?: string;
  
  // Mobile
  mobileCollapse?: boolean;
  mobileShowCurrent?: boolean;
  
  'aria-label'?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  variant = 'default',
  orientation = 'horizontal',
  size = 'md',
  clickable = true,
  showDescription = true,
  showStepNumber = true,
  showConnector = true,
  progressBar = false,
  progressValue,
  completedLabel = 'Completed',
  currentLabel = 'Current step',
  upcomingLabel = 'Upcoming',
  errorLabel = 'Error',
  className,
  stepClassName,
  connectorClassName,
  labelClassName,
  mobileCollapse = false,
  mobileShowCurrent = true,
  'aria-label': ariaLabel,
}) => {
  // Find current step index
  const currentStepIndex = React.useMemo(() => {
    if (typeof currentStep === 'number') {
      return currentStep;
    }
    if (typeof currentStep === 'string') {
      return steps.findIndex(step => step.id === currentStep);
    }
    // Find first non-completed step
    const firstNonCompleted = steps.findIndex(step => step.status !== 'completed');
    return firstNonCompleted >= 0 ? firstNonCompleted : steps.length - 1;
  }, [currentStep, steps]);

  // Calculate progress
  const progress = React.useMemo(() => {
    if (progressValue !== undefined) {
      return progressValue;
    }
    const completedSteps = steps.filter((_, index) => index < currentStepIndex).length;
    return (completedSteps / (steps.length - 1)) * 100;
  }, [progressValue, steps, currentStepIndex]);

  // Size classes
  const sizeClasses = {
    sm: {
      step: 'w-6 h-6 text-xs',
      icon: 'xs' as const,
      text: 'text-xs',
      gap: orientation === 'horizontal' ? 'gap-2' : 'gap-3',
      connectorWidth: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
      connectorLength: orientation === 'horizontal' ? 'flex-1' : 'h-8',
    },
    md: {
      step: 'w-8 h-8 text-sm',
      icon: 'sm' as const,
      text: 'text-sm',
      gap: orientation === 'horizontal' ? 'gap-3' : 'gap-4',
      connectorWidth: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
      connectorLength: orientation === 'horizontal' ? 'flex-1' : 'h-12',
    },
    lg: {
      step: 'w-10 h-10 text-base',
      icon: 'md' as const,
      text: 'text-base',
      gap: orientation === 'horizontal' ? 'gap-4' : 'gap-5',
      connectorWidth: orientation === 'horizontal' ? 'h-1' : 'w-1',
      connectorLength: orientation === 'horizontal' ? 'flex-1' : 'h-16',
    },
  };

  const currentSize = sizeClasses[size];

  // Get step status
  const getStepStatus = (step: Step, index: number): Step['status'] => {
    if (step.status) return step.status;
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'upcoming';
  };

  // Get step icon
  const getStepIcon = (step: Step, status: Step['status']) => {
    if (status === 'completed') {
      return 'check';
    }
    if (status === 'error') {
      return 'x';
    }
    return step.icon;
  };

  // Handle step click
  const handleStepClick = (step: Step, index: number) => {
    if (!clickable || step.disabled) return;
    
    if (step.onClick) {
      step.onClick();
    } else if (step.href) {
      window.location.href = step.href;
    }
  };

  // Render step indicator
  const renderStepIndicator = (step: Step, index: number, status: Step['status']) => {
    const isClickable = clickable && !step.disabled && (step.onClick || step.href);
    const icon = getStepIcon(step, status);

    const indicatorContent = (
      <>
        {variant === 'numbered' && showStepNumber && !icon ? (
          <span className="font-medium">{index + 1}</span>
        ) : icon ? (
          <Icon icon={icon} size={currentSize.icon} />
        ) : null}
      </>
    );

    const indicatorClasses = cn(
      'rounded-full flex items-center justify-center transition-all',
      currentSize.step,
      status === 'completed' && 'bg-primary-600 text-white',
      status === 'current' && 'bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900',
      status === 'upcoming' && 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400',
      status === 'error' && 'bg-red-600 text-white ring-4 ring-red-100 dark:ring-red-900',
      isClickable && 'cursor-pointer hover:shadow-md',
      variant === 'simple' && 'border-2',
      variant === 'simple' && status === 'completed' && 'border-primary-600 bg-primary-600',
      variant === 'simple' && status === 'current' && 'border-primary-600 bg-white dark:bg-neutral-900 text-primary-600',
      variant === 'simple' && status === 'upcoming' && 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900',
      variant === 'dotted' && currentSize.step.replace('w-', 'w-').replace('h-', 'h-'),
      stepClassName
    );

    if (variant === 'dotted') {
      return (
        <div
          className={cn(
            'rounded-full transition-all',
            status === 'completed' && 'bg-primary-600',
            status === 'current' && 'bg-primary-600 ring-4 ring-primary-100 dark:ring-primary-900',
            status === 'upcoming' && 'bg-neutral-300 dark:bg-neutral-600',
            status === 'error' && 'bg-red-600',
            'w-3 h-3',
            isClickable && 'cursor-pointer hover:scale-110'
          )}
        />
      );
    }

    return (
      <div className={indicatorClasses}>
        {indicatorContent}
      </div>
    );
  };

  // Render connector
  const renderConnector = (status: 'completed' | 'upcoming') => {
    if (!showConnector) return null;

    return (
      <div
        className={cn(
          'transition-all',
          currentSize.connectorLength,
          currentSize.connectorWidth,
          status === 'completed' ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700',
          orientation === 'vertical' && 'mx-auto',
          connectorClassName
        )}
      />
    );
  };

  // Render step
  const renderStep = (step: Step, index: number) => {
    const status = getStepStatus(step, index);
    const isClickable = clickable && !step.disabled && (step.onClick || step.href);
    const isLast = index === steps.length - 1;

    const stepContent = (
      <div
        className={cn(
          'flex items-center',
          orientation === 'horizontal' ? 'flex-col' : 'flex-row',
          currentSize.gap,
          mobileCollapse && orientation === 'horizontal' && 'md:flex',
          mobileCollapse && mobileShowCurrent && status !== 'current' && 'hidden'
        )}
      >
        {/* Step indicator */}
        {renderStepIndicator(step, index, status)}

        {/* Label and description */}
        {variant !== 'dotted' && (
          <div
            className={cn(
              orientation === 'horizontal' ? 'text-center' : 'text-left flex-1',
              labelClassName
            )}
          >
            <p
              className={cn(
                'font-medium',
                currentSize.text,
                status === 'completed' && 'text-neutral-700 dark:text-neutral-300',
                status === 'current' && 'text-neutral-900 dark:text-neutral-100',
                status === 'upcoming' && 'text-neutral-500 dark:text-neutral-400',
                status === 'error' && 'text-red-600 dark:text-red-400'
              )}
            >
              {step.label}
            </p>
            {showDescription && step.description && size !== 'sm' && (
              <p
                className={cn(
                  'text-xs text-neutral-500 dark:text-neutral-400 mt-0.5',
                  orientation === 'horizontal' && 'max-w-[120px]'
                )}
              >
                {step.description}
              </p>
            )}
          </div>
        )}

        {/* Screen reader label */}
        <span className="sr-only">
          {status === 'completed' && completedLabel}
          {status === 'current' && currentLabel}
          {status === 'upcoming' && upcomingLabel}
          {status === 'error' && errorLabel}
        </span>
      </div>
    );

    return (
      <div
        key={step.id}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-1 items-center' : 'flex-col'
        )}
      >
        {isClickable ? (
          <button
            onClick={() => handleStepClick(step, index)}
            disabled={step.disabled}
            className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
            aria-label={`${step.label}${status === 'current' ? ' - Current step' : ''}`}
          >
            {stepContent}
          </button>
        ) : (
          <div aria-current={status === 'current' ? 'step' : undefined}>
            {stepContent}
          </div>
        )}

        {/* Connector */}
        {!isLast && orientation === 'horizontal' && (
          <div className={cn('flex-1 px-2', mobileCollapse && 'hidden md:block')}>
            {renderConnector(status === 'completed' ? 'completed' : 'upcoming')}
          </div>
        )}
        {!isLast && orientation === 'vertical' && (
          <div className="py-2">
            {renderConnector(status === 'completed' ? 'completed' : 'upcoming')}
          </div>
        )}
      </div>
    );
  };

  // Mobile current step display
  const renderMobileCurrentStep = () => {
    if (!mobileCollapse || !mobileShowCurrent || orientation === 'vertical') {
      return null;
    }

    const current = steps[currentStepIndex];
    if (!current) return null;

    return (
      <div className="md:hidden mb-4 text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Step {currentStepIndex + 1} of {steps.length}
        </p>
        <p className="font-medium">{current.label}</p>
      </div>
    );
  };

  return (
    <nav
      className={cn(
        'w-full',
        className
      )}
      aria-label={ariaLabel || 'Progress steps'}
    >
      {renderMobileCurrentStep()}

      {/* Progress bar */}
      {progressBar && orientation === 'horizontal' && (
        <div className="mb-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}

      {/* Steps */}
      <ol
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'items-center justify-between' : 'flex-col',
          currentSize.gap
        )}
      >
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              orientation === 'horizontal' && 'flex-1',
              index === 0 && orientation === 'horizontal' && 'flex-initial'
            )}
          >
            {renderStep(step, index)}
          </li>
        ))}
      </ol>
    </nav>
  );
};

StepIndicator.displayName = 'StepIndicator';