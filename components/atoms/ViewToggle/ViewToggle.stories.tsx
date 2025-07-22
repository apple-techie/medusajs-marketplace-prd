import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ViewToggle } from './ViewToggle';

const meta = {
  title: 'Atoms/ViewToggle',
  component: ViewToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'select',
      options: ['grid', 'list'],
      description: 'Current view mode',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Toggle size',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'Visual variant',
    },
    showLabels: {
      control: 'boolean',
      description: 'Show text labels',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof ViewToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default view toggle
export const Default: Story = {
  args: {
    value: 'grid',
  },
};

// Grid view active
export const GridView: Story = {
  args: {
    value: 'grid',
  },
};

// List view active
export const ListView: Story = {
  args: {
    value: 'list',
  },
};

// With labels
export const WithLabels: Story = {
  args: {
    value: 'grid',
    showLabels: true,
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex items-center gap-4">
        <span className="text-sm w-20">Small:</span>
        <ViewToggle value="grid" size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-20">Medium:</span>
        <ViewToggle value="grid" size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-20">Large:</span>
        <ViewToggle value="grid" size="lg" />
      </div>
    </div>
  ),
};

// Sizes with labels
export const SizesWithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <ViewToggle value="grid" size="sm" showLabels />
      <ViewToggle value="grid" size="md" showLabels />
      <ViewToggle value="grid" size="lg" showLabels />
    </div>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex items-center gap-4">
        <span className="text-sm w-20">Default:</span>
        <ViewToggle value="grid" variant="default" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-20">Outline:</span>
        <ViewToggle value="grid" variant="outline" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-20">Ghost:</span>
        <ViewToggle value="grid" variant="ghost" />
      </div>
    </div>
  ),
};

// Disabled state
export const Disabled: Story = {
  args: {
    value: 'grid',
    disabled: true,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    
    return (
      <div className="space-y-4">
        <ViewToggle value={view} onChange={setView} />
        
        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded">
          <p className="text-sm">
            Current view: <strong>{view}</strong>
          </p>
        </div>
        
        <div className="w-64">
          {view === 'grid' ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
};

// Product listing example
export const ProductListing: Story = {
  render: () => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    
    const products = [
      { id: 1, name: 'Product 1', price: '$99.99' },
      { id: 2, name: 'Product 2', price: '$149.99' },
      { id: 3, name: 'Product 3', price: '$79.99' },
      { id: 4, name: 'Product 4', price: '$199.99' },
    ];
    
    return (
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Products</h2>
          <ViewToggle value={view} onChange={setView} />
        </div>
        
        {view === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="h-32 bg-neutral-100 dark:bg-neutral-800 rounded mb-3" />
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-neutral-600">{product.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="flex gap-4 border rounded-lg p-4">
                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-neutral-600 mb-2">{product.price}</p>
                  <p className="text-sm text-neutral-500">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};

// With other controls
export const WithOtherControls: Story = {
  render: () => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    
    return (
      <div className="flex items-center gap-4">
        <select className="px-3 py-1.5 border rounded-md text-sm">
          <option>Sort by: Newest</option>
          <option>Sort by: Price</option>
          <option>Sort by: Name</option>
        </select>
        
        <ViewToggle value={view} onChange={setView} size="sm" />
      </div>
    );
  },
};

// Custom labels
export const CustomLabels: Story = {
  args: {
    value: 'grid',
    gridLabel: 'Thumbnail view',
    listLabel: 'Detailed view',
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded">
      <div className="flex flex-col gap-4 items-center">
        <ViewToggle value="grid" variant="default" />
        <ViewToggle value="list" variant="outline" />
        <ViewToggle value="grid" variant="ghost" />
        <ViewToggle value="list" showLabels />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

// File explorer example
export const FileExplorer: Story = {
  render: () => {
    const [view, setView] = useState<'grid' | 'list'>('list');
    
    const files = [
      { name: 'Document.pdf', size: '2.5 MB', type: 'pdf' },
      { name: 'Image.jpg', size: '1.2 MB', type: 'image' },
      { name: 'Spreadsheet.xlsx', size: '456 KB', type: 'excel' },
      { name: 'Presentation.pptx', size: '3.8 MB', type: 'powerpoint' },
    ];
    
    return (
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">4 items</span>
          </div>
          <ViewToggle value={view} onChange={setView} size="sm" variant="outline" />
        </div>
        
        {view === 'grid' ? (
          <div className="grid grid-cols-4 gap-3">
            {files.map((file, i) => (
              <div key={i} className="text-center">
                <div className="w-full aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-2 flex items-center justify-center">
                  <div className="text-3xl text-neutral-400">📄</div>
                </div>
                <p className="text-xs truncate">{file.name}</p>
                <p className="text-xs text-neutral-500">{file.size}</p>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 text-sm font-medium">Name</th>
                <th className="pb-2 text-sm font-medium">Size</th>
                <th className="pb-2 text-sm font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 text-sm">{file.name}</td>
                  <td className="py-2 text-sm text-neutral-600">{file.size}</td>
                  <td className="py-2 text-sm text-neutral-600">{file.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  },
};

// Gallery example
export const Gallery: Story = {
  render: () => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    
    return (
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Photo Gallery</h2>
            <p className="text-sm text-neutral-600">120 photos</p>
          </div>
          <ViewToggle value={view} onChange={setView} showLabels variant="outline" />
        </div>
        
        {view === 'grid' ? (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 rounded"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="w-32 h-32 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 rounded flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Photo {i + 1}</h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    Taken on December {i + 1}, 2023
                  </p>
                  <div className="flex gap-4 text-sm text-neutral-500">
                    <span>3024 × 4032</span>
                    <span>2.5 MB</span>
                    <span>iPhone 14 Pro</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};