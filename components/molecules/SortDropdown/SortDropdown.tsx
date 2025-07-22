import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';

export interface SortOption {
  value: string;
  label: string;
  icon?: string;
  direction?: 'asc' | 'desc';
  badge?: string;
}

export interface SortDropdownProps {
  options: SortOption[];
  value?: string;
  onChange?: (value: string) => void;
  
  // Display options
  label?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showDirection?: boolean;
  
  // Behavior
  disabled?: boolean;
  loading?: boolean;
  
  // Styling
  className?: string;
  dropdownClassName?: string;
  fullWidth?: boolean;
  align?: 'start' | 'end';
  
  'aria-label'?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  value,
  onChange,
  label = 'Sort by',
  placeholder = 'Select sort order',
  size = 'md',
  variant = 'default',
  showDirection = true,
  disabled = false,
  loading = false,
  className,
  dropdownClassName,
  fullWidth = false,
  align = 'end',
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Find current option
  const currentOption = options.find(opt => opt.value === value);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };
  
  const handleOptionClick = (option: SortOption) => {
    onChange?.(option.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };
  
  // Size styles
  const sizeStyles = {
    sm: {
      button: 'px-3 py-1.5 text-sm gap-1.5',
      icon: 'w-4 h-4',
      dropdown: 'py-1',
      option: 'px-3 py-1.5 text-sm',
    },
    md: {
      button: 'px-4 py-2 text-base gap-2',
      icon: 'w-5 h-5',
      dropdown: 'py-1.5',
      option: 'px-4 py-2 text-base',
    },
    lg: {
      button: 'px-5 py-2.5 text-lg gap-2.5',
      icon: 'w-6 h-6',
      dropdown: 'py-2',
      option: 'px-5 py-2.5 text-lg',
    },
  };
  
  // Variant styles
  const variantStyles = {
    default: cn(
      'bg-white dark:bg-neutral-900',
      'border border-neutral-200 dark:border-neutral-700',
      'hover:bg-neutral-50 dark:hover:bg-neutral-800',
      'shadow-sm'
    ),
    outline: cn(
      'border border-neutral-200 dark:border-neutral-700',
      'hover:bg-neutral-50 dark:hover:bg-neutral-800'
    ),
    ghost: cn(
      'hover:bg-neutral-100 dark:hover:bg-neutral-800'
    ),
  };
  
  const currentSize = sizeStyles[size];
  
  return (
    <div
      ref={dropdownRef}
      className={cn('relative', fullWidth && 'w-full', className)}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        aria-label={ariaLabel || label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'flex items-center justify-between',
          'rounded-md font-medium transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          currentSize.button,
          fullWidth && 'w-full'
        )}
      >
        <span className="flex items-center gap-2">
          {label && <span className="text-neutral-600 dark:text-neutral-400">{label}:</span>}
          {loading ? (
            <span className="flex items-center gap-2">
              <Icon icon="loader" className={cn(currentSize.icon, 'animate-spin')} />
              <span>Loading...</span>
            </span>
          ) : currentOption ? (
            <span className="flex items-center gap-2">
              {currentOption.icon && (
                <Icon icon={currentOption.icon} className={currentSize.icon} />
              )}
              <span>{currentOption.label}</span>
              {showDirection && currentOption.direction && (
                <Icon
                  icon={currentOption.direction === 'asc' ? 'arrow-up' : 'arrow-down'}
                  className={cn(currentSize.icon, 'text-neutral-500')}
                />
              )}
              {currentOption.badge && (
                <Badge size="sm" variant="secondary">
                  {currentOption.badge}
                </Badge>
              )}
            </span>
          ) : (
            <span className="text-neutral-500">{placeholder}</span>
          )}
        </span>
        <Icon
          icon="chevron-down"
          className={cn(
            currentSize.icon,
            'transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && !disabled && !loading && (
        <div
          role="listbox"
          aria-label={`${label} options`}
          className={cn(
            'absolute z-50 mt-1 w-full min-w-[200px]',
            'bg-white dark:bg-neutral-900',
            'border border-neutral-200 dark:border-neutral-700',
            'rounded-md shadow-lg',
            'overflow-hidden',
            currentSize.dropdown,
            align === 'end' && 'right-0',
            dropdownClassName
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleOptionClick(option)}
                className={cn(
                  'w-full flex items-center justify-between',
                  'transition-colors',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                  'focus:bg-neutral-50 dark:focus:bg-neutral-800 focus:outline-none',
                  isSelected && 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
                  currentSize.option
                )}
              >
                <span className="flex items-center gap-2">
                  {option.icon && (
                    <Icon icon={option.icon} className={currentSize.icon} />
                  )}
                  <span>{option.label}</span>
                </span>
                <span className="flex items-center gap-2">
                  {option.badge && (
                    <Badge size="sm" variant={isSelected ? 'default' : 'secondary'}>
                      {option.badge}
                    </Badge>
                  )}
                  {showDirection && option.direction && (
                    <Icon
                      icon={option.direction === 'asc' ? 'arrow-up' : 'arrow-down'}
                      className={cn(
                        currentSize.icon,
                        isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400'
                      )}
                    />
                  )}
                  {isSelected && (
                    <Icon
                      icon="check"
                      className={cn(currentSize.icon, 'text-primary-600 dark:text-primary-400')}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

SortDropdown.displayName = 'SortDropdown';