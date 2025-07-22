import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';

export interface Filter {
  id: string;
  type: string;
  label: string;
  value: string | string[];
  displayValue?: string;
}

export interface ActiveFiltersProps {
  filters: Filter[];
  onRemove?: (filterId: string) => void;
  onClearAll?: () => void;
  
  // Display options
  showClearAll?: boolean;
  showCount?: boolean;
  collapsible?: boolean;
  maxVisible?: number;
  
  // Labels
  clearAllLabel?: string;
  showMoreLabel?: string;
  showLessLabel?: string;
  countLabel?: string;
  
  // Styling
  className?: string;
  filterClassName?: string;
  variant?: 'default' | 'compact';
  
  'aria-label'?: string;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemove,
  onClearAll,
  showClearAll = true,
  showCount = true,
  collapsible = true,
  maxVisible = 5,
  clearAllLabel = 'Clear all',
  showMoreLabel = 'Show more',
  showLessLabel = 'Show less',
  countLabel = 'filters',
  className,
  filterClassName,
  variant = 'default',
  'aria-label': ariaLabel,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  if (filters.length === 0) {
    return null;
  }
  
  // Determine which filters to show
  const shouldCollapse = collapsible && filters.length > maxVisible;
  const visibleFilters = shouldCollapse && !isExpanded 
    ? filters.slice(0, maxVisible)
    : filters;
  const hiddenCount = filters.length - maxVisible;
  
  const handleRemove = (filterId: string) => {
    onRemove?.(filterId);
    
    // Collapse if we're below the threshold after removal
    if (isExpanded && filters.length - 1 <= maxVisible) {
      setIsExpanded(false);
    }
  };
  
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        className
      )}
      aria-label={ariaLabel || 'Active filters'}
    >
      {/* Filter count */}
      {showCount && (
        <span className="text-sm text-neutral-600 dark:text-neutral-400 mr-2">
          {filters.length} {filters.length === 1 ? 'filter' : countLabel}:
        </span>
      )}
      
      {/* Filter badges */}
      {visibleFilters.map((filter) => (
        <Badge
          key={filter.id}
          variant="secondary"
          className={cn(
            'group/filter pr-1',
            variant === 'compact' ? 'text-xs' : '',
            filterClassName
          )}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-600 dark:text-neutral-400">
              {filter.label}:
            </span>
            <span className="font-medium">
              {filter.displayValue || (
                Array.isArray(filter.value) 
                  ? filter.value.join(', ')
                  : filter.value
              )}
            </span>
            {onRemove && (
              <button
                type="button"
                onClick={() => handleRemove(filter.id)}
                className={cn(
                  'ml-1 p-0.5 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600',
                  'transition-colors focus:outline-none focus-visible:ring-2',
                  'focus-visible:ring-primary-500 focus-visible:ring-offset-1'
                )}
                aria-label={`Remove ${filter.label} filter`}
              >
                <Icon 
                  icon="x" 
                  className={cn(
                    variant === 'compact' ? 'w-3 h-3' : 'w-3.5 h-3.5'
                  )} 
                />
              </button>
            )}
          </span>
        </Badge>
      ))}
      
      {/* Show more/less button */}
      {shouldCollapse && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-600 dark:text-primary-400 px-2"
        >
          {isExpanded ? (
            <>
              {showLessLabel}
              <Icon icon="chevron-up" className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>
              {showMoreLabel} ({hiddenCount})
              <Icon icon="chevron-down" className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      )}
      
      {/* Clear all button */}
      {showClearAll && onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
        >
          <Icon icon="x-circle" className="w-4 h-4 mr-1" />
          {clearAllLabel}
        </Button>
      )}
    </div>
  );
};

ActiveFilters.displayName = 'ActiveFilters';