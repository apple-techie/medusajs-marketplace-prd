import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SubMenuTreeItem, SubMenuTree, useSubMenuTree, type TreeItem } from './SubMenuTreeItem';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';

const meta = {
  title: 'Molecules/SubMenuTreeItem',
  component: SubMenuTreeItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'rounded', 'minimal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showExpandIcon: {
      control: 'boolean',
    },
    showConnectors: {
      control: 'boolean',
    },
    indentSize: {
      control: { type: 'range', min: 16, max: 40, step: 4 },
    },
  },
} satisfies Meta<typeof SubMenuTreeItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const singleItem: TreeItem = {
  id: '1',
  label: 'Dashboard',
  icon: 'home',
};

const itemWithChildren: TreeItem = {
  id: 'products',
  label: 'Products',
  icon: 'package',
  children: [
    { id: 'all-products', label: 'All Products', icon: 'list' },
    { id: 'add-product', label: 'Add Product', icon: 'plus' },
    { id: 'categories', label: 'Categories', icon: 'folder' },
  ],
};

const nestedItems: TreeItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'home',
  },
  {
    id: 'products',
    label: 'Products',
    icon: 'package',
    badge: '12',
    children: [
      { id: 'all-products', label: 'All Products', icon: 'list' },
      { id: 'add-product', label: 'Add Product', icon: 'plus' },
      {
        id: 'categories',
        label: 'Categories',
        icon: 'folder',
        children: [
          { id: 'electronics', label: 'Electronics', icon: 'zap' },
          { id: 'clothing', label: 'Clothing', icon: 'shirt' },
          { id: 'books', label: 'Books', icon: 'book' },
        ],
      },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: 'shoppingBag',
    badge: '5',
    badgeVariant: 'danger',
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'users',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    disabled: true,
  },
];

// Basic example
export const Default: Story = {
  args: {
    item: singleItem,
  },
};

// With children
export const WithChildren: Story = {
  args: {
    item: itemWithChildren,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [activeId, setActiveId] = useState<string>('');

    const handleToggle = (item: TreeItem) => {
      setExpandedIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    };

    const handleClick = (item: TreeItem) => {
      if (!item.children) {
        setActiveId(item.id);
        console.log('Clicked:', item.label);
      }
    };

    return (
      <div className="w-64 border border-neutral-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-neutral-700 mb-4">Navigation</h3>
        <SubMenuTreeItem
          item={itemWithChildren}
          isExpanded={expandedIds.has(itemWithChildren.id)}
          isActive={activeId === itemWithChildren.id}
          onToggle={handleToggle}
          onClick={handleClick}
          onActiveChange={setActiveId}
        />
      </div>
    );
  },
};

// Full tree example
export const FullTree: Story = {
  render: () => {
    const {
      expandedItemIds,
      activeItemId,
      setActiveItemId,
      toggleItem,
      expandAll,
      collapseAll,
    } = useSubMenuTree(nestedItems, ['products']);

    const handleItemClick = (item: TreeItem) => {
      if (!item.children || item.href) {
        setActiveItemId(item.id);
        console.log('Navigate to:', item.label);
      }
    };

    return (
      <div className="w-64">
        <div className="flex gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
        
        <div className="border border-neutral-200 rounded-lg">
          <SubMenuTree
            items={nestedItems}
            activeItemId={activeItemId}
            expandedItemIds={expandedItemIds}
            onItemClick={handleItemClick}
            onItemToggle={toggleItem}
            onActiveChange={setActiveItemId}
          />
        </div>
        
        {activeItemId && (
          <div className="mt-4 p-3 bg-neutral-100 rounded text-sm">
            Active: {activeItemId}
          </div>
        )}
      </div>
    );
  },
};

// Different variants
export const Variants: Story = {
  render: () => {
    const items: TreeItem[] = [
      {
        id: '1',
        label: 'Default Style',
        icon: 'folder',
        children: [
          { id: '1.1', label: 'Child Item', icon: 'file' },
        ],
      },
    ];

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Default</h3>
          <div className="border border-neutral-200 rounded-lg p-2 w-64">
            <SubMenuTree items={items} variant="default" />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Rounded</h3>
          <div className="border border-neutral-200 rounded-lg p-2 w-64">
            <SubMenuTree items={items} variant="rounded" />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Minimal</h3>
          <div className="border border-neutral-200 rounded-lg p-2 w-64">
            <SubMenuTree items={items} variant="minimal" />
          </div>
        </div>
      </div>
    );
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => {
    const items: TreeItem[] = [
      { id: '1', label: 'Small Size', icon: 'folder' },
      { id: '2', label: 'Medium Size', icon: 'folder' },
      { id: '3', label: 'Large Size', icon: 'folder' },
    ];

    return (
      <div className="space-y-4">
        <div className="border border-neutral-200 rounded-lg p-2 w-64">
          <SubMenuTree items={[items[0]]} size="sm" />
        </div>
        <div className="border border-neutral-200 rounded-lg p-2 w-64">
          <SubMenuTree items={[items[1]]} size="md" />
        </div>
        <div className="border border-neutral-200 rounded-lg p-2 w-64">
          <SubMenuTree items={[items[2]]} size="lg" />
        </div>
      </div>
    );
  },
};

// With badges
export const WithBadges: Story = {
  render: () => {
    const items: TreeItem[] = [
      {
        id: 'inbox',
        label: 'Inbox',
        icon: 'mail',
        badge: '12',
        badgeVariant: 'danger',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: 'bell',
        badge: 'New',
        badgeVariant: 'success',
      },
      {
        id: 'tasks',
        label: 'Tasks',
        icon: 'checkSquare',
        badge: '5',
        badgeVariant: 'warning',
        children: [
          { id: 'pending', label: 'Pending', badge: '3' },
          { id: 'completed', label: 'Completed', badge: '2' },
        ],
      },
    ];

    return (
      <div className="w-64 border border-neutral-200 rounded-lg p-2">
        <SubMenuTree items={items} expandedItemIds={new Set(['tasks'])} />
      </div>
    );
  },
};

// With links
export const WithLinks: Story = {
  render: () => {
    const items: TreeItem[] = [
      {
        id: 'home',
        label: 'Home',
        icon: 'home',
        href: '/dashboard',
      },
      {
        id: 'products',
        label: 'Products',
        icon: 'package',
        href: '/products',
      },
      {
        id: 'docs',
        label: 'Documentation',
        icon: 'book',
        children: [
          { id: 'getting-started', label: 'Getting Started', href: '/docs/start' },
          { id: 'api', label: 'API Reference', href: '/docs/api' },
          { id: 'examples', label: 'Examples', href: '/docs/examples' },
        ],
      },
    ];

    return (
      <div className="w-64 border border-neutral-200 rounded-lg p-2">
        <SubMenuTree items={items} />
      </div>
    );
  },
};

// With connectors
export const WithConnectors: Story = {
  render: () => {
    const items: TreeItem[] = [
      {
        id: '1',
        label: 'Root Item 1',
        icon: 'folder',
        children: [
          {
            id: '1.1',
            label: 'Branch 1.1',
            icon: 'folder',
            children: [
              { id: '1.1.1', label: 'Leaf 1.1.1', icon: 'file' },
              { id: '1.1.2', label: 'Leaf 1.1.2', icon: 'file' },
            ],
          },
          { id: '1.2', label: 'Leaf 1.2', icon: 'file' },
        ],
      },
      {
        id: '2',
        label: 'Root Item 2',
        icon: 'folder',
        children: [
          { id: '2.1', label: 'Leaf 2.1', icon: 'file' },
        ],
      },
    ];

    return (
      <div className="w-64 border border-neutral-200 rounded-lg p-4">
        <SubMenuTree
          items={items}
          showConnectors={true}
          expandedItemIds={new Set(['1', '1.1', '2'])}
        />
      </div>
    );
  },
};

// File explorer example
export const FileExplorer: Story = {
  render: () => {
    const fileTree: TreeItem[] = [
      {
        id: 'src',
        label: 'src',
        icon: 'folder',
        children: [
          {
            id: 'components',
            label: 'components',
            icon: 'folder',
            children: [
              { id: 'Button.tsx', label: 'Button.tsx', icon: 'file' },
              { id: 'Input.tsx', label: 'Input.tsx', icon: 'file' },
              { id: 'Modal.tsx', label: 'Modal.tsx', icon: 'file' },
            ],
          },
          {
            id: 'pages',
            label: 'pages',
            icon: 'folder',
            children: [
              { id: 'index.tsx', label: 'index.tsx', icon: 'file' },
              { id: 'about.tsx', label: 'about.tsx', icon: 'file' },
            ],
          },
          { id: 'app.tsx', label: 'app.tsx', icon: 'file' },
          { id: 'main.tsx', label: 'main.tsx', icon: 'file' },
        ],
      },
      { id: 'package.json', label: 'package.json', icon: 'package' },
      { id: 'README.md', label: 'README.md', icon: 'fileText' },
    ];

    const {
      expandedItemIds,
      activeItemId,
      setActiveItemId,
      toggleItem,
      expandToItem,
    } = useSubMenuTree(fileTree);

    return (
      <div className="w-80">
        <div className="bg-neutral-900 text-white p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-4">File Explorer</h3>
          <div className="[&_.text-neutral-500]:text-neutral-400 [&_.hover\\:bg-neutral-50:hover]:bg-neutral-800 [&_.bg-primary-50]:bg-primary-900 [&_.text-primary-700]:text-primary-400">
            <SubMenuTree
              items={fileTree}
              activeItemId={activeItemId}
              expandedItemIds={expandedItemIds}
              onItemClick={(item) => !item.children && setActiveItemId(item.id)}
              onItemToggle={toggleItem}
              variant="minimal"
              size="sm"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button
            size="sm"
            onClick={() => expandToItem('Modal.tsx')}
          >
            Expand to Modal.tsx
          </Button>
        </div>
      </div>
    );
  },
};

// Settings menu example
export const SettingsMenu: Story = {
  render: () => {
    const settingsItems: TreeItem[] = [
      {
        id: 'profile',
        label: 'Profile',
        icon: 'user',
        children: [
          { id: 'edit-profile', label: 'Edit Profile', icon: 'edit' },
          { id: 'avatar', label: 'Change Avatar', icon: 'image' },
          { id: 'password', label: 'Change Password', icon: 'lock' },
        ],
      },
      {
        id: 'preferences',
        label: 'Preferences',
        icon: 'settings',
        children: [
          { id: 'theme', label: 'Theme', icon: 'palette' },
          { id: 'language', label: 'Language', icon: 'globe' },
          { id: 'notifications', label: 'Notifications', icon: 'bell' },
        ],
      },
      {
        id: 'security',
        label: 'Security',
        icon: 'shield',
        badge: '!',
        badgeVariant: 'danger',
        children: [
          { id: 'two-factor', label: 'Two-Factor Auth', icon: 'smartphone' },
          { id: 'sessions', label: 'Active Sessions', icon: 'monitor' },
          { id: 'api-keys', label: 'API Keys', icon: 'key' },
        ],
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: 'creditCard',
        disabled: true,
      },
    ];

    const { expandedItemIds, activeItemId, setActiveItemId, toggleItem } = 
      useSubMenuTree(settingsItems, ['profile', 'security']);

    return (
      <div className="w-72 border border-neutral-200 rounded-lg overflow-hidden">
        <div className="bg-neutral-50 p-4 border-b border-neutral-200">
          <h3 className="font-medium">Settings</h3>
        </div>
        <div className="p-2">
          <SubMenuTree
            items={settingsItems}
            activeItemId={activeItemId}
            expandedItemIds={expandedItemIds}
            onItemClick={(item) => !item.children && setActiveItemId(item.id)}
            onItemToggle={toggleItem}
            variant="rounded"
          />
        </div>
      </div>
    );
  },
};