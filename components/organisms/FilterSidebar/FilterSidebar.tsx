import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import { Divider } from '../../atoms/Divider/Divider';
import { StarRating } from '../../atoms/StarRating/StarRating';
import { Price } from '../../atoms/Price/Price';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'range' | 'rating' | 'color' | 'size';
  options?: FilterOption[];
  range?: PriceRange;
  expanded?: boolean;
  icon?: string;
}

export interface AppliedFilter {
  sectionId: string;
  value: string | number | PriceRange;
  label?: string;
}

export interface FilterSidebarProps {
  sections: FilterSection[];
  appliedFilters?: AppliedFilter[];
  
  // Display options
  variant?: 'default' | 'compact' | 'minimal';
  showClearAll?: boolean;
  showAppliedFilters?: boolean;
  showResultCount?: boolean;
  resultCount?: number;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  
  // Mobile options
  mobileAsModal?: boolean;
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
  
  // Callbacks
  onFilterChange?: (filters: AppliedFilter[]) => void;
  onClearAll?: () => void;
  onApplyFilters?: () => void;
  
  // Styling
  className?: string;
  sectionClassName?: string;
  
  'aria-label'?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  sections,
  appliedFilters = [],
  variant = 'default',
  showClearAll = true,
  showAppliedFilters = true,
  showResultCount = false,
  resultCount = 0,
  collapsible = true,
  defaultExpanded = true,
  mobileAsModal = true,
  mobileBreakpoint = 'lg',
  onFilterChange,
  onClearAll,
  onApplyFilters,
  className,
  sectionClassName,
  'aria-label': ariaLabel,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [localFilters, setLocalFilters] = useState<AppliedFilter[]>(appliedFilters);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<Record<string, PriceRange>>({});

  // Initialize expanded sections
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach(section => {
      initial[section.id] = section.expanded !== undefined ? section.expanded : defaultExpanded;
    });
    setExpandedSections(initial);
  }, [sections, defaultExpanded]);

  // Initialize price ranges
  useEffect(() => {
    const ranges: Record<string, PriceRange> = {};
    sections.forEach(section => {
      if (section.type === 'range' && section.range) {
        const existingFilter = localFilters.find(f => f.sectionId === section.id);
        ranges[section.id] = existingFilter?.value as PriceRange || section.range;
      }
    });
    setPriceRange(ranges);
  }, [sections, localFilters]);

  // Sync with external applied filters
  useEffect(() => {
    setLocalFilters(appliedFilters);
  }, [appliedFilters]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    if (!collapsible) return;
    
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Check if filter is applied
  const isFilterApplied = (sectionId: string, value: string) => {
    return localFilters.some(f => f.sectionId === sectionId && f.value === value);
  };

  // Apply filter
  const applyFilter = (section: FilterSection, value: string | number | PriceRange, label?: string) => {
    let newFilters = [...localFilters];
    
    if (section.type === 'radio' || section.type === 'range' || section.type === 'rating') {
      // Replace existing filter for this section
      newFilters = newFilters.filter(f => f.sectionId !== section.id);
      if (value !== null && value !== undefined) {
        newFilters.push({ sectionId: section.id, value, label });
      }
    } else {
      // Toggle filter for checkbox types
      const existingIndex = newFilters.findIndex(
        f => f.sectionId === section.id && f.value === value
      );
      
      if (existingIndex >= 0) {
        newFilters.splice(existingIndex, 1);
      } else {
        newFilters.push({ sectionId: section.id, value, label });
      }
    }
    
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // Remove specific filter
  const removeFilter = (filter: AppliedFilter) => {
    const newFilters = localFilters.filter(
      f => !(f.sectionId === filter.sectionId && f.value === filter.value)
    );
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setLocalFilters([]);
    onFilterChange?.([]);
    onClearAll?.();
    
    // Reset price ranges
    const ranges: Record<string, PriceRange> = {};
    sections.forEach(section => {
      if (section.type === 'range' && section.range) {
        ranges[section.id] = section.range;
      }
    });
    setPriceRange(ranges);
  };

  // Render checkbox options
  const renderCheckboxOptions = (section: FilterSection) => {
    if (!section.options) return null;

    return (
      <div className="space-y-2">
        {section.options.map(option => {
          const isChecked = isFilterApplied(section.id, option.value);
          
          return (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => applyFilter(section, option.value, option.label)}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm">{option.label}</span>
              {option.count !== undefined && (
                <span className="text-xs text-neutral-500 ml-auto">
                  ({option.count})
                </span>
              )}
            </label>
          );
        })}
      </div>
    );
  };

  // Render radio options
  const renderRadioOptions = (section: FilterSection) => {
    if (!section.options) return null;

    const selectedValue = localFilters.find(f => f.sectionId === section.id)?.value;

    return (
      <div className="space-y-2">
        {section.options.map(option => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <input
              type="radio"
              name={section.id}
              checked={selectedValue === option.value}
              onChange={() => applyFilter(section, option.value, option.label)}
              className="border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">{option.label}</span>
            {option.count !== undefined && (
              <span className="text-xs text-neutral-500 ml-auto">
                ({option.count})
              </span>
            )}
          </label>
        ))}
      </div>
    );
  };

  // Render price range
  const renderPriceRange = (section: FilterSection) => {
    if (!section.range) return null;

    const currentRange = priceRange[section.id] || section.range;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs text-neutral-600 dark:text-neutral-400">Min</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                $
              </span>
              <input
                type="number"
                value={currentRange.min}
                onChange={(e) => {
                  const newRange = { ...currentRange, min: Number(e.target.value) };
                  setPriceRange(prev => ({ ...prev, [section.id]: newRange }));
                }}
                onBlur={() => applyFilter(section, currentRange)}
                min={section.range.min}
                max={currentRange.max}
                className="w-full pl-7 pr-3 py-1.5 text-sm border border-neutral-200 dark:border-neutral-800 rounded-md"
              />
            </div>
          </div>
          
          <span className="text-neutral-400 mt-6">-</span>
          
          <div className="flex-1">
            <label className="text-xs text-neutral-600 dark:text-neutral-400">Max</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                $
              </span>
              <input
                type="number"
                value={currentRange.max}
                onChange={(e) => {
                  const newRange = { ...currentRange, max: Number(e.target.value) };
                  setPriceRange(prev => ({ ...prev, [section.id]: newRange }));
                }}
                onBlur={() => applyFilter(section, currentRange)}
                min={currentRange.min}
                max={section.range.max}
                className="w-full pl-7 pr-3 py-1.5 text-sm border border-neutral-200 dark:border-neutral-800 rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div className="relative pt-1">
          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full">
            <div
              className="absolute h-2 bg-primary-600 rounded-full"
              style={{
                left: `${((currentRange.min - section.range.min) / (section.range.max - section.range.min)) * 100}%`,
                right: `${100 - ((currentRange.max - section.range.min) / (section.range.max - section.range.min)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render rating filter
  const renderRatingFilter = (section: FilterSection) => {
    const selectedRating = localFilters.find(f => f.sectionId === section.id)?.value as number;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map(rating => (
          <label
            key={rating}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <input
              type="radio"
              name={section.id}
              checked={selectedRating === rating}
              onChange={() => applyFilter(section, rating, `${rating}+ stars`)}
              className="sr-only"
            />
            <StarRating rating={rating} size="sm" readOnly />
            <span className="text-sm">& up</span>
          </label>
        ))}
      </div>
    );
  };

  // Render color filter
  const renderColorFilter = (section: FilterSection) => {
    if (!section.options) return null;

    return (
      <div className="grid grid-cols-6 gap-2">
        {section.options.map(option => {
          const isSelected = isFilterApplied(section.id, option.value);
          
          return (
            <button
              key={option.value}
              onClick={() => applyFilter(section, option.value, option.label)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all',
                isSelected ? 'border-primary-600 scale-110' : 'border-transparent',
                'hover:scale-110'
              )}
              style={{ backgroundColor: option.value }}
              title={option.label}
              aria-label={`Filter by ${option.label} color`}
            >
              {isSelected && (
                <Icon icon="check" size="xs" className="text-white mx-auto" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // Render size filter
  const renderSizeFilter = (section: FilterSection) => {
    if (!section.options) return null;

    return (
      <div className="grid grid-cols-4 gap-2">
        {section.options.map(option => {
          const isSelected = isFilterApplied(section.id, option.value);
          
          return (
            <button
              key={option.value}
              onClick={() => applyFilter(section, option.value, option.label)}
              className={cn(
                'py-2 px-3 text-sm rounded-md border transition-all',
                isSelected
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-primary-600'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  };

  // Render filter section content
  const renderSectionContent = (section: FilterSection) => {
    switch (section.type) {
      case 'checkbox':
        return renderCheckboxOptions(section);
      case 'radio':
        return renderRadioOptions(section);
      case 'range':
        return renderPriceRange(section);
      case 'rating':
        return renderRatingFilter(section);
      case 'color':
        return renderColorFilter(section);
      case 'size':
        return renderSizeFilter(section);
      default:
        return null;
    }
  };

  // Render section
  const renderSection = (section: FilterSection) => {
    const isExpanded = expandedSections[section.id] ?? true;

    return (
      <div key={section.id} className={cn('border-b border-neutral-200 dark:border-neutral-800 pb-4', sectionClassName)}>
        <button
          onClick={() => toggleSection(section.id)}
          className="flex items-center justify-between w-full py-2 text-left hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          aria-expanded={isExpanded}
          aria-controls={`filter-section-${section.id}`}
        >
          <span className="font-medium flex items-center gap-2">
            {section.icon && <Icon icon={section.icon} size="sm" />}
            {section.title}
          </span>
          {collapsible && (
            <Icon
              icon="chevron-down"
              size="xs"
              className={cn(
                'transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          )}
        </button>
        
        {isExpanded && (
          <div id={`filter-section-${section.id}`} className="mt-3">
            {renderSectionContent(section)}
          </div>
        )}
      </div>
    );
  };

  // Render applied filters
  const renderAppliedFilters = () => {
    if (!showAppliedFilters || localFilters.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Applied Filters</h4>
          {showClearAll && (
            <Button
              variant="ghost"
              size="xs"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {localFilters.map((filter, index) => (
            <Badge
              key={`${filter.sectionId}-${filter.value}-${index}`}
              variant="default"
              size="sm"
              className="gap-1"
            >
              {filter.label || String(filter.value)}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-1 hover:text-red-600"
                aria-label={`Remove ${filter.label || filter.value} filter`}
              >
                <Icon icon="x" size="xs" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  // Render content
  const renderContent = () => (
    <>
      {renderAppliedFilters()}
      
      <div className="space-y-1">
        {sections.map(section => renderSection(section))}
      </div>
      
      {showResultCount && (
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {resultCount.toLocaleString()} results
          </p>
        </div>
      )}
      
      {onApplyFilters && (
        <div className="mt-6">
          <Button
            variant="primary"
            size="sm"
            onClick={onApplyFilters}
            className="w-full"
          >
            Apply Filters
          </Button>
        </div>
      )}
    </>
  );

  // Mobile modal wrapper
  if (mobileAsModal) {
    return (
      <>
        {/* Mobile trigger button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className={cn(
            'fixed bottom-4 left-1/2 -translate-x-1/2 z-40',
            mobileBreakpoint === 'sm' && 'sm:hidden',
            mobileBreakpoint === 'md' && 'md:hidden',
            mobileBreakpoint === 'lg' && 'lg:hidden'
          )}
        >
          <Icon icon="filter" size="sm" className="mr-2" />
          Filters
          {localFilters.length > 0 && (
            <Badge variant="primary" size="xs" className="ml-2">
              {localFilters.length}
            </Badge>
          )}
        </Button>

        {/* Mobile modal */}
        {isMobileOpen && (
          <div className={cn(
            'fixed inset-0 z-50',
            mobileBreakpoint === 'sm' && 'sm:hidden',
            mobileBreakpoint === 'md' && 'md:hidden',
            mobileBreakpoint === 'lg' && 'lg:hidden'
          )}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-neutral-900 shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-full w-8 h-8 p-0"
                >
                  <Icon icon="x" size="sm" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
                {renderContent()}
              </div>
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <aside
          className={cn(
            'sticky top-4',
            mobileBreakpoint === 'sm' && 'hidden sm:block',
            mobileBreakpoint === 'md' && 'hidden md:block',
            mobileBreakpoint === 'lg' && 'hidden lg:block',
            className
          )}
          aria-label={ariaLabel || 'Product filters'}
        >
          {renderContent()}
        </aside>
      </>
    );
  }

  // Desktop only sidebar
  return (
    <aside
      className={cn('sticky top-4', className)}
      aria-label={ariaLabel || 'Product filters'}
    >
      {renderContent()}
    </aside>
  );
};

FilterSidebar.displayName = 'FilterSidebar';