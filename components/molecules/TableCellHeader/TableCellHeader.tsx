import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define header variants
const tableHeaderVariants = cva(
  'flex items-center justify-between gap-2 px-4 py-4 text-xs font-semibold uppercase tracking-wider',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-neutral-900',
        dark: 'bg-neutral-900 text-white',
        transparent: 'bg-transparent text-neutral-700',
      },
      align: {
        left: 'text-left',
        center: 'text-center justify-center',
        right: 'text-right flex-row-reverse',
      },
      sortable: {
        true: 'cursor-pointer hover:bg-neutral-200 transition-colors',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      align: 'left',
      sortable: false,
    },
  }
);

export type SortDirection = 'asc' | 'desc' | null;

export interface TableCellHeaderProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof tableHeaderVariants> {
  // Content
  children: React.ReactNode;
  
  // Sorting
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  
  // Icons
  icon?: React.ReactNode;
  showSortIcon?: boolean;
  
  // Layout
  width?: string | number;
  minWidth?: string | number;
  sticky?: boolean;
}

// Sort icon component
const SortIcon = ({ direction, className }: { direction: SortDirection; className?: string }) => {
  return (
    <div className={cn('relative flex flex-col', className)}>
      {/* Up arrow */}
      <svg
        width="8"
        height="4"
        viewBox="0 0 8 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'transition-opacity',
          direction === 'asc' ? 'opacity-100' : 'opacity-40'
        )}
      >
        <path
          d="M4 0L7.4641 3.75H0.535898L4 0Z"
          fill="currentColor"
        />
      </svg>
      
      {/* Down arrow */}
      <svg
        width="8"
        height="4"
        viewBox="0 0 8 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'transition-opacity',
          direction === 'desc' ? 'opacity-100' : 'opacity-40'
        )}
      >
        <path
          d="M4 4L0.535898 0.25L7.4641 0.25L4 4Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

// Default sort icon (neutral state)
const DefaultSortIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.3334 5.33333L8.00002 10.6667L2.66669 5.33333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TableCellHeader = React.forwardRef<HTMLTableCellElement, TableCellHeaderProps>(
  (
    {
      className,
      children,
      variant,
      align,
      sortable,
      sortDirection = null,
      onSort,
      icon,
      showSortIcon = true,
      width,
      minWidth,
      sticky,
      style,
      ...props
    },
    ref
  ) => {
    const isInteractive = sortable && onSort;
    
    const handleClick = () => {
      if (isInteractive) {
        onSort();
      }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSort();
      }
    };
    
    return (
      <th
        ref={ref}
        className={cn(
          tableHeaderVariants({ variant, align, sortable: isInteractive }),
          sticky && 'sticky top-0 z-10',
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-sort={
          sortDirection === 'asc'
            ? 'ascending'
            : sortDirection === 'desc'
            ? 'descending'
            : undefined
        }
        style={{
          width,
          minWidth,
          ...style,
        }}
        {...props}
      >
        <span className="flex items-center gap-2">
          {icon && (
            <span className="shrink-0 w-4 h-4">
              {icon}
            </span>
          )}
          
          <span className="truncate">{children}</span>
        </span>
        
        {sortable && showSortIcon && (
          <span className="shrink-0 w-4 h-4 ml-1">
            {sortDirection !== null ? (
              <SortIcon direction={sortDirection} />
            ) : (
              <DefaultSortIcon className="w-4 h-4 opacity-40" />
            )}
          </span>
        )}
      </th>
    );
  }
);

TableCellHeader.displayName = 'TableCellHeader';

// Table Header Row component for convenience
export interface TableHeaderRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'transparent';
}

export const TableHeaderRow = React.forwardRef<HTMLTableRowElement, TableHeaderRowProps>(
  ({ className, children, variant, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b',
          variant === 'dark' && 'border-neutral-800',
          variant === 'transparent' && 'border-neutral-200',
          !variant && 'border-neutral-200',
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableHeaderRow.displayName = 'TableHeaderRow';

export { TableCellHeader, tableHeaderVariants };