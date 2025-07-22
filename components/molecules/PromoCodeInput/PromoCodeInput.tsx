import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '../../atoms/Input/Input';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';

export interface PromoCodeInputProps {
  onApply?: (code: string) => void | Promise<void>;
  onRemove?: () => void;
  
  // Applied code
  appliedCode?: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    description?: string;
  };
  
  // Display options
  label?: string;
  placeholder?: string;
  applyLabel?: string;
  removeLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  
  // Validation
  validateCode?: (code: string) => boolean | string;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  
  // States
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  
  // Behavior
  clearOnApply?: boolean;
  autoFocus?: boolean;
  
  // Styling
  className?: string;
  variant?: 'default' | 'inline';
  
  'aria-label'?: string;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  onApply,
  onRemove,
  appliedCode,
  discount,
  label = 'Promo code',
  placeholder = 'Enter promo code',
  applyLabel = 'Apply',
  removeLabel = 'Remove',
  size = 'md',
  validateCode,
  minLength = 3,
  maxLength = 20,
  pattern,
  loading = false,
  disabled = false,
  error: externalError,
  clearOnApply = true,
  autoFocus = false,
  className,
  variant = 'default',
  'aria-label': ariaLabel,
}) => {
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  
  const error = externalError || internalError;
  const isLoading = loading || isApplying;
  
  const handleApply = async () => {
    const trimmedCode = code.trim();
    
    // Basic validation
    if (!trimmedCode) {
      setInternalError('Please enter a promo code');
      return;
    }
    
    if (trimmedCode.length < minLength) {
      setInternalError(`Code must be at least ${minLength} characters`);
      return;
    }
    
    if (trimmedCode.length > maxLength) {
      setInternalError(`Code must be no more than ${maxLength} characters`);
      return;
    }
    
    if (pattern && !pattern.test(trimmedCode)) {
      setInternalError('Invalid promo code format');
      return;
    }
    
    // Custom validation
    if (validateCode) {
      const validationResult = validateCode(trimmedCode);
      if (validationResult !== true) {
        setInternalError(typeof validationResult === 'string' ? validationResult : 'Invalid promo code');
        return;
      }
    }
    
    // Clear error
    setInternalError(null);
    
    // Apply code
    if (onApply) {
      setIsApplying(true);
      try {
        await onApply(trimmedCode);
        if (clearOnApply && !appliedCode) {
          setCode('');
        }
      } catch (err) {
        // Error should be handled by parent component
      } finally {
        setIsApplying(false);
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !appliedCode) {
      e.preventDefault();
      handleApply();
    }
  };
  
  const handleChange = (value: string) => {
    setCode(value.toUpperCase());
    setInternalError(null);
  };
  
  // Size configurations
  const sizeConfigs = {
    sm: {
      input: 'h-8',
      button: 'h-8 px-3',
      text: 'text-sm',
    },
    md: {
      input: 'h-10',
      button: 'h-10 px-4',
      text: 'text-base',
    },
    lg: {
      input: 'h-12',
      button: 'h-12 px-5',
      text: 'text-lg',
    },
  };
  
  const currentSize = sizeConfigs[size];
  
  // Applied code display
  if (appliedCode && discount) {
    return (
      <div className={cn('space-y-2', className)}>
        {label && variant === 'default' && (
          <label className={cn('block font-medium', currentSize.text)}>
            {label}
          </label>
        )}
        
        <div className={cn(
          'flex items-center gap-3 p-3 rounded-md',
          'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
          currentSize.text
        )}>
          <Icon icon="check-circle" className="w-5 h-5 text-green-600 dark:text-green-400" />
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{appliedCode}</span>
              <Badge variant="success" size="sm">
                {discount.type === 'percentage' 
                  ? `-${discount.value}%`
                  : `-$${discount.value.toFixed(2)}`
                }
              </Badge>
            </div>
            {discount.description && (
              <p className="text-sm text-green-700 dark:text-green-300 mt-0.5">
                {discount.description}
              </p>
            )}
          </div>
          
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              disabled={disabled || isLoading}
              className="text-neutral-600 hover:text-red-600"
            >
              <Icon icon="x" className="w-4 h-4 mr-1" />
              {removeLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  // Input form
  return (
    <div className={cn('space-y-2', className)}>
      {label && variant === 'default' && (
        <label
          htmlFor="promo-code"
          className={cn('block font-medium', currentSize.text)}
        >
          {label}
        </label>
      )}
      
      <div className={cn(
        'flex',
        variant === 'default' ? 'gap-2' : 'gap-0'
      )}>
        <Input
          id="promo-code"
          type="text"
          value={code}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading || !!appliedCode}
          error={!!error}
          autoFocus={autoFocus}
          maxLength={maxLength}
          className={cn(
            currentSize.input,
            variant === 'inline' && 'rounded-r-none',
            'uppercase'
          )}
          aria-label={ariaLabel || label}
          aria-invalid={!!error}
          aria-describedby={error ? 'promo-code-error' : undefined}
        />
        
        <Button
          type="button"
          variant={variant === 'inline' ? 'default' : 'outline'}
          size="custom"
          onClick={handleApply}
          disabled={disabled || isLoading || !!appliedCode || !code.trim()}
          loading={isLoading}
          className={cn(
            currentSize.button,
            currentSize.text,
            variant === 'inline' && 'rounded-l-none'
          )}
        >
          {!isLoading && <Icon icon="tag" className="w-4 h-4 mr-1.5" />}
          {applyLabel}
        </Button>
      </div>
      
      {error && (
        <p
          id="promo-code-error"
          className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
        >
          <Icon icon="alert-circle" className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

PromoCodeInput.displayName = 'PromoCodeInput';