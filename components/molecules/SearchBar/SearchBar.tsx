import React, { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';

// SearchBar variants
const searchBarVariants = cva(
  'relative flex items-center bg-white border rounded-lg transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-10',
        md: 'h-12',
        lg: 'h-14',
      },
      variant: {
        default: 'border-neutral-300 focus-within:border-primary-500',
        filled: 'border-transparent bg-neutral-100 focus-within:bg-white focus-within:border-primary-500',
        minimal: 'border-transparent shadow-sm focus-within:shadow-md',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

// Types
export interface SearchCategory {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  category?: string;
  icon?: string;
  trending?: boolean;
}

export interface SearchBarProps extends VariantProps<typeof searchBarVariants> {
  placeholder?: string;
  value?: string;
  onSearch?: (query: string, category?: string) => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
  categories?: SearchCategory[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  suggestions?: SearchSuggestion[];
  showSuggestions?: boolean;
  recentSearches?: string[];
  trendingSearches?: string[];
  loading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  showCategoryDropdown?: boolean;
  showSearchButton?: boolean;
  searchButtonText?: string;
  maxSuggestions?: number;
}

// Suggestions dropdown component
const SuggestionsDropdown: React.FC<{
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  trendingSearches?: string[];
  isOpen: boolean;
  onSelect: (text: string) => void;
  query: string;
  maxSuggestions?: number;
}> = ({ 
  suggestions = [], 
  recentSearches = [], 
  trendingSearches = [], 
  isOpen, 
  onSelect, 
  query,
  maxSuggestions = 8 
}) => {
  if (!isOpen) return null;

  const hasContent = suggestions.length > 0 || recentSearches.length > 0 || trendingSearches.length > 0;
  if (!hasContent) return null;

  // Highlight matching text
  const highlightMatch = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-200 font-medium">{part}</mark> : part
    );
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {/* Search suggestions */}
      {suggestions.length > 0 && (
        <div className="p-2">
          {suggestions.slice(0, maxSuggestions).map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => onSelect(suggestion.text)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-md text-left transition-colors"
            >
              {suggestion.icon && <Icon icon={suggestion.icon} size="sm" className="text-neutral-400" />}
              <div className="flex-1">
                <span className="text-sm">{highlightMatch(suggestion.text)}</span>
                {suggestion.category && (
                  <span className="text-xs text-neutral-500 ml-2">in {suggestion.category}</span>
                )}
              </div>
              {suggestion.trending && (
                <Badge size="sm" variant="secondary">Trending</Badge>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Recent searches */}
      {recentSearches.length > 0 && query === '' && (
        <div className="border-t border-neutral-100">
          <div className="px-4 py-2">
            <h3 className="text-xs font-medium text-neutral-500 uppercase">Recent Searches</h3>
          </div>
          <div className="px-2 pb-2">
            {recentSearches.slice(0, 5).map((search, index) => (
              <button
                key={index}
                onClick={() => onSelect(search)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-md text-left transition-colors"
              >
                <Icon icon="clock" size="sm" className="text-neutral-400" />
                <span className="text-sm">{search}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending searches */}
      {trendingSearches.length > 0 && query === '' && (
        <div className="border-t border-neutral-100">
          <div className="px-4 py-2">
            <h3 className="text-xs font-medium text-neutral-500 uppercase">Trending</h3>
          </div>
          <div className="px-2 pb-2">
            {trendingSearches.slice(0, 5).map((search, index) => (
              <button
                key={index}
                onClick={() => onSelect(search)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 rounded-md text-left transition-colors"
              >
                <Icon icon="trendingUp" size="sm" className="text-primary-500" />
                <span className="text-sm">{search}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main SearchBar component
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({
    placeholder = 'Search products...',
    value,
    onSearch,
    onChange,
    onClear,
    categories = [],
    selectedCategory = '',
    onCategoryChange,
    suggestions = [],
    showSuggestions = true,
    recentSearches = [],
    trendingSearches = [],
    loading = false,
    disabled = false,
    autoFocus = false,
    className,
    inputClassName,
    dropdownClassName,
    showCategoryDropdown = true,
    showSearchButton = true,
    searchButtonText = 'Search',
    maxSuggestions = 8,
    size,
    variant,
    ...props
  }, ref) => {
    const [localValue, setLocalValue] = useState(value || '');
    const [isFocused, setIsFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync with external value
    useEffect(() => {
      if (value !== undefined) {
        setLocalValue(value);
      }
    }, [value]);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setShowDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange?.(newValue);
      setShowDropdown(true);
    };

    const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      onSearch?.(localValue, selectedCategory);
      setShowDropdown(false);
    };

    const handleClear = () => {
      setLocalValue('');
      onChange?.('');
      onClear?.();
      setShowDropdown(false);
    };

    const handleSuggestionSelect = (text: string) => {
      setLocalValue(text);
      onChange?.(text);
      onSearch?.(text, selectedCategory);
      setShowDropdown(false);
    };

    const handleCategorySelect = (category: string) => {
      onCategoryChange?.(category);
    };

    const selectedCategoryData = categories.find(cat => cat.value === selectedCategory);

    return (
      <div ref={containerRef} className="relative w-full">
        <form onSubmit={handleSubmit} className="w-full">
          <div className={cn(searchBarVariants({ size, variant }), className)}>
            {/* Category dropdown */}
            {showCategoryDropdown && categories.length > 0 && (
              <div className="flex items-center border-r border-neutral-200">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="h-full px-4 bg-transparent focus:outline-none text-sm"
                  disabled={disabled}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Search icon */}
            <div className="pl-4">
              <Icon icon="search" size="sm" className="text-neutral-400" />
            </div>

            {/* Input field */}
            <input
              ref={ref}
              type="text"
              value={localValue}
              onChange={handleInputChange}
              onFocus={() => {
                setIsFocused(true);
                setShowDropdown(true);
              }}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus}
              className={cn(
                'flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm',
                inputClassName
              )}
              {...props}
            />

            {/* Loading spinner */}
            {loading && (
              <div className="pr-3">
                <Icon icon="loader" size="sm" className="animate-spin text-neutral-400" />
              </div>
            )}

            {/* Clear button */}
            {localValue && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="pr-3 hover:opacity-70 transition-opacity"
                aria-label="Clear search"
              >
                <Icon icon="x" size="sm" className="text-neutral-400" />
              </button>
            )}

            {/* Search button */}
            {showSearchButton && (
              <div className="pr-2">
                <Button
                  type="submit"
                  size={size === 'sm' ? 'xs' : 'sm'}
                  disabled={disabled || loading}
                >
                  {searchButtonText}
                </Button>
              </div>
            )}
          </div>
        </form>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <SuggestionsDropdown
            suggestions={suggestions}
            recentSearches={recentSearches}
            trendingSearches={trendingSearches}
            isOpen={showDropdown && isFocused}
            onSelect={handleSuggestionSelect}
            query={localValue}
            maxSuggestions={maxSuggestions}
          />
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

// Hook for managing search state
export const useSearchBar = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const addRecentSearch = (search: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== search);
      return [search, ...filtered].slice(0, 10);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const search = async (searchQuery: string, searchCategory?: string) => {
    setQuery(searchQuery);
    if (searchCategory !== undefined) setCategory(searchCategory);
    addRecentSearch(searchQuery);
    
    // Implement search logic here
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  };

  return {
    query,
    category,
    recentSearches,
    suggestions,
    loading,
    setQuery,
    setCategory,
    setSuggestions,
    search,
    clearRecentSearches,
  };
};