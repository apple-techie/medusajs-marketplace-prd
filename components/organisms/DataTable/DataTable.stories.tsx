import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { DataTable, Column } from './DataTable';
import { Badge } from '../../atoms/Badge/Badge';
import { Price } from '../../atoms/Price/Price';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Organisms/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'striped'],
      description: 'Table variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Table size',
    },
    selectable: {
      control: 'boolean',
      description: 'Enable row selection',
    },
    sortable: {
      control: 'boolean',
      description: 'Enable column sorting',
    },
    searchable: {
      control: 'boolean',
      description: 'Show search input',
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Make header sticky',
    },
    expandable: {
      control: 'boolean',
      description: 'Enable expandable rows',
    },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  vendor: string;
  image: string;
}

// Mock data
const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', joinDate: '2023-01-15', lastActive: '2024-01-23' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', joinDate: '2023-03-20', lastActive: '2024-01-22' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive', joinDate: '2023-05-10', lastActive: '2023-12-15' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Moderator', status: 'active', joinDate: '2023-02-28', lastActive: '2024-01-23' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'pending', joinDate: '2024-01-20', lastActive: '2024-01-20' },
];

const orders: Order[] = [
  { id: '1', orderNumber: 'ORD-001', customer: 'John Doe', date: '2024-01-23', status: 'delivered', total: 299.99, items: 3 },
  { id: '2', orderNumber: 'ORD-002', customer: 'Jane Smith', date: '2024-01-22', status: 'shipped', total: 149.50, items: 2 },
  { id: '3', orderNumber: 'ORD-003', customer: 'Bob Johnson', date: '2024-01-21', status: 'processing', total: 450.00, items: 5 },
  { id: '4', orderNumber: 'ORD-004', customer: 'Alice Brown', date: '2024-01-20', status: 'pending', total: 89.99, items: 1 },
  { id: '5', orderNumber: 'ORD-005', customer: 'Charlie Wilson', date: '2024-01-19', status: 'cancelled', total: 199.99, items: 2 },
];

const products: Product[] = [
  { id: '1', name: 'Wireless Headphones', category: 'Electronics', price: 99.99, stock: 45, status: 'in_stock', vendor: 'Tech Corp', image: 'https://source.unsplash.com/100x100/?headphones' },
  { id: '2', name: 'Laptop Stand', category: 'Accessories', price: 49.99, stock: 8, status: 'low_stock', vendor: 'Office Plus', image: 'https://source.unsplash.com/100x100/?laptop' },
  { id: '3', name: 'USB-C Cable', category: 'Accessories', price: 19.99, stock: 0, status: 'out_of_stock', vendor: 'Tech Corp', image: 'https://source.unsplash.com/100x100/?cable' },
  { id: '4', name: 'Mechanical Keyboard', category: 'Electronics', price: 149.99, stock: 23, status: 'in_stock', vendor: 'Gaming Gear', image: 'https://source.unsplash.com/100x100/?keyboard' },
  { id: '5', name: 'Monitor', category: 'Electronics', price: 299.99, stock: 12, status: 'in_stock', vendor: 'Display Pro', image: 'https://source.unsplash.com/100x100/?monitor' },
];

// Column definitions
const userColumns: Column<User>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    sortable: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessor: 'email',
  },
  {
    id: 'role',
    header: 'Role',
    cell: (row) => (
      <Badge variant={row.role === 'Admin' ? 'default' : 'secondary'}>
        {row.role}
      </Badge>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => {
      const variants = {
        active: 'success',
        inactive: 'secondary',
        pending: 'outline',
      } as const;
      
      return (
        <Badge variant={variants[row.status]}>
          {row.status}
        </Badge>
      );
    },
    sortable: true,
  },
  {
    id: 'joinDate',
    header: 'Join Date',
    accessor: 'joinDate',
    sortable: true,
  },
];

const orderColumns: Column<Order>[] = [
  {
    id: 'orderNumber',
    header: 'Order #',
    accessor: 'orderNumber',
    sortable: true,
  },
  {
    id: 'customer',
    header: 'Customer',
    accessor: 'customer',
  },
  {
    id: 'date',
    header: 'Date',
    accessor: 'date',
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => {
      const variants = {
        pending: 'secondary',
        processing: 'secondary',
        shipped: 'default',
        delivered: 'success',
        cancelled: 'destructive',
      } as const;
      
      const icons = {
        pending: 'clock',
        processing: 'loader',
        shipped: 'truck',
        delivered: 'check-circle',
        cancelled: 'x-circle',
      } as const;
      
      return (
        <Badge variant={variants[row.status]}>
          <Icon icon={icons[row.status]} className="w-3 h-3 mr-1" />
          {row.status}
        </Badge>
      );
    },
  },
  {
    id: 'items',
    header: 'Items',
    accessor: 'items',
    align: 'center',
  },
  {
    id: 'total',
    header: 'Total',
    cell: (row) => <Price amount={row.total} />,
    align: 'right',
    sortable: true,
  },
];

const productColumns: Column<Product>[] = [
  {
    id: 'image',
    header: '',
    cell: (row) => (
      <img 
        src={row.image} 
        alt={row.name}
        className="w-10 h-10 rounded object-cover"
      />
    ),
    width: 60,
  },
  {
    id: 'name',
    header: 'Product',
    accessor: 'name',
    sortable: true,
  },
  {
    id: 'category',
    header: 'Category',
    accessor: 'category',
  },
  {
    id: 'vendor',
    header: 'Vendor',
    accessor: 'vendor',
  },
  {
    id: 'price',
    header: 'Price',
    cell: (row) => <Price amount={row.price} />,
    align: 'right',
    sortable: true,
  },
  {
    id: 'stock',
    header: 'Stock',
    cell: (row) => {
      const color = row.status === 'out_of_stock' ? 'text-red-600' : 
                   row.status === 'low_stock' ? 'text-yellow-600' : 
                   'text-green-600';
      
      return (
        <span className={color}>
          {row.stock}
        </span>
      );
    },
    align: 'center',
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => {
      const variants = {
        in_stock: 'success',
        low_stock: 'outline',
        out_of_stock: 'destructive',
      } as const;
      
      const labels = {
        in_stock: 'In Stock',
        low_stock: 'Low Stock',
        out_of_stock: 'Out of Stock',
      } as const;
      
      return (
        <Badge variant={variants[row.status]} size="sm">
          {labels[row.status]}
        </Badge>
      );
    },
  },
];

// Default story
export const Default: Story = {
  args: {
    data: users,
    columns: userColumns,
  },
};

// With selection
export const WithSelection: Story = {
  args: {
    data: users,
    columns: userColumns,
    selectable: true,
    selectedRows: ['1', '3'],
  },
};

// With sorting
export const WithSorting: Story = {
  args: {
    data: users,
    columns: userColumns,
    sortable: true,
    defaultSort: { id: 'name', direction: 'asc' },
  },
};

// With search
export const WithSearch: Story = {
  args: {
    data: users,
    columns: userColumns,
    searchable: true,
    searchPlaceholder: 'Search users...',
  },
};

// With pagination
export const WithPagination: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;
    const totalPages = Math.ceil(users.length / pageSize);
    const paginatedData = users.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    
    return (
      <DataTable
        data={paginatedData}
        columns={userColumns}
        pagination={{
          currentPage,
          pageSize,
          totalPages,
          totalItems: users.length,
          onPageChange: setCurrentPage,
        }}
      />
    );
  },
};

// With bulk actions
export const WithBulkActions: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    
    return (
      <DataTable
        data={users}
        columns={userColumns}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        bulkActions={[
          {
            label: 'Delete',
            icon: 'trash',
            variant: 'destructive',
            onClick: (ids) => {
              console.log('Delete:', ids);
              setSelectedRows([]);
            },
          },
          {
            label: 'Export',
            icon: 'download',
            onClick: (ids) => console.log('Export:', ids),
          },
        ]}
      />
    );
  },
};

// With row actions
export const WithRowActions: Story = {
  args: {
    data: users,
    columns: userColumns,
    rowActions: (row) => [
      {
        label: 'Edit',
        icon: 'edit',
        onClick: () => console.log('Edit:', row.id),
      },
      {
        label: 'Delete',
        icon: 'trash',
        onClick: () => console.log('Delete:', row.id),
        destructive: true,
      },
    ],
  },
};

// Orders table
export const OrdersTable: Story = {
  args: {
    data: orders,
    columns: orderColumns,
    selectable: true,
    sortable: true,
    rowActions: (row) => [
      {
        label: 'View details',
        icon: 'eye',
        onClick: () => console.log('View order:', row.id),
      },
      {
        label: 'Print invoice',
        icon: 'printer',
        onClick: () => console.log('Print invoice:', row.id),
      },
      {
        label: 'Cancel order',
        icon: 'x',
        onClick: () => console.log('Cancel order:', row.id),
        destructive: true,
        disabled: row.status !== 'pending',
      },
    ],
  },
};

// Products table
export const ProductsTable: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    
    return (
      <DataTable
        data={products}
        columns={productColumns}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        searchable
        searchPlaceholder="Search products..."
        bulkActions={[
          {
            label: 'Update prices',
            icon: 'edit',
            onClick: (ids) => console.log('Update prices:', ids),
          },
          {
            label: 'Delete',
            icon: 'trash',
            variant: 'destructive',
            onClick: (ids) => console.log('Delete:', ids),
          },
        ]}
        rowActions={(row) => [
          {
            label: 'Edit',
            icon: 'edit',
            onClick: () => console.log('Edit:', row.id),
          },
          {
            label: 'Duplicate',
            icon: 'copy',
            onClick: () => console.log('Duplicate:', row.id),
          },
          {
            label: 'Archive',
            icon: 'archive',
            onClick: () => console.log('Archive:', row.id),
          },
        ]}
      />
    );
  },
};

// With expandable rows
export const ExpandableRows: Story = {
  args: {
    data: orders,
    columns: orderColumns,
    expandable: true,
    renderExpandedRow: (row) => (
      <div className="space-y-2">
        <h4 className="font-semibold">Order Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-neutral-600 dark:text-neutral-400">Customer:</span> {row.customer}
          </div>
          <div>
            <span className="text-neutral-600 dark:text-neutral-400">Date:</span> {row.date}
          </div>
          <div>
            <span className="text-neutral-600 dark:text-neutral-400">Items:</span> {row.items}
          </div>
          <div>
            <span className="text-neutral-600 dark:text-neutral-400">Total:</span> ${row.total}
          </div>
        </div>
      </div>
    ),
  },
};

// Loading state
export const Loading: Story = {
  args: {
    data: [],
    columns: userColumns,
    loading: true,
    loadingRows: 5,
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    data: [],
    columns: userColumns,
    emptyMessage: 'No users found',
    emptyIcon: 'users',
    emptyAction: {
      label: 'Add user',
      onClick: () => console.log('Add user'),
    },
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default</h3>
        <DataTable
          data={users.slice(0, 3)}
          columns={userColumns}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Bordered</h3>
        <DataTable
          data={users.slice(0, 3)}
          columns={userColumns}
          variant="bordered"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Striped</h3>
        <DataTable
          data={users.slice(0, 3)}
          columns={userColumns}
          variant="striped"
        />
      </div>
    </div>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small</h3>
        <DataTable
          data={users.slice(0, 3)}
          columns={userColumns}
          size="sm"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Medium (default)</h3>
        <DataTable
          data={users.slice(0, 3)}
          columns={userColumns}
          size="md"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Large</h3>
        <DataTable
          data={users.slice(0, 3)}
          columns={userColumns}
          size="lg"
        />
      </div>
    </div>
  ),
};

// Full featured example
export const FullFeatured: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    // Filter and sort data
    let filteredData = [...orders];
    
    if (searchValue) {
      filteredData = filteredData.filter(order =>
        order.orderNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    if (sortColumn) {
      filteredData.sort((a, b) => {
        const aVal = a[sortColumn as keyof Order];
        const bVal = b[sortColumn as keyof Order];
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
    
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedData = filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    
    return (
      <DataTable
        data={paginatedData}
        columns={orderColumns}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        sortable
        onSort={(column, direction) => {
          setSortColumn(column);
          setSortDirection(direction);
        }}
        searchable
        searchPlaceholder="Search orders..."
        onSearch={setSearchValue}
        filters={
          <>
            <select className="px-3 py-2 border rounded-md">
              <option>All statuses</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <input 
              type="date" 
              className="px-3 py-2 border rounded-md"
              placeholder="Date range"
            />
          </>
        }
        bulkActions={[
          {
            label: 'Export',
            icon: 'download',
            onClick: (ids) => console.log('Export:', ids),
          },
          {
            label: 'Archive',
            icon: 'archive',
            onClick: (ids) => console.log('Archive:', ids),
          },
        ]}
        rowActions={(row) => [
          {
            label: 'View',
            icon: 'eye',
            onClick: () => console.log('View:', row.id),
          },
          {
            label: 'Edit',
            icon: 'edit',
            onClick: () => console.log('Edit:', row.id),
          },
          {
            label: 'Delete',
            icon: 'trash',
            onClick: () => console.log('Delete:', row.id),
            destructive: true,
          },
        ]}
        pagination={{
          currentPage,
          pageSize,
          totalPages,
          totalItems,
          onPageChange: setCurrentPage,
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
        }}
        stickyHeader
        maxHeight="600px"
      />
    );
  },
};