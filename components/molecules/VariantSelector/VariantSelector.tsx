import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import { RadioButton } from '../../atoms/RadioButton/RadioButton';

export interface VariantOption {
  value: string;
  label: string;
  available?: boolean;
  price?: number;
  originalPrice?: number;
  color?: string;
  image?: string;
  stock?: number;
  metadata?: Record<string, any>;
}

export interface VariantGroup {
  id: string;
  name: string;
  type: 'color' | 'size' | 'text' | 'image';
  options: VariantOption[];
  required?: boolean;
}

export interface VariantSelectorProps {
  groups: VariantGroup[];
  selected?: Record<string, string>;
  
  // Display options
  variant?: 'default' | 'compact' | 'inline';
  layout?: 'vertical' | 'horizontal';
  
  // Visual options
  showPrice?: boolean;
  showStock?: boolean;
  showImages?: boolean;
  imageSize?: 'sm' | 'md' | 'lg';
  colorSize?: 'sm' | 'md' | 'lg';
  
  // Behavior
  disableUnavailable?: boolean;
  singleGroup?: boolean;
  
  // Labels
  outOfStockLabel?: string;
  lowStockThreshold?: number;
  lowStockLabel?: string;
  selectLabel?: string;
  
  // Callbacks
  onChange?: (groupId: string, value: string) => void;
  onComplete?: (selections: Record<string, string>) => void;
  
  // Styling
  className?: string;
  groupClassName?: string;
  optionClassName?: string;
  
  'aria-label'?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  groups,
  selected = {},
  variant = 'default',
  layout = 'vertical',
  showPrice = true,
  showStock = false,
  showImages = true,
  imageSize = 'md',
  colorSize = 'md',
  disableUnavailable = false,
  singleGroup = false,
  outOfStockLabel = 'Out of stock',
  lowStockThreshold = 5,
  lowStockLabel = 'Low stock',
  selectLabel = 'Select',
  onChange,
  onComplete,
  className,
  groupClassName,
  optionClassName,
  'aria-label': ariaLabel,
}) => {
  const [localSelected, setLocalSelected] = useState<Record<string, string>>(selected);

  // Handle selection change
  const handleChange = (groupId: string, value: string) => {
    const newSelected = { ...localSelected, [groupId]: value };
    setLocalSelected(newSelected);
    onChange?.(groupId, value);

    // Check if all required groups have selections
    const requiredGroups = groups.filter(g => g.required !== false);
    const hasAllRequired = requiredGroups.every(g => newSelected[g.id]);
    
    if (hasAllRequired) {
      onComplete?.(newSelected);
    }
  };

  // Size classes
  const imageSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const colorSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  // Get stock status
  const getStockStatus = (option: VariantOption) => {
    if (!option.available || option.stock === 0) {
      return { status: 'out', label: outOfStockLabel };
    }
    if (option.stock && option.stock <= lowStockThreshold) {
      return { status: 'low', label: `${lowStockLabel} (${option.stock})` };
    }
    return { status: 'in', label: null };
  };

  // Render color option
  const renderColorOption = (group: VariantGroup, option: VariantOption) => {
    const isSelected = localSelected[group.id] === option.value;
    const isDisabled = disableUnavailable && !option.available;
    const stockStatus = getStockStatus(option);

    return (
      <button
        key={option.value}
        className={cn(
          'relative rounded-full border-2 transition-all',
          isSelected ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2' : 'border-neutral-300 dark:border-neutral-600',
          isDisabled && 'opacity-50 cursor-not-allowed',
          !isDisabled && !isSelected && 'hover:border-neutral-400 dark:hover:border-neutral-500',
          colorSizeClasses[colorSize],
          optionClassName
        )}
        style={{ backgroundColor: option.color }}
        onClick={() => !isDisabled && handleChange(group.id, option.value)}
        disabled={isDisabled}
        title={option.label}
        aria-label={`${option.label} ${stockStatus.label || ''}`}
        aria-pressed={isSelected}
      >
        {isDisabled && (
          <div className="absolute inset-0 rounded-full bg-neutral-900/60 flex items-center justify-center">
            <Icon icon="x" size="xs" className="text-white" />
          </div>
        )}
        {isSelected && (
          <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center">
            <Icon icon="check" size="xs" className="text-white drop-shadow-md" />
          </div>
        )}
      </button>
    );
  };

  // Render size option
  const renderSizeOption = (group: VariantGroup, option: VariantOption) => {
    const isSelected = localSelected[group.id] === option.value;
    const isDisabled = disableUnavailable && !option.available;
    const stockStatus = getStockStatus(option);

    return (
      <button
        key={option.value}
        className={cn(
          'relative px-4 py-2 rounded-md border transition-all min-w-[3rem]',
          isSelected 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
            : 'border-neutral-300 dark:border-neutral-600',
          isDisabled && 'opacity-50 cursor-not-allowed line-through',
          !isDisabled && !isSelected && 'hover:border-neutral-400 dark:hover:border-neutral-500',
          variant === 'compact' && 'px-3 py-1.5 text-sm',
          optionClassName
        )}
        onClick={() => !isDisabled && handleChange(group.id, option.value)}
        disabled={isDisabled}
        aria-label={`${option.label} ${stockStatus.label || ''}`}
        aria-pressed={isSelected}
      >
        <span className="font-medium">{option.label}</span>
        {showStock && stockStatus.label && (
          <span className={cn(
            'block text-xs mt-0.5',
            stockStatus.status === 'out' && 'text-red-600 dark:text-red-400',
            stockStatus.status === 'low' && 'text-orange-600 dark:text-orange-400'
          )}>
            {stockStatus.label}
          </span>
        )}
      </button>
    );
  };

  // Render image option
  const renderImageOption = (group: VariantGroup, option: VariantOption) => {
    const isSelected = localSelected[group.id] === option.value;
    const isDisabled = disableUnavailable && !option.available;
    const stockStatus = getStockStatus(option);

    return (
      <button
        key={option.value}
        className={cn(
          'relative rounded-lg overflow-hidden border-2 transition-all',
          isSelected ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2' : 'border-neutral-300 dark:border-neutral-600',
          isDisabled && 'opacity-50 cursor-not-allowed',
          !isDisabled && !isSelected && 'hover:border-neutral-400 dark:hover:border-neutral-500',
          imageSizeClasses[imageSize],
          optionClassName
        )}
        onClick={() => !isDisabled && handleChange(group.id, option.value)}
        disabled={isDisabled}
        aria-label={`${option.label} ${stockStatus.label || ''}`}
        aria-pressed={isSelected}
      >
        {option.image ? (
          <img
            src={option.image}
            alt={option.label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {option.label}
            </span>
          </div>
        )}
        {isDisabled && (
          <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center">
            <Icon icon="x" size="sm" className="text-white" />
          </div>
        )}
        {isSelected && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Icon icon="check" size="sm" className="text-white drop-shadow-md" />
          </div>
        )}
      </button>
    );
  };

  // Render text option
  const renderTextOption = (group: VariantGroup, option: VariantOption) => {
    const isSelected = localSelected[group.id] === option.value;
    const isDisabled = disableUnavailable && !option.available;
    const stockStatus = getStockStatus(option);

    if (variant === 'inline') {
      return (
        <label
          key={option.value}
          className={cn(
            'flex items-center gap-2',
            isDisabled && 'opacity-50 cursor-not-allowed',
            optionClassName
          )}
        >
          <RadioButton
            checked={isSelected}
            onChange={() => !isDisabled && handleChange(group.id, option.value)}
            disabled={isDisabled}
            aria-label={`${option.label} ${stockStatus.label || ''}`}
          />
          <span className={cn(isDisabled && 'line-through')}>
            {option.label}
          </span>
          {showPrice && option.price && (
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              ${option.price.toFixed(2)}
            </span>
          )}
          {showStock && stockStatus.label && (
            <span className={cn(
              'text-sm',
              stockStatus.status === 'out' && 'text-red-600 dark:text-red-400',
              stockStatus.status === 'low' && 'text-orange-600 dark:text-orange-400'
            )}>
              {stockStatus.label}
            </span>
          )}
        </label>
      );
    }

    return renderSizeOption(group, option);
  };

  // Render option based on type
  const renderOption = (group: VariantGroup, option: VariantOption) => {
    switch (group.type) {
      case 'color':
        return renderColorOption(group, option);
      case 'size':
        return renderSizeOption(group, option);
      case 'image':
        return showImages ? renderImageOption(group, option) : renderSizeOption(group, option);
      default:
        return renderTextOption(group, option);
    }
  };

  // Single group mode
  if (singleGroup && groups.length === 1) {
    const group = groups[0];
    return (
      <div className={className} aria-label={ariaLabel || `Select ${group.name}`}>
        <div className={cn(
          'flex flex-wrap gap-2',
          layout === 'horizontal' && 'flex-row',
          layout === 'vertical' && 'flex-col'
        )}>
          {group.options.map(option => renderOption(group, option))}
        </div>
      </div>
    );
  }

  // Multiple groups
  return (
    <div
      className={cn(
        'space-y-4',
        variant === 'compact' && 'space-y-3',
        className
      )}
      aria-label={ariaLabel || 'Select product variants'}
    >
      {groups.map((group) => {
        const selectedOption = group.options.find(o => o.value === localSelected[group.id]);
        
        return (
          <div key={group.id} className={groupClassName}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                {group.name}
                {group.required !== false && (
                  <span className="text-red-500 ml-1" aria-label="required">*</span>
                )}
              </label>
              {selectedOption && (
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {selectedOption.label}
                  {showPrice && selectedOption.price && (
                    <span className="ml-1">
                      ${selectedOption.price.toFixed(2)}
                    </span>
                  )}
                </span>
              )}
            </div>
            
            <div className={cn(
              'flex flex-wrap gap-2',
              variant === 'inline' && group.type === 'text' && 'flex-col gap-3'
            )}>
              {group.options.map(option => renderOption(group, option))}
            </div>
          </div>
        );
      })}
      
      {/* Summary of selections */}
      {variant === 'default' && Object.keys(localSelected).length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {selectLabel}: {' '}
            {groups
              .filter(g => localSelected[g.id])
              .map(g => {
                const option = g.options.find(o => o.value === localSelected[g.id]);
                return option?.label;
              })
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

VariantSelector.displayName = 'VariantSelector';