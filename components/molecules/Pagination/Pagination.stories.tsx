import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Pagination, SimplePagination, usePagination } from './Pagination';

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: 'number',
      min: 1,
    },
    totalPages: {
      control: 'number',
      min: 1,
    },
    siblingCount: {
      control: 'number',
      min: 0,
    },
    boundaryCount: {
      control: 'number',
      min: 0,
    },
    showFirstLast: {
      control: 'boolean',
    },
    showPrevNext: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example
export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log(`Navigate to page ${page}`),
  },
};

// Many pages with ellipsis
export const ManyPages: Story = {
  args: {
    currentPage: 10,
    totalPages: 50,
    onPageChange: (page) => console.log(`Navigate to page ${page}`),
  },
};

// With first/last buttons
export const WithFirstLast: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    showFirstLast: true,
    onPageChange: (page) => console.log(`Navigate to page ${page}`),
  },
};

// Without prev/next buttons
export const NumbersOnly: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    showPrevNext: false,
    onPageChange: (page) => console.log(`Navigate to page ${page}`),
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 20;
    
    return (
      <div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showFirstLast={true}
        />
        
        <div className="mt-8 p-4 bg-neutral-50 rounded-lg">
          <p className="text-sm text-neutral-600">
            Currently viewing page {currentPage} of {totalPages}
          </p>
        </div>
      </div>
    );
  },
};

// E-commerce product listing
export const ProductListing: Story = {
  render: () => {
    const itemsPerPage = 12;
    const totalItems = 156;
    const { 
      currentPage, 
      totalPages, 
      startIndex, 
      endIndex, 
      goToPage,
      hasNextPage,
      hasPreviousPage 
    } = usePagination(totalItems, itemsPerPage);
    
    // Mock products
    const products = Array.from({ length: totalItems }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: `$${(Math.random() * 100).toFixed(2)}`,
    }));
    
    const currentProducts = products.slice(startIndex, endIndex);
    
    return (
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-medium">Products</h3>
          <p className="text-sm text-neutral-600">
            Showing {startIndex + 1}-{endIndex} of {totalItems} products
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          {currentProducts.map(product => (
            <div key={product.id} className="p-4 border rounded-lg">
              <div className="h-24 bg-neutral-100 rounded mb-2"></div>
              <p className="font-medium">{product.name}</p>
              <p className="text-primary-600">{product.price}</p>
            </div>
          ))}
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          showFirstLast={true}
        />
      </div>
    );
  },
};

// Order history with simple pagination
export const OrderHistory: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
    const totalOrders = 47;
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    
    const orders = Array.from({ length: totalOrders }, (_, i) => ({
      id: `ORD-${1000 + i}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      total: `$${(Math.random() * 500).toFixed(2)}`,
      status: ['Delivered', 'Shipped', 'Processing'][Math.floor(Math.random() * 3)],
    }));
    
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = Math.min(startIndex + ordersPerPage, totalOrders);
    const currentOrders = orders.slice(startIndex, endIndex);
    
    return (
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Order History</h3>
        
        <div className="space-y-3 mb-6">
          {currentOrders.map(order => (
            <div key={order.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-neutral-600">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{order.total}</p>
                <p className="text-sm text-neutral-600">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
        
        <SimplePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  },
};

// Sizes
export const Sizes: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(5);
    
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-medium mb-4">Small</h3>
          <Pagination 
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
            size="sm"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">Medium (Default)</h3>
          <Pagination 
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
            size="md"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">Large</h3>
          <Pagination 
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
            size="lg"
          />
        </div>
      </div>
    );
  },
};

// Custom labels
export const CustomLabels: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    previousLabel: 'Back',
    nextLabel: 'Forward',
    onPageChange: (page) => console.log(`Navigate to page ${page}`),
  },
};

// Different configurations
export const Configurations: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(5);
    
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-medium mb-4">Default Configuration</h3>
          <Pagination 
            currentPage={currentPage}
            totalPages={20}
            onPageChange={setCurrentPage}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">More Siblings (siblingCount=2)</h3>
          <Pagination 
            currentPage={currentPage}
            totalPages={20}
            onPageChange={setCurrentPage}
            siblingCount={2}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">More Boundaries (boundaryCount=2)</h3>
          <Pagination 
            currentPage={currentPage}
            totalPages={20}
            onPageChange={setCurrentPage}
            boundaryCount={2}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">All Navigation Controls</h3>
          <Pagination 
            currentPage={currentPage}
            totalPages={20}
            onPageChange={setCurrentPage}
            showFirstLast={true}
            showPrevNext={true}
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
      </div>
    );
  },
};

// Table with pagination
export const DataTable: Story = {
  render: () => {
    const data = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ['Admin', 'User', 'Guest'][Math.floor(Math.random() * 3)],
      status: ['Active', 'Inactive'][Math.floor(Math.random() * 2)],
    }));
    
    const itemsPerPage = 10;
    const { 
      currentPage, 
      totalPages, 
      startIndex, 
      endIndex, 
      goToPage 
    } = usePagination(data.length, itemsPerPage);
    
    const currentData = data.slice(startIndex, endIndex);
    
    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium">Users</h3>
          <p className="text-sm text-neutral-600">
            {startIndex + 1}-{endIndex} of {data.length} users
          </p>
        </div>
        
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(user => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    user.status === 'Active' 
                      ? 'bg-success-100 text-success-700' 
                      : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    );
  },
};

// Mobile-friendly simple pagination
export const MobileView: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(3);
    const totalPages = 10;
    
    return (
      <div className="max-w-sm mx-auto">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Search Results</h3>
          
          <div className="space-y-3 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-3 bg-neutral-50 rounded">
                <p className="font-medium">Result {(currentPage - 1) * 3 + i}</p>
                <p className="text-sm text-neutral-600">Lorem ipsum dolor sit amet</p>
              </div>
            ))}
          </div>
          
          <SimplePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            size="sm"
          />
        </div>
      </div>
    );
  },
};

// Load more pattern (using hook)
export const LoadMore: Story = {
  render: () => {
    const itemsPerPage = 10;
    const totalItems = 50;
    const [loadedPages, setLoadedPages] = useState(1);
    
    const { 
      goToPage,
      hasNextPage,
      totalPages
    } = usePagination(totalItems, itemsPerPage, loadedPages);
    
    const items = Array.from({ length: loadedPages * itemsPerPage }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
    }));
    
    const handleLoadMore = () => {
      if (loadedPages < totalPages) {
        setLoadedPages(loadedPages + 1);
        goToPage(loadedPages + 1);
      }
    };
    
    return (
      <div>
        <h3 className="text-lg font-medium mb-4">Feed</h3>
        
        <div className="space-y-3 mb-6">
          {items.map(item => (
            <div key={item.id} className="p-4 border rounded-lg">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-neutral-600">Lorem ipsum dolor sit amet consectetur</p>
            </div>
          ))}
        </div>
        
        {hasNextPage && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Load More ({loadedPages * itemsPerPage} of {totalItems})
            </button>
          </div>
        )}
      </div>
    );
  },
};