import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { Input } from '../../atoms/Input/Input';
import { Select } from '../../molecules/Select/Select';
import { Pagination } from '../../molecules/Pagination/Pagination';

export interface Column<T = any> {
  id: string;
  header: React.ReactNode;
  accessor?: keyof T | ((row: T) => any);
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  
  // Selection
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (row: T) => string;
  
  // Sorting
  sortable?: boolean;
  defaultSort?: { id: string; direction: 'asc' | 'desc' };
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  
  // Pagination
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  
  // Search & filters
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: React.ReactNode;
  
  // Actions
  bulkActions?: Array<{
    label: string;
    icon?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'ghost';
    onClick: (selectedIds: string[]) => void;
    disabled?: boolean;
  }>;
  rowActions?: (row: T) => Array<{
    label: string;
    icon?: string;
    onClick: () => void;
    disabled?: boolean;
    destructive?: boolean;
  }>;
  
  // Loading & empty states
  loading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  emptyIcon?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  
  // Appearance
  variant?: 'default' | 'bordered' | 'striped';
  size?: 'sm' | 'md' | 'lg';
  stickyHeader?: boolean;
  maxHeight?: string | number;
  
  // Row customization
  getRowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  expandable?: boolean;
  renderExpandedRow?: (row: T) => React.ReactNode;
  
  // Styling
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  
  'aria-label'?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId = (row) => row.id,
  sortable = true,
  defaultSort,
  onSort,
  pagination,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  filters,
  bulkActions = [],
  rowActions,
  loading = false,
  loadingRows = 5,
  emptyMessage = 'No data found',
  emptyIcon = 'inbox',
  emptyAction,
  variant = 'default',
  size = 'md',
  stickyHeader = false,
  maxHeight,
  getRowClassName,
  onRowClick,
  expandable = false,
  renderExpandedRow,
  className,
  headerClassName,
  bodyClassName,
  'aria-label': ariaLabel,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState(defaultSort?.id || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    defaultSort?.direction || 'asc'
  );
  const [searchValue, setSearchValue] = useState('');
  const [selectedPageSize, setSelectedPageSize] = useState(
    pagination?.pageSize || 10
  );

  // Handle row selection
  const isAllSelected = useMemo(() => {
    if (!selectable || data.length === 0) return false;
    return data.every(row => selectedRows.includes(getRowId(row)));
  }, [data, selectable, selectedRows, getRowId]);

  const isSomeSelected = useMemo(() => {
    if (!selectable || data.length === 0) return false;
    return data.some(row => selectedRows.includes(getRowId(row))) && !isAllSelected;
  }, [data, selectable, selectedRows, getRowId, isAllSelected]);

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(row => getRowId(row)));
    }
  }, [isAllSelected, data, getRowId, onSelectionChange]);

  const handleSelectRow = useCallback((rowId: string) => {
    if (!onSelectionChange) return;
    
    if (selectedRows.includes(rowId)) {
      onSelectionChange(selectedRows.filter(id => id !== rowId));
    } else {
      onSelectionChange([...selectedRows, rowId]);
    }
  }, [selectedRows, onSelectionChange]);

  // Handle sorting
  const handleSort = useCallback((columnId: string) => {
    if (!sortable) return;
    
    const newDirection = 
      sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
    
    setSortColumn(columnId);
    setSortDirection(newDirection);
    
    if (onSort) {
      onSort(columnId, newDirection);
    }
  }, [sortable, sortColumn, sortDirection, onSort]);

  // Handle row expansion
  const toggleRowExpansion = useCallback((rowId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  }, []);

  // Handle search
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch]);

  // Size styles
  const sizeStyles = {
    sm: {
      cell: 'px-3 py-2 text-sm',
      header: 'px-3 py-2 text-xs font-medium',
    },
    md: {
      cell: 'px-4 py-3 text-sm',
      header: 'px-4 py-3 text-sm font-medium',
    },
    lg: {
      cell: 'px-6 py-4',
      header: 'px-6 py-4 text-sm font-medium',
    },
  };

  // Loading skeleton
  const LoadingRow = () => (
    <tr>
      {selectable && (
        <td className={cn('text-center', sizeStyles[size].cell)}>
          <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </td>
      )}
      {expandable && (
        <td className={cn('text-center', sizeStyles[size].cell)}>
          <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </td>
      )}
      {columns.map((column) => (
        <td
          key={column.id}
          className={cn(
            sizeStyles[size].cell,
            column.align === 'center' && 'text-center',
            column.align === 'right' && 'text-right'
          )}
        >
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </td>
      ))}
      {rowActions && (
        <td className={cn('text-center', sizeStyles[size].cell)}>
          <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mx-auto" />
        </td>
      )}
    </tr>
  );

  // Get cell value
  const getCellValue = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row, data.indexOf(row));
    }
    
    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        return column.accessor(row);
      }
      return row[column.accessor];
    }
    
    return null;
  };

  const containerClasses = cn(
    'w-full',
    variant === 'bordered' && 'border border-neutral-200 dark:border-neutral-700 rounded-lg',
    className
  );

  const tableClasses = cn(
    'w-full',
    variant === 'striped' && '[&_tbody_tr:nth-child(even)]:bg-neutral-50 dark:[&_tbody_tr:nth-child(even)]:bg-neutral-800'
  );

  const headerClasses = cn(
    'bg-neutral-50 dark:bg-neutral-800',
    variant === 'bordered' && 'border-b border-neutral-200 dark:border-neutral-700',
    stickyHeader && 'sticky top-0 z-10',
    headerClassName
  );

  const showBulkActions = selectable && selectedRows.length > 0 && bulkActions.length > 0;

  return (
    <div 
      className={containerClasses}
      aria-label={ariaLabel || 'Data table'}
    >
      {/* Header controls */}
      {(searchable || filters || showBulkActions) && (
        <div className="p-4 space-y-4">
          {/* Search and filters */}
          {(searchable || filters) && (
            <div className="flex flex-col sm:flex-row gap-4">
              {searchable && (
                <div className="flex-1">
                  <Input
                    type="search"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    icon="search"
                    className="max-w-sm"
                  />
                </div>
              )}
              {filters && (
                <div className="flex gap-2">
                  {filters}
                </div>
              )}
            </div>
          )}
          
          {/* Bulk actions */}
          {showBulkActions && (
            <div className="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <span className="text-sm font-medium">
                {selectedRows.length} selected
              </span>
              <div className="flex gap-2">
                {bulkActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    size="sm"
                    onClick={() => action.onClick(selectedRows)}
                    disabled={action.disabled}
                  >
                    {action.icon && (
                      <Icon icon={action.icon} className="w-4 h-4 mr-1.5" />
                    )}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Table */}
      <div 
        className={cn(
          'overflow-auto',
          maxHeight && 'relative'
        )}
        style={{ maxHeight }}
      >
        <table className={tableClasses}>
          <thead className={headerClasses}>
            <tr>
              {/* Select all checkbox */}
              {selectable && (
                <th className={cn('text-center', sizeStyles[size].header, 'w-12')}>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              
              {/* Expand column */}
              {expandable && (
                <th className={cn('text-center', sizeStyles[size].header, 'w-12')} />
              )}
              
              {/* Data columns */}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    sizeStyles[size].header,
                    'text-left uppercase tracking-wider text-neutral-600 dark:text-neutral-400',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sticky && 'sticky left-0 z-10 bg-neutral-50 dark:bg-neutral-800',
                    column.sortable && sortable && 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortable && (
                      <div className="flex flex-col">
                        <Icon
                          icon="chevron-up"
                          className={cn(
                            'w-3 h-3 -mb-1',
                            sortColumn === column.id && sortDirection === 'asc'
                              ? 'text-primary-600'
                              : 'text-neutral-400'
                          )}
                        />
                        <Icon
                          icon="chevron-down"
                          className={cn(
                            'w-3 h-3',
                            sortColumn === column.id && sortDirection === 'desc'
                              ? 'text-primary-600'
                              : 'text-neutral-400'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              
              {/* Actions column */}
              {rowActions && (
                <th className={cn('text-center', sizeStyles[size].header, 'w-20')}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className={bodyClassName}>
            {/* Loading state */}
            {loading && (
              <>
                {Array.from({ length: loadingRows }).map((_, index) => (
                  <LoadingRow key={index} />
                ))}
              </>
            )}
            
            {/* Data rows */}
            {!loading && data.length > 0 && data.map((row, rowIndex) => {
              const rowId = getRowId(row);
              const isSelected = selectedRows.includes(rowId);
              const isExpanded = expandedRows.has(rowId);
              const actions = rowActions?.(row) || [];
              
              return (
                <React.Fragment key={rowId}>
                  <tr
                    className={cn(
                      'border-b border-neutral-200 dark:border-neutral-700',
                      'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                      onRowClick && 'cursor-pointer',
                      isSelected && 'bg-primary-50 dark:bg-primary-900/20',
                      getRowClassName?.(row, rowIndex)
                    )}
                    onClick={() => onRowClick?.(row, rowIndex)}
                  >
                    {/* Select checkbox */}
                    {selectable && (
                      <td 
                        className={cn('text-center', sizeStyles[size].cell)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      </td>
                    )}
                    
                    {/* Expand button */}
                    {expandable && (
                      <td 
                        className={cn('text-center', sizeStyles[size].cell)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(rowId)}
                          aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                        >
                          <Icon
                            icon={isExpanded ? 'chevron-down' : 'chevron-right'}
                            className="w-4 h-4"
                          />
                        </Button>
                      </td>
                    )}
                    
                    {/* Data cells */}
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          sizeStyles[size].cell,
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          column.sticky && 'sticky left-0 bg-white dark:bg-neutral-900'
                        )}
                      >
                        {getCellValue(row, column)}
                      </td>
                    ))}
                    
                    {/* Row actions */}
                    {rowActions && (
                      <td 
                        className={cn('text-center', sizeStyles[size].cell)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Icon icon="more-vertical" className="w-4 h-4" />
                          </Button>
                          
                          {/* Actions dropdown */}
                          <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block z-50">
                            <div className="py-1">
                              {actions.map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  className={cn(
                                    'flex items-center w-full px-4 py-2 text-sm',
                                    'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                                    action.destructive && 'text-red-600 dark:text-red-400',
                                    action.disabled && 'opacity-50 cursor-not-allowed'
                                  )}
                                  onClick={action.onClick}
                                  disabled={action.disabled}
                                >
                                  {action.icon && (
                                    <Icon icon={action.icon} className="w-4 h-4 mr-2" />
                                  )}
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                  
                  {/* Expanded row */}
                  {expandable && isExpanded && renderExpandedRow && (
                    <tr>
                      <td
                        colSpan={
                          columns.length +
                          (selectable ? 1 : 0) +
                          (expandable ? 1 : 0) +
                          (rowActions ? 1 : 0)
                        }
                        className="bg-neutral-50 dark:bg-neutral-800/50"
                      >
                        <div className="p-4">
                          {renderExpandedRow(row)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            
            {/* Empty state */}
            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (expandable ? 1 : 0) +
                    (rowActions ? 1 : 0)
                  }
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center">
                    <Icon
                      icon={emptyIcon}
                      className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mb-4"
                    />
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      {emptyMessage}
                    </p>
                    {emptyAction && (
                      <Button
                        variant="outline"
                        onClick={emptyAction.onClick}
                      >
                        {emptyAction.label}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && !loading && data.length > 0 && (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </span>
              
              {pagination.onPageSizeChange && (
                <Select
                  value={selectedPageSize.toString()}
                  onValueChange={(value) => {
                    const size = parseInt(value);
                    setSelectedPageSize(size);
                    pagination.onPageSizeChange!(size);
                  }}
                  options={[
                    { value: '10', label: '10 per page' },
                    { value: '20', label: '20 per page' },
                    { value: '50', label: '50 per page' },
                    { value: '100', label: '100 per page' },
                  ]}
                />
              )}
            </div>
            
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange}
              showFirstLast
            />
          </div>
        </div>
      )}
    </div>
  );
}

DataTable.displayName = 'DataTable';