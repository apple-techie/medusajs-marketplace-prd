import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define pagination variants
const paginationVariants = cva(
  'flex items-center gap-2',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const paginationButtonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50',
        active: 'bg-primary-600 text-white hover:bg-primary-700',
        ghost: 'text-neutral-600 hover:bg-neutral-100',
      },
      size: {
        sm: 'h-8 px-2 text-xs rounded-md gap-1',
        md: 'h-10 px-4 text-sm rounded-lg gap-2',
        lg: 'h-12 px-5 text-base rounded-lg gap-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const paginationNumberVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'text-neutral-600 hover:bg-neutral-100',
        active: 'bg-primary-600 text-white',
      },
      size: {
        sm: 'h-8 w-8 text-xs rounded-md',
        md: 'h-10 w-10 text-sm rounded-lg',
        lg: 'h-12 w-12 text-base rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Types
export interface PaginationProps extends VariantProps<typeof paginationVariants> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
  'aria-label'?: string;
}

// Helper function to generate page numbers
const generatePaginationItems = (
  currentPage: number,
  totalPages: number,
  siblingCount: number,
  boundaryCount: number
): (number | 'ellipsis')[] => {
  const totalNumbers = siblingCount * 2 + boundaryCount * 2 + 1;
  
  if (totalNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  
  const shouldShowLeftEllipsis = leftSiblingIndex > boundaryCount + 1;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - boundaryCount;
  
  const items: (number | 'ellipsis')[] = [];
  
  // Start pages
  for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
    items.push(i);
  }
  
  // Left ellipsis
  if (shouldShowLeftEllipsis) {
    items.push('ellipsis');
  }
  
  // Sibling pages
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i > boundaryCount && i <= totalPages - boundaryCount) {
      items.push(i);
    }
  }
  
  // Right ellipsis
  if (shouldShowRightEllipsis) {
    items.push('ellipsis');
  }
  
  // End pages
  for (let i = Math.max(totalPages - boundaryCount + 1, rightSiblingIndex + 1); i <= totalPages; i++) {
    items.push(i);
  }
  
  return items;
};

// Icons
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12.5 5L7.5 10L12.5 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.5 5L12.5 10L7.5 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronsLeftIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M11 5L6 10L11 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 5L11 10L16 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronsRightIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 5L14 10L9 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 5L9 10L4 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Main Pagination component
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ 
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    boundaryCount = 1,
    showFirstLast = false,
    showPrevNext = true,
    previousLabel = 'Previous',
    nextLabel = 'Next',
    size = 'md',
    className,
    'aria-label': ariaLabel = 'Pagination Navigation',
    ...props 
  }, ref) => {
    const pages = generatePaginationItems(currentPage, totalPages, siblingCount, boundaryCount);
    
    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    };
    
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    
    return (
      <nav
        ref={ref}
        className={cn(paginationVariants({ size }), className)}
        aria-label={ariaLabel}
        {...props}
      >
        {/* First page button */}
        {showFirstLast && (
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={cn(paginationButtonVariants({ size, variant: 'ghost' }))}
            aria-label="Go to first page"
          >
            <ChevronsLeftIcon className={iconSize} />
          </button>
        )}
        
        {/* Previous button */}
        {showPrevNext && (
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(paginationButtonVariants({ size }))}
            aria-label="Go to previous page"
          >
            <ChevronLeftIcon className={iconSize} />
            <span>{previousLabel}</span>
          </button>
        )}
        
        {/* Page numbers */}
        <div className="flex items-center gap-0.5">
          {pages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={cn(
                    paginationNumberVariants({ size, variant: 'default' }),
                    'cursor-default hover:bg-transparent'
                  )}
                >
                  ...
                </span>
              );
            }
            
            const isActive = page === currentPage;
            
            return (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={cn(
                  paginationNumberVariants({ 
                    size, 
                    variant: isActive ? 'active' : 'default' 
                  })
                )}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        {/* Next button */}
        {showPrevNext && (
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(paginationButtonVariants({ size }))}
            aria-label="Go to next page"
          >
            <span>{nextLabel}</span>
            <ChevronRightIcon className={iconSize} />
          </button>
        )}
        
        {/* Last page button */}
        {showFirstLast && (
          <button
            type="button"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={cn(paginationButtonVariants({ size, variant: 'ghost' }))}
            aria-label="Go to last page"
          >
            <ChevronsRightIcon className={iconSize} />
          </button>
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

// Simple pagination component
export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SimplePagination = React.forwardRef<HTMLDivElement, SimplePaginationProps>(
  ({ currentPage, totalPages, onPageChange, size = 'md', className, ...props }, ref) => {
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-4', className)}
        {...props}
      >
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(paginationButtonVariants({ size, variant: 'ghost' }))}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className={iconSize} />
        </button>
        
        <span className={cn(
          'text-neutral-600',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}>
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(paginationButtonVariants({ size, variant: 'ghost' }))}
          aria-label="Next page"
        >
          <ChevronRightIcon className={iconSize} />
        </button>
      </div>
    );
  }
);

SimplePagination.displayName = 'SimplePagination';

// Hook for pagination logic
export const usePagination = (totalItems: number, itemsPerPage: number, initialPage = 1) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };
  
  const nextPage = () => goToPage(currentPage + 1);
  const previousPage = () => goToPage(currentPage - 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

export { paginationVariants, paginationButtonVariants, paginationNumberVariants };