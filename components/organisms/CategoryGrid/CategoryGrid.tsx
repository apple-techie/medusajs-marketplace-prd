import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { CategoryCard } from '../../molecules/CategoryCard/CategoryCard';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import { Badge } from '../../atoms/Badge/Badge';

export interface Category {
  id: string | number;
  title: string;
  description?: string;
  href: string;
  image?: string;
  icon?: string;
  productCount?: number;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  subcategories?: string[];
  featured?: boolean;
}

export interface CategoryGridProps {
  categories: Category[];
  
  // Layout options
  variant?: 'default' | 'compact' | 'featured' | 'mixed';
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  
  // Display options
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  viewAllText?: string;
  
  // Filtering and sorting
  showFilter?: boolean;
  filterOptions?: Array<{ label: string; value: string }>;
  defaultFilter?: string;
  sortOptions?: Array<{ label: string; value: string }>;
  defaultSort?: string;
  
  // Pagination
  itemsPerPage?: number;
  showPagination?: boolean;
  
  // Featured section
  featuredTitle?: string;
  featuredSubtitle?: string;
  showFeaturedSeparately?: boolean;
  
  // Loading state
  loading?: boolean;
  skeletonCount?: number;
  
  // Callbacks
  onCategoryClick?: (category: Category) => void;
  onFilterChange?: (filter: string) => void;
  onSortChange?: (sort: string) => void;
  onViewAll?: () => void;
  
  // Styling
  className?: string;
  headerClassName?: string;
  gridClassName?: string;
  
  'aria-label'?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  variant = 'default',
  columns = 4,
  gap = 'md',
  title,
  subtitle,
  showViewAll = false,
  viewAllHref,
  viewAllText = 'View All Categories',
  showFilter = false,
  filterOptions = [],
  defaultFilter = 'all',
  sortOptions = [],
  defaultSort = 'name',
  itemsPerPage = 12,
  showPagination = false,
  featuredTitle = 'Featured Categories',
  featuredSubtitle,
  showFeaturedSeparately = false,
  loading = false,
  skeletonCount = 8,
  onCategoryClick,
  onFilterChange,
  onSortChange,
  onViewAll,
  className,
  headerClassName,
  gridClassName,
  'aria-label': ariaLabel,
}) => {
  const [currentFilter, setCurrentFilter] = useState(defaultFilter);
  const [currentSort, setCurrentSort] = useState(defaultSort);
  const [currentPage, setCurrentPage] = useState(1);

  // Separate featured and regular categories
  const { featuredCategories, regularCategories } = useMemo(() => {
    if (!showFeaturedSeparately) {
      return { featuredCategories: [], regularCategories: categories };
    }
    
    return {
      featuredCategories: categories.filter(cat => cat.featured),
      regularCategories: categories.filter(cat => !cat.featured),
    };
  }, [categories, showFeaturedSeparately]);

  // Filter categories
  const filteredCategories = useMemo(() => {
    if (currentFilter === 'all') return regularCategories;
    
    // Custom filter logic here
    return regularCategories.filter(cat => {
      // Example: filter by subcategory or other criteria
      return true;
    });
  }, [regularCategories, currentFilter]);

  // Sort categories
  const sortedCategories = useMemo(() => {
    const sorted = [...filteredCategories];
    
    switch (currentSort) {
      case 'name':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'products':
        sorted.sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
        break;
      case 'products-asc':
        sorted.sort((a, b) => (a.productCount || 0) - (b.productCount || 0));
        break;
      default:
        break;
    }
    
    return sorted;
  }, [filteredCategories, currentSort]);

  // Paginate categories
  const paginatedCategories = useMemo(() => {
    if (!showPagination) return sortedCategories;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return sortedCategories.slice(startIndex, endIndex);
  }, [sortedCategories, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  // Column classes
  const columnClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    setCurrentPage(1);
    onFilterChange?.(filter);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    onSortChange?.(sort);
  };

  // Render header
  const renderHeader = () => {
    if (!title && !showFilter && !showViewAll) return null;

    return (
      <div className={cn('mb-8', headerClassName)}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {title && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
              {subtitle && (
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-4">
            {showFilter && filterOptions.length > 0 && (
              <select
                value={currentFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                aria-label="Filter categories"
              >
                <option value="all">All Categories</option>
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {sortOptions.length > 0 && (
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-sm"
                aria-label="Sort categories"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {showViewAll && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewAll}
                as={viewAllHref ? 'a' : 'button'}
                href={viewAllHref}
              >
                {viewAllText}
                <Icon icon="arrow-right" size="xs" className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return (
      <div className={cn('grid', columnClasses[columns], gapClasses[gap])}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton
            key={index}
            variant="card"
            className="h-48"
          />
        ))}
      </div>
    );
  };

  // Render featured categories
  const renderFeaturedCategories = () => {
    if (!showFeaturedSeparately || featuredCategories.length === 0) return null;

    return (
      <div className="mb-12">
        {featuredTitle && (
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-bold">{featuredTitle}</h3>
            {featuredSubtitle && (
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                {featuredSubtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCategories.map(category => (
            <CategoryCard
              key={category.id}
              {...category}
              variant="featured"
              size="lg"
              onClick={onCategoryClick ? () => onCategoryClick(category) : undefined}
            />
          ))}
        </div>
      </div>
    );
  };

  // Render category grid
  const renderCategoryGrid = () => {
    if (paginatedCategories.length === 0) {
      return (
        <div className="text-center py-12">
          <Icon icon="folder" size="xl" className="mx-auto mb-4 text-neutral-400" />
          <p className="text-neutral-600 dark:text-neutral-400">
            No categories found
          </p>
        </div>
      );
    }

    // Get card variant based on grid variant
    const getCardVariant = () => {
      switch (variant) {
        case 'compact':
          return 'compact';
        case 'featured':
          return 'featured';
        case 'mixed':
          // Alternate between default and minimal
          return 'default';
        default:
          return 'default';
      }
    };

    const cardVariant = getCardVariant();

    return (
      <div className={cn('grid', columnClasses[columns], gapClasses[gap], gridClassName)}>
        {paginatedCategories.map((category, index) => (
          <CategoryCard
            key={category.id}
            {...category}
            variant={variant === 'mixed' && index % 3 === 0 ? 'featured' : cardVariant}
            size={variant === 'compact' ? 'sm' : 'md'}
            onClick={onCategoryClick ? () => onCategoryClick(category) : undefined}
          />
        ))}
      </div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null;

    return (
      <div className="mt-8 flex justify-center items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <Icon icon="chevron-left" size="xs" />
        </Button>
        
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          const showPage = 
            page === 1 || 
            page === totalPages || 
            (page >= currentPage - 1 && page <= currentPage + 1);
          
          if (!showPage && page === currentPage - 2) {
            return <span key={page} className="px-1">...</span>;
          }
          
          if (!showPage) return null;
          
          return (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="min-w-[40px]"
            >
              {page}
            </Button>
          );
        })}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          <Icon icon="chevron-right" size="xs" />
        </Button>
      </div>
    );
  };

  return (
    <section className={cn('py-8', className)} aria-label={ariaLabel}>
      {renderHeader()}
      
      {loading ? (
        renderSkeletons()
      ) : (
        <>
          {renderFeaturedCategories()}
          {renderCategoryGrid()}
          {renderPagination()}
        </>
      )}
    </section>
  );
};

CategoryGrid.displayName = 'CategoryGrid';

// Quick category grid for simple use cases
export interface QuickCategoryGridProps {
  categories: Array<{
    id: string | number;
    title: string;
    icon: string;
    href: string;
    productCount?: number;
  }>;
  columns?: 4 | 6 | 8;
  className?: string;
}

export const QuickCategoryGrid: React.FC<QuickCategoryGridProps> = ({
  categories,
  columns = 6,
  className,
}) => {
  const columnClasses = {
    4: 'grid-cols-2 sm:grid-cols-4',
    6: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6',
    8: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8',
  };

  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {categories.map(category => (
        <a
          key={category.id}
          href={category.href}
          className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
            <Icon icon={category.icon} size="md" className="text-primary-600 dark:text-primary-400" />
          </div>
          <span className="text-sm font-medium text-center">{category.title}</span>
          {category.productCount !== undefined && (
            <span className="text-xs text-neutral-500">
              {category.productCount.toLocaleString()}
            </span>
          )}
        </a>
      ))}
    </div>
  );
};