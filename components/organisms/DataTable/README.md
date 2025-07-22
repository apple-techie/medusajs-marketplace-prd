# DataTable Component

A powerful and flexible data table organism for displaying tabular data with features like sorting, filtering, pagination, row selection, and more. Perfect for admin dashboards, vendor management, and data-heavy interfaces.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { DataTable, Column } from '@/components/organisms/DataTable';

// Define columns
const columns: Column<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'email', header: 'Email', accessor: 'email' },
  { 
    id: 'status', 
    header: 'Status',
    cell: (row) => <Badge variant={row.status}>{row.status}</Badge>
  },
];

// Basic usage
<DataTable
  data={users}
  columns={columns}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | - | **Required**. Array of data to display |
| `columns` | `Column<T>[]` | - | **Required**. Column definitions |
| `selectable` | `boolean` | `false` | Enable row selection |
| `selectedRows` | `string[]` | `[]` | Selected row IDs |
| `onSelectionChange` | `(ids: string[]) => void` | - | Selection change handler |
| `getRowId` | `(row: T) => string` | `(row) => row.id` | Function to get row ID |
| `sortable` | `boolean` | `true` | Enable column sorting |
| `defaultSort` | `{ id: string; direction: 'asc' \| 'desc' }` | - | Default sort configuration |
| `onSort` | `(columnId: string, direction: 'asc' \| 'desc') => void` | - | Sort handler |
| `pagination` | `object` | - | Pagination configuration |
| `searchable` | `boolean` | `false` | Show search input |
| `searchPlaceholder` | `string` | `'Search...'` | Search placeholder text |
| `onSearch` | `(value: string) => void` | - | Search handler |
| `filters` | `React.ReactNode` | - | Custom filter components |
| `bulkActions` | `array` | `[]` | Bulk action buttons |
| `rowActions` | `(row: T) => array` | - | Row action menu items |
| `loading` | `boolean` | `false` | Show loading state |
| `loadingRows` | `number` | `5` | Number of loading skeleton rows |
| `emptyMessage` | `string` | `'No data found'` | Empty state message |
| `emptyIcon` | `string` | `'inbox'` | Empty state icon |
| `emptyAction` | `object` | - | Empty state action button |
| `variant` | `'default' \| 'bordered' \| 'striped'` | `'default'` | Table variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Table size |
| `stickyHeader` | `boolean` | `false` | Make header sticky |
| `maxHeight` | `string \| number` | - | Maximum table height |
| `getRowClassName` | `(row: T, index: number) => string` | - | Custom row classes |
| `onRowClick` | `(row: T, index: number) => void` | - | Row click handler |
| `expandable` | `boolean` | `false` | Enable expandable rows |
| `renderExpandedRow` | `(row: T) => React.ReactNode` | - | Expanded row content |
| `className` | `string` | - | Container CSS classes |
| `headerClassName` | `string` | - | Header CSS classes |
| `bodyClassName` | `string` | - | Body CSS classes |
| `aria-label` | `string` | - | Custom ARIA label |

### Column Type

```tsx
interface Column<T = any> {
  id: string;
  header: React.ReactNode;
  accessor?: keyof T | ((row: T) => any);
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
}
```

### Pagination Type

```tsx
interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}
```

## Common Patterns

### Basic Table

```tsx
const columns: Column<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: 'email' },
  { id: 'role', header: 'Role', accessor: 'role' },
];

<DataTable
  data={users}
  columns={columns}
/>
```

### With Row Selection

```tsx
function SelectableTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  return (
    <DataTable
      data={users}
      columns={columns}
      selectable
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      bulkActions={[
        {
          label: 'Delete',
          icon: 'trash',
          variant: 'destructive',
          onClick: (ids) => deleteUsers(ids),
        },
      ]}
    />
  );
}
```

### With Sorting

```tsx
function SortableTable() {
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const sortedData = [...data].sort((a, b) => {
    // Implement sorting logic
  });
  
  return (
    <DataTable
      data={sortedData}
      columns={columns}
      sortable
      defaultSort={{ id: 'name', direction: 'asc' }}
      onSort={(column, direction) => {
        setSortColumn(column);
        setSortDirection(direction);
      }}
    />
  );
}
```

### With Pagination

```tsx
function PaginatedTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  return (
    <DataTable
      data={paginatedData}
      columns={columns}
      pagination={{
        currentPage,
        pageSize,
        totalPages,
        totalItems: data.length,
        onPageChange: setCurrentPage,
        onPageSizeChange: setPageSize,
      }}
    />
  );
}
```

### With Search and Filters

```tsx
function FilterableTable() {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <DataTable
      data={filteredData}
      columns={columns}
      searchable
      searchPlaceholder="Search by name..."
      onSearch={setSearchValue}
      filters={
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      }
    />
  );
}
```

### With Custom Cell Rendering

```tsx
const columns: Column<Product>[] = [
  {
    id: 'image',
    header: '',
    cell: (row) => (
      <img 
        src={row.image} 
        alt={row.name}
        className="w-10 h-10 rounded"
      />
    ),
    width: 60,
  },
  {
    id: 'name',
    header: 'Product',
    accessor: 'name',
  },
  {
    id: 'price',
    header: 'Price',
    cell: (row) => <Price amount={row.price} />,
    align: 'right',
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <Badge variant={row.inStock ? 'success' : 'destructive'}>
        {row.inStock ? 'In Stock' : 'Out of Stock'}
      </Badge>
    ),
  },
];
```

### With Row Actions

```tsx
<DataTable
  data={orders}
  columns={columns}
  rowActions={(row) => [
    {
      label: 'View details',
      icon: 'eye',
      onClick: () => navigateToOrder(row.id),
    },
    {
      label: 'Edit',
      icon: 'edit',
      onClick: () => openEditModal(row),
    },
    {
      label: 'Delete',
      icon: 'trash',
      onClick: () => deleteOrder(row.id),
      destructive: true,
    },
  ]}
/>
```

### With Expandable Rows

```tsx
<DataTable
  data={orders}
  columns={columns}
  expandable
  renderExpandedRow={(order) => (
    <div className="p-4 space-y-4">
      <h4 className="font-semibold">Order Items</h4>
      <ul className="space-y-2">
        {order.items.map(item => (
          <li key={item.id} className="flex justify-between">
            <span>{item.name} x{item.quantity}</span>
            <span>${item.total}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
/>
```

## Advanced Examples

### Vendor Dashboard Table

```tsx
function VendorDashboard() {
  const { orders, loading } = useVendorOrders();
  
  const columns: Column<VendorOrder>[] = [
    {
      id: 'orderNumber',
      header: 'Order #',
      accessor: 'orderNumber',
      sortable: true,
    },
    {
      id: 'customer',
      header: 'Customer',
      accessor: 'customerName',
    },
    {
      id: 'items',
      header: 'Items',
      cell: (row) => (
        <span className="text-sm">
          {row.items.length} items
        </span>
      ),
      align: 'center',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <OrderStatusBadge status={row.status} />,
    },
    {
      id: 'total',
      header: 'Total',
      cell: (row) => <Price amount={row.total} />,
      align: 'right',
      sortable: true,
    },
    {
      id: 'commission',
      header: 'Commission',
      cell: (row) => (
        <div className="text-right">
          <Price amount={row.commission} size="sm" />
          <span className="text-xs text-neutral-500">
            ({row.commissionRate}%)
          </span>
        </div>
      ),
      align: 'right',
    },
  ];
  
  return (
    <DataTable
      data={orders}
      columns={columns}
      loading={loading}
      searchable
      sortable
      rowActions={(row) => [
        {
          label: 'View order',
          icon: 'eye',
          onClick: () => navigateToOrder(row.id),
        },
        {
          label: 'Print invoice',
          icon: 'printer',
          onClick: () => printInvoice(row.id),
        },
        {
          label: 'Mark as fulfilled',
          icon: 'check',
          onClick: () => fulfillOrder(row.id),
          disabled: row.status !== 'processing',
        },
      ]}
      emptyMessage="No orders yet"
      emptyAction={{
        label: 'View products',
        onClick: () => navigate('/vendor/products'),
      }}
    />
  );
}
```

### Admin Users Table

```tsx
function AdminUsersTable() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { users, loading, refetch } = useUsers();
  
  const columns: Column<User>[] = [
    {
      id: 'user',
      header: 'User',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} src={row.avatar} />
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-neutral-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      cell: (row) => (
        <Badge variant={row.role === 'admin' ? 'default' : 'secondary'}>
          {row.role}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.active ? 'success' : 'destructive'}>
          {row.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'lastActive',
      header: 'Last Active',
      cell: (row) => formatRelativeTime(row.lastActive),
      sortable: true,
    },
  ];
  
  return (
    <DataTable
      data={users}
      columns={columns}
      loading={loading}
      selectable
      selectedRows={selectedUsers}
      onSelectionChange={setSelectedUsers}
      searchable
      bulkActions={[
        {
          label: 'Activate',
          icon: 'check',
          onClick: async (ids) => {
            await activateUsers(ids);
            refetch();
          },
        },
        {
          label: 'Deactivate',
          icon: 'x',
          onClick: async (ids) => {
            await deactivateUsers(ids);
            refetch();
          },
        },
        {
          label: 'Delete',
          icon: 'trash',
          variant: 'destructive',
          onClick: async (ids) => {
            if (confirm('Delete selected users?')) {
              await deleteUsers(ids);
              refetch();
            }
          },
        },
      ]}
      stickyHeader
      maxHeight="600px"
    />
  );
}
```

## Styling

### Variants

```tsx
// Default
<DataTable data={data} columns={columns} />

// Bordered
<DataTable data={data} columns={columns} variant="bordered" />

// Striped
<DataTable data={data} columns={columns} variant="striped" />
```

### Sizes

```tsx
// Small
<DataTable data={data} columns={columns} size="sm" />

// Medium (default)
<DataTable data={data} columns={columns} size="md" />

// Large
<DataTable data={data} columns={columns} size="lg" />
```

### Custom Row Styling

```tsx
<DataTable
  data={users}
  columns={columns}
  getRowClassName={(row, index) => {
    if (row.status === 'inactive') return 'opacity-50';
    if (row.role === 'admin') return 'bg-primary-50';
    return '';
  }}
/>
```

## Accessibility

- Semantic table markup with proper headers
- Keyboard navigation support
- Screen reader announcements for sorting and selection
- ARIA labels for all interactive elements
- Focus management for actions and expandable rows

## Performance

- Efficient rendering with minimal re-renders
- Virtualization compatible for large datasets
- Optimized sorting and filtering
- Lazy loading for expandable content
- Memoized cell renderers

## Best Practices

1. **Keep columns consistent**: Use the same column structure across similar tables
2. **Optimize cell renderers**: Memoize complex cell components
3. **Handle loading states**: Always show loading skeletons during data fetching
4. **Provide empty states**: Help users understand what to do when no data exists
5. **Use pagination**: Don't render thousands of rows at once
6. **Implement search**: Help users find data quickly
7. **Add bulk actions**: Allow efficient operations on multiple items
8. **Make it responsive**: Consider mobile views for essential tables