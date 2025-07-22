import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable, Column } from './DataTable';

// Mock components
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, className }: any) => (
    <span data-testid={`icon-${icon}`} className={className}>{icon}</span>
  ),
}));

jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, variant, size, disabled, className }: any) => (
    <button 
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  ),
}));

jest.mock('../../atoms/Checkbox/Checkbox', () => ({
  Checkbox: ({ checked, onChange, indeterminate, 'aria-label': ariaLabel }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      data-indeterminate={indeterminate}
      aria-label={ariaLabel}
    />
  ),
}));

jest.mock('../../atoms/Input/Input', () => ({
  Input: ({ value, onChange, placeholder, type }: any) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid="search-input"
    />
  ),
}));

jest.mock('../../molecules/Select/Select', () => ({
  Select: ({ value, onValueChange, options }: any) => (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      data-testid="page-size-select"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  ),
}));

jest.mock('../../molecules/Pagination/Pagination', () => ({
  Pagination: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      <span>{currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  ),
}));

describe('DataTable Component', () => {
  const mockData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', amount: 100 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', amount: 200 },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'active', amount: 150 },
  ];

  const mockColumns: Column[] = [
    { id: 'name', header: 'Name', accessor: 'name', sortable: true },
    { id: 'email', header: 'Email', accessor: 'email' },
    { 
      id: 'status', 
      header: 'Status', 
      cell: (row) => (
        <span data-testid="badge" data-variant={row.status === 'active' ? 'success' : 'secondary'}>
          {row.status}
        </span>
      )
    },
    { id: 'amount', header: 'Amount', accessor: 'amount', align: 'right', sortable: true },
  ];

  it('renders data correctly', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('uses custom cell renderer', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    const badges = screen.getAllByTestId('badge');
    expect(badges[0]).toHaveAttribute('data-variant', 'success');
    expect(badges[0]).toHaveTextContent('active');
    expect(badges[1]).toHaveAttribute('data-variant', 'secondary');
    expect(badges[1]).toHaveTextContent('inactive');
  });

  it('shows loading state', () => {
    render(<DataTable data={[]} columns={mockColumns} loading loadingRows={3} />);
    
    const rows = screen.getAllByRole('row');
    // Header + 3 loading rows
    expect(rows).toHaveLength(4);
    expect(screen.getAllByClassName('animate-pulse')).toBeDefined();
  });

  it('shows empty state', () => {
    render(
      <DataTable 
        data={[]} 
        columns={mockColumns}
        emptyMessage="No users found"
        emptyIcon="users"
      />
    );
    
    expect(screen.getByTestId('icon-users')).toBeInTheDocument();
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('shows empty state with action', () => {
    const handleAction = jest.fn();
    render(
      <DataTable 
        data={[]} 
        columns={mockColumns}
        emptyAction={{
          label: 'Add user',
          onClick: handleAction,
        }}
      />
    );
    
    const button = screen.getByText('Add user');
    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalled();
  });

  it('handles row selection', () => {
    const handleSelection = jest.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        selectable
        selectedRows={['1']}
        onSelectionChange={handleSelection}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    // Click row checkbox
    fireEvent.click(checkboxes[2]); // Second row checkbox (first is select all)
    
    expect(handleSelection).toHaveBeenCalledWith(['1', '2']);
  });

  it('handles select all', () => {
    const handleSelection = jest.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        selectable
        selectedRows={[]}
        onSelectionChange={handleSelection}
      />
    );
    
    const selectAllCheckbox = screen.getByLabelText('Select all rows');
    fireEvent.click(selectAllCheckbox);
    
    expect(handleSelection).toHaveBeenCalledWith(['1', '2', '3']);
  });

  it('shows indeterminate state for partial selection', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        selectable
        selectedRows={['1', '2']}
        onSelectionChange={() => {}}
      />
    );
    
    const selectAllCheckbox = screen.getByLabelText('Select all rows');
    expect(selectAllCheckbox).toHaveAttribute('data-indeterminate', 'true');
  });

  it('handles sorting', () => {
    const handleSort = jest.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        sortable
        onSort={handleSort}
      />
    );
    
    const nameHeader = screen.getByText('Name').parentElement;
    fireEvent.click(nameHeader!);
    
    expect(handleSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('shows sort indicators', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        sortable
        defaultSort={{ id: 'name', direction: 'desc' }}
      />
    );
    
    const chevronDown = screen.getByTestId('icon-chevron-down');
    expect(chevronDown).toHaveClass('text-primary-600');
  });

  it('handles search', () => {
    const handleSearch = jest.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        searchable
        onSearch={handleSearch}
      />
    );
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'john' } });
    
    expect(handleSearch).toHaveBeenCalledWith('john');
  });

  it('shows bulk actions when rows selected', () => {
    const handleBulkDelete = jest.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        selectable
        selectedRows={['1', '2']}
        onSelectionChange={() => {}}
        bulkActions={[
          {
            label: 'Delete',
            icon: 'trash',
            variant: 'destructive',
            onClick: handleBulkDelete,
          },
        ]}
      />
    );
    
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(handleBulkDelete).toHaveBeenCalledWith(['1', '2']);
  });

  it('handles row actions', () => {
    const handleEdit = jest.fn();
    const handleDelete = jest.fn();
    
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        rowActions={(row) => [
          { label: 'Edit', icon: 'edit', onClick: () => handleEdit(row.id) },
          { label: 'Delete', icon: 'trash', onClick: () => handleDelete(row.id), destructive: true },
        ]}
      />
    );
    
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    const moreButtons = screen.getAllByTestId('icon-more-vertical');
    expect(moreButtons).toHaveLength(3);
  });

  it('handles row click', () => {
    const handleRowClick = jest.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        onRowClick={handleRowClick}
      />
    );
    
    const firstRow = screen.getByText('John Doe').closest('tr');
    fireEvent.click(firstRow!);
    
    expect(handleRowClick).toHaveBeenCalledWith(mockData[0], 0);
  });

  it('handles expandable rows', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        expandable
        renderExpandedRow={(row) => <div>Details for {row.name}</div>}
      />
    );
    
    const expandButtons = screen.getAllByTestId('icon-chevron-right');
    fireEvent.click(expandButtons[0].parentElement!);
    
    expect(screen.getByText('Details for John Doe')).toBeInTheDocument();
    expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
  });

  it('shows pagination', () => {
    const handlePageChange = jest.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        pagination={{
          currentPage: 2,
          pageSize: 10,
          totalPages: 5,
          totalItems: 50,
          onPageChange: handlePageChange,
        }}
      />
    );
    
    expect(screen.getByText('Showing 11 to 20 of 50 results')).toBeInTheDocument();
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('handles page size change', () => {
    const handlePageSizeChange = jest.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        pagination={{
          currentPage: 1,
          pageSize: 10,
          totalPages: 5,
          totalItems: 50,
          onPageChange: () => {},
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    );
    
    const pageSizeSelect = screen.getByTestId('page-size-select');
    fireEvent.change(pageSizeSelect, { target: { value: '50' } });
    
    expect(handlePageSizeChange).toHaveBeenCalledWith(50);
  });

  it('applies custom row className', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        getRowClassName={(row) => row.status === 'inactive' ? 'opacity-50' : ''}
      />
    );
    
    const janeRow = screen.getByText('Jane Smith').closest('tr');
    expect(janeRow).toHaveClass('opacity-50');
  });

  it('applies size styles', () => {
    const { rerender } = render(
      <DataTable data={mockData} columns={mockColumns} size="sm" />
    );
    
    let cells = screen.getByText('John Doe').parentElement;
    expect(cells).toHaveClass('px-3', 'py-2');
    
    rerender(<DataTable data={mockData} columns={mockColumns} size="lg" />);
    cells = screen.getByText('John Doe').parentElement;
    expect(cells).toHaveClass('px-6', 'py-4');
  });

  it('applies variant styles', () => {
    render(
      <DataTable data={mockData} columns={mockColumns} variant="striped" />
    );
    
    const table = screen.getByRole('table');
    expect(table).toHaveClass('[&_tbody_tr:nth-child(even)]:bg-neutral-50');
  });

  it('uses custom getRowId', () => {
    const customData = mockData.map(item => ({ ...item, customId: `custom-${item.id}` }));
    const handleSelection = jest.fn();
    
    render(
      <DataTable 
        data={customData} 
        columns={mockColumns}
        selectable
        getRowId={(row) => row.customId}
        onSelectionChange={handleSelection}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    
    expect(handleSelection).toHaveBeenCalledWith(['custom-1']);
  });

  it('renders filters', () => {
    const filterComponent = <button>Filter</button>;
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        filters={filterComponent}
      />
    );
    
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('handles sticky header', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        stickyHeader
      />
    );
    
    const thead = screen.getByRole('table').querySelector('thead');
    expect(thead).toHaveClass('sticky', 'top-0', 'z-10');
  });

  it('applies custom class names', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        className="custom-container"
        headerClassName="custom-header"
        bodyClassName="custom-body"
      />
    );
    
    const container = screen.getByLabelText('Data table');
    expect(container).toHaveClass('custom-container');
    
    const thead = screen.getByRole('table').querySelector('thead');
    expect(thead).toHaveClass('custom-header');
    
    const tbody = screen.getByRole('table').querySelector('tbody');
    expect(tbody).toHaveClass('custom-body');
  });

  it('uses custom aria-label', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        aria-label="Users table"
      />
    );
    
    expect(screen.getByLabelText('Users table')).toBeInTheDocument();
  });

  it('handles column alignment', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    const amountCell = screen.getByText('100').parentElement;
    expect(amountCell).toHaveClass('text-right');
  });
});