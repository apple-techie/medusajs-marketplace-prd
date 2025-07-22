import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../Icon/Icon';

export type ViewMode = 'grid' | 'list';

export interface ViewToggleProps {
  value: ViewMode;
  onChange?: (value: ViewMode) => void;
  
  // Display options
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showLabels?: boolean;
  
  // Behavior
  disabled?: boolean;
  
  // Labels
  gridLabel?: string;
  listLabel?: string;
  
  // Styling
  className?: string;
  
  'aria-label'?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  value,
  onChange,
  size = 'md',
  variant = 'default',
  showLabels = false,
  disabled = false,
  gridLabel = 'Grid view',
  listLabel = 'List view',
  className,
  'aria-label': ariaLabel,
}) => {
  // Size styles
  const sizeStyles = {
    sm: {
      container: 'p-0.5',
      button: showLabels ? 'px-3 py-1 text-sm gap-1.5' : 'p-1',
      icon: 'w-4 h-4',
    },
    md: {
      container: 'p-1',
      button: showLabels ? 'px-4 py-1.5 text-base gap-2' : 'p-1.5',
      icon: 'w-5 h-5',
    },
    lg: {
      container: 'p-1',
      button: showLabels ? 'px-5 py-2 text-lg gap-2.5' : 'p-2',
      icon: 'w-6 h-6',
    },
  };
  
  // Variant styles
  const variantStyles = {
    default: {
      container: 'bg-neutral-100 dark:bg-neutral-800',
      active: 'bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-neutral-100',
      inactive: 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100',
    },
    outline: {
      container: 'border border-neutral-200 dark:border-neutral-700',
      active: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
      inactive: 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800',
    },
    ghost: {
      container: '',
      active: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
      inactive: 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800',
    },
  };
  
  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];
  
  const handleClick = (mode: ViewMode) => {
    if (!disabled && mode !== value) {
      onChange?.(mode);
    }
  };
  
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel || 'View mode'}
      className={cn(
        'inline-flex rounded-md',
        currentVariant.container,
        currentSize.container,
        disabled && 'opacity-50',
        className
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === 'grid'}
        aria-label={gridLabel}
        disabled={disabled}
        onClick={() => handleClick('grid')}
        className={cn(
          'flex items-center justify-center rounded-md transition-all',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed',
          currentSize.button,
          value === 'grid' ? currentVariant.active : currentVariant.inactive
        )}
      >
        <Icon icon="grid" className={currentSize.icon} />
        {showLabels && <span>Grid</span>}
      </button>
      
      <button
        type="button"
        role="radio"
        aria-checked={value === 'list'}
        aria-label={listLabel}
        disabled={disabled}
        onClick={() => handleClick('list')}
        className={cn(
          'flex items-center justify-center rounded-md transition-all',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed',
          currentSize.button,
          value === 'list' ? currentVariant.active : currentVariant.inactive
        )}
      >
        <Icon icon="list" className={currentSize.icon} />
        {showLabels && <span>List</span>}
      </button>
    </div>
  );
};

ViewToggle.displayName = 'ViewToggle';