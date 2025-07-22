import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TableCellHeader, TableHeaderRow, type SortDirection } from './TableCellHeader';
import { Icon } from '../../atoms/Icon/Icon';

const meta = {
  title: 'Molecules/TableCellHeader',
  component: TableCellHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'dark', 'transparent'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    sortDirection: {
      control: 'select',
      options: [null, 'asc', 'desc'],
    },
    sortable: {
      control: 'boolean',
    },
    showSortIcon: {
      control: 'boolean',
    },
    sticky: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof TableCellHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  render: () => (
    <table className="w-full">
      <thead>
        <tr>
          <TableCellHeader>Heading</TableCellHeader>
        </tr>
      </thead>
    </table>
  ),
};

export const Sortable: Story = {
  render: () => {
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    
    const handleSort = () => {
      setSortDirection(current => {
        if (current === null) return 'asc';
        if (current === 'asc') return 'desc';
        return null;
      });
    };
    
    return (
      <table className="w-full">
        <thead>
          <tr>
            <TableCellHeader 
              sortable 
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              Sortable Column
            </TableCellHeader>
          </tr>
        </thead>
      </table>
    );
  },
};

export const WithIcon: Story = {
  render: () => (
    <table className="w-full">
      <thead>
        <tr>
          <TableCellHeader icon={<Icon icon="package" size="xs" />}>
            Products
          </TableCellHeader>
        </tr>
      </thead>
    </table>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <table className="w-full">
        <thead>
          <tr>
            <TableCellHeader variant="default">Default Variant</TableCellHeader>
          </tr>
        </thead>
      </table>
      
      <table className="w-full">
        <thead>
          <tr>
            <TableCellHeader variant="dark">Dark Variant</TableCellHeader>
          </tr>
        </thead>
      </table>
      
      <table className="w-full">
        <thead>
          <tr>
            <TableCellHeader variant="transparent">Transparent Variant</TableCellHeader>
          </tr>
        </thead>
      </table>
    </div>
  ),
};

// Alignment
export const Alignment: Story = {
  render: () => (
    <table className="w-full">
      <thead>
        <TableHeaderRow>
          <TableCellHeader align="left">Left Aligned</TableCellHeader>
          <TableCellHeader align="center">Center Aligned</TableCellHeader>
          <TableCellHeader align="right">Right Aligned</TableCellHeader>
        </TableHeaderRow>
      </thead>
    </table>
  ),
};

// E-commerce examples
export const ProductTable: Story = {
  render: () => {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    
    const handleSort = (key: string) => {
      if (sortKey === key) {
        setSortDirection(current => {
          if (current === 'asc') return 'desc';
          if (current === 'desc') return null;
          return 'asc';
        });
      } else {
        setSortKey(key);
        setSortDirection('asc');
      }
    };
    
    return (
      <table className="w-full border">
        <thead>
          <TableHeaderRow>
            <TableCellHeader icon={<Icon icon="package" size="xs" />}>
              Product
            </TableCellHeader>
            <TableCellHeader>
              SKU
            </TableCellHeader>
            <TableCellHeader 
              sortable
              sortDirection={sortKey === 'price' ? sortDirection : null}
              onSort={() => handleSort('price')}
              align="right"
            >
              Price
            </TableCellHeader>
            <TableCellHeader 
              sortable
              sortDirection={sortKey === 'stock' ? sortDirection : null}
              onSort={() => handleSort('stock')}
              align="center"
            >
              Stock
            </TableCellHeader>
            <TableCellHeader align="center">
              Status
            </TableCellHeader>
          </TableHeaderRow>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-3">Wireless Headphones</td>
            <td className="px-4 py-3">WH-1000XM4</td>
            <td className="px-4 py-3 text-right">$349.99</td>
            <td className="px-4 py-3 text-center">15</td>
            <td className="px-4 py-3 text-center">
              <span className="px-2 py-1 text-xs bg-success-100 text-success-700 rounded">
                In Stock
              </span>
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3">Smart Watch</td>
            <td className="px-4 py-3">SW-SERIES7</td>
            <td className="px-4 py-3 text-right">$399.99</td>
            <td className="px-4 py-3 text-center">3</td>
            <td className="px-4 py-3 text-center">
              <span className="px-2 py-1 text-xs bg-warning-100 text-warning-700 rounded">
                Low Stock
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
};

export const OrdersTable: Story = {
  render: () => {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    
    const handleSort = (key: string) => {
      if (sortKey === key) {
        setSortDirection(current => {
          if (current === 'asc') return 'desc';
          if (current === 'desc') return null;
          return 'asc';
        });
      } else {
        setSortKey(key);
        setSortDirection('asc');
      }
    };
    
    return (
      <table className="w-full border">
        <thead>
          <TableHeaderRow variant="dark">
            <TableCellHeader 
              variant="dark"
              sortable
              sortDirection={sortKey === 'order' ? sortDirection : null}
              onSort={() => handleSort('order')}
            >
              Order ID
            </TableCellHeader>
            <TableCellHeader 
              variant="dark"
              sortable
              sortDirection={sortKey === 'date' ? sortDirection : null}
              onSort={() => handleSort('date')}
            >
              Date
            </TableCellHeader>
            <TableCellHeader variant="dark">
              Customer
            </TableCellHeader>
            <TableCellHeader 
              variant="dark"
              sortable
              sortDirection={sortKey === 'total' ? sortDirection : null}
              onSort={() => handleSort('total')}
              align="right"
            >
              Total
            </TableCellHeader>
            <TableCellHeader variant="dark" align="center">
              Status
            </TableCellHeader>
          </TableHeaderRow>
        </thead>
        <tbody className="bg-white">
          <tr className="border-b">
            <td className="px-4 py-3 font-medium">#ORD-001</td>
            <td className="px-4 py-3">2025-01-20</td>
            <td className="px-4 py-3">John Doe</td>
            <td className="px-4 py-3 text-right">$125.99</td>
            <td className="px-4 py-3 text-center">
              <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded">
                Processing
              </span>
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium">#ORD-002</td>
            <td className="px-4 py-3">2025-01-19</td>
            <td className="px-4 py-3">Jane Smith</td>
            <td className="px-4 py-3 text-right">$89.50</td>
            <td className="px-4 py-3 text-center">
              <span className="px-2 py-1 text-xs bg-success-100 text-success-700 rounded">
                Delivered
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
};

export const VendorDashboard: Story = {
  render: () => (
    <div className="bg-white rounded-lg shadow-sm">
      <table className="w-full">
        <thead>
          <TableHeaderRow>
            <TableCellHeader sticky width="40%">
              Product Name
            </TableCellHeader>
            <TableCellHeader align="center">
              Category
            </TableCellHeader>
            <TableCellHeader align="right">
              Revenue
            </TableCellHeader>
            <TableCellHeader align="right">
              Commission (15%)
            </TableCellHeader>
            <TableCellHeader align="center">
              Actions
            </TableCellHeader>
          </TableHeaderRow>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-neutral-50">
            <td className="px-4 py-3">Premium Leather Wallet</td>
            <td className="px-4 py-3 text-center">Accessories</td>
            <td className="px-4 py-3 text-right">$1,250.00</td>
            <td className="px-4 py-3 text-right text-success-600">$187.50</td>
            <td className="px-4 py-3 text-center">
              <button className="text-primary-600 hover:underline text-sm">
                View Details
              </button>
            </td>
          </tr>
          <tr className="border-b hover:bg-neutral-50">
            <td className="px-4 py-3">Organic Cotton T-Shirt</td>
            <td className="px-4 py-3 text-center">Clothing</td>
            <td className="px-4 py-3 text-right">$850.00</td>
            <td className="px-4 py-3 text-right text-success-600">$127.50</td>
            <td className="px-4 py-3 text-center">
              <button className="text-primary-600 hover:underline text-sm">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

// Complex sorting example
export const MultiColumnSort: Story = {
  render: () => {
    const columns = [
      { key: 'name', label: 'Name', sortable: true, align: 'left' as const },
      { key: 'email', label: 'Email', sortable: true, align: 'left' as const },
      { key: 'role', label: 'Role', sortable: false, align: 'center' as const },
      { key: 'lastActive', label: 'Last Active', sortable: true, align: 'right' as const },
    ];
    
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: SortDirection;
    }>({ key: '', direction: null });
    
    const handleSort = (key: string) => {
      setSortConfig(current => {
        if (current.key === key) {
          const nextDirection = 
            current.direction === null ? 'asc' :
            current.direction === 'asc' ? 'desc' : null;
          return { key, direction: nextDirection };
        }
        return { key, direction: 'asc' };
      });
    };
    
    return (
      <table className="w-full border">
        <thead>
          <TableHeaderRow>
            {columns.map(column => (
              <TableCellHeader
                key={column.key}
                sortable={column.sortable}
                sortDirection={sortConfig.key === column.key ? sortConfig.direction : null}
                onSort={column.sortable ? () => handleSort(column.key) : undefined}
                align={column.align}
              >
                {column.label}
              </TableCellHeader>
            ))}
          </TableHeaderRow>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-3">Alice Johnson</td>
            <td className="px-4 py-3">alice@example.com</td>
            <td className="px-4 py-3 text-center">Admin</td>
            <td className="px-4 py-3 text-right">2 hours ago</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3">Bob Smith</td>
            <td className="px-4 py-3">bob@example.com</td>
            <td className="px-4 py-3 text-center">User</td>
            <td className="px-4 py-3 text-right">5 minutes ago</td>
          </tr>
        </tbody>
      </table>
    );
  },
};

// Sticky header example
export const StickyHeaders: Story = {
  render: () => (
    <div className="h-64 overflow-auto border">
      <table className="w-full">
        <thead>
          <TableHeaderRow>
            <TableCellHeader sticky>Product</TableCellHeader>
            <TableCellHeader sticky align="right">Price</TableCellHeader>
            <TableCellHeader sticky align="center">Stock</TableCellHeader>
          </TableHeaderRow>
        </thead>
        <tbody>
          {Array.from({ length: 20 }, (_, i) => (
            <tr key={i} className="border-b">
              <td className="px-4 py-3">Product {i + 1}</td>
              <td className="px-4 py-3 text-right">${(i + 1) * 10}.99</td>
              <td className="px-4 py-3 text-center">{Math.floor(Math.random() * 50)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

// Custom width example
export const CustomWidths: Story = {
  render: () => (
    <table className="w-full border">
      <thead>
        <TableHeaderRow>
          <TableCellHeader width="50%">Product Name (50%)</TableCellHeader>
          <TableCellHeader width="100px">Fixed (100px)</TableCellHeader>
          <TableCellHeader minWidth="150px">Min Width (150px)</TableCellHeader>
          <TableCellHeader>Auto</TableCellHeader>
        </TableHeaderRow>
      </thead>
      <tbody>
        <tr>
          <td className="px-4 py-3 border">Long product name that might wrap</td>
          <td className="px-4 py-3 border">Fixed</td>
          <td className="px-4 py-3 border">Minimum width content</td>
          <td className="px-4 py-3 border">Auto</td>
        </tr>
      </tbody>
    </table>
  ),
};