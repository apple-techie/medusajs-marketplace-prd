import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
  CardSkeleton,
  TableSkeleton,
  FormSkeleton,
  ProductSkeleton,
  ListItemSkeleton,
} from './Skeleton';

const meta = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'text' },
      description: 'Width of the skeleton (number or string)',
    },
    height: {
      control: { type: 'text' },
      description: 'Height of the skeleton (number or string)',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'light', 'dark'],
      description: 'Visual variant of the skeleton',
    },
    animation: {
      control: 'select',
      options: ['pulse', 'wave', 'none'],
      description: 'Animation type',
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Border radius variant',
    },
    as: {
      control: 'select',
      options: ['div', 'span', 'p'],
      description: 'HTML element to render',
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic skeleton
export const Default: Story = {
  args: {
    width: 200,
    height: 20,
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Default</p>
        <Skeleton width={200} height={20} variant="default" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Primary</p>
        <Skeleton width={200} height={20} variant="primary" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Secondary</p>
        <Skeleton width={200} height={20} variant="secondary" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Light</p>
        <Skeleton width={200} height={20} variant="light" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Dark</p>
        <Skeleton width={200} height={20} variant="dark" />
      </div>
    </div>
  ),
};

// Different animations
export const Animations: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Pulse (default)</p>
        <Skeleton width={200} height={40} animation="pulse" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Wave</p>
        <Skeleton width={200} height={40} animation="wave" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">No animation</p>
        <Skeleton width={200} height={40} animation="none" />
      </div>
    </div>
  ),
};

// Different shapes
export const Shapes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Square (rounded-none)</p>
        <Skeleton width={100} height={100} rounded="none" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Rounded (rounded-md)</p>
        <Skeleton width={100} height={100} rounded="md" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Very rounded (rounded-xl)</p>
        <Skeleton width={100} height={100} rounded="xl" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Circle (rounded-full)</p>
        <Skeleton width={100} height={100} rounded="full" />
      </div>
    </div>
  ),
};

// Text skeleton
export const TextSkeletons: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Paragraph (3 lines)</p>
        <TextSkeleton lines={3} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Long text (5 lines)</p>
        <TextSkeleton lines={5} lastLineWidth="60%" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Custom line height</p>
        <TextSkeleton lines={3} lineHeight={24} spacing={12} />
      </div>
    </div>
  ),
};

// Avatar skeletons
export const AvatarSkeletons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <AvatarSkeleton size="xs" />
        <p className="text-xs mt-1">XS</p>
      </div>
      <div className="text-center">
        <AvatarSkeleton size="sm" />
        <p className="text-xs mt-1">SM</p>
      </div>
      <div className="text-center">
        <AvatarSkeleton size="md" />
        <p className="text-xs mt-1">MD</p>
      </div>
      <div className="text-center">
        <AvatarSkeleton size="lg" />
        <p className="text-xs mt-1">LG</p>
      </div>
      <div className="text-center">
        <AvatarSkeleton size="xl" />
        <p className="text-xs mt-1">XL</p>
      </div>
    </div>
  ),
};

// Button skeletons
export const ButtonSkeletons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ButtonSkeleton size="sm" />
        <span className="text-sm">Small</span>
      </div>
      <div className="flex items-center gap-3">
        <ButtonSkeleton size="md" />
        <span className="text-sm">Medium</span>
      </div>
      <div className="flex items-center gap-3">
        <ButtonSkeleton size="lg" />
        <span className="text-sm">Large</span>
      </div>
      <div className="flex items-center gap-3">
        <ButtonSkeleton width={200} />
        <span className="text-sm">Custom width</span>
      </div>
    </div>
  ),
};

// Card skeleton
export const CardSkeletons: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Full card</p>
        <CardSkeleton />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">No image</p>
        <CardSkeleton showImage={false} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Minimal</p>
        <CardSkeleton 
          showDescription={false} 
          showActions={false}
          imageHeight={150}
        />
      </div>
    </div>
  ),
};

// Table skeleton
export const TableSkeletons: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Basic table</p>
        <TableSkeleton rows={5} columns={4} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Custom column widths</p>
        <TableSkeleton 
          rows={3} 
          columns={4}
          columnWidths={['40%', '20%', '20%', '20%']}
        />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">No header</p>
        <TableSkeleton rows={3} columns={3} showHeader={false} />
      </div>
    </div>
  ),
};

// Form skeleton
export const FormSkeletons: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Login form</p>
        <FormSkeleton fields={2} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Registration form</p>
        <FormSkeleton fields={4} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">No labels</p>
        <FormSkeleton fields={3} showLabels={false} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">No button</p>
        <FormSkeleton fields={3} showButton={false} />
      </div>
    </div>
  ),
};

// Product skeleton
export const ProductSkeletons: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Product grid</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductSkeleton />
          <ProductSkeleton showBadge={false} />
          <ProductSkeleton showRating={false} />
          <ProductSkeleton showPrice={false} />
        </div>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Product list</p>
        <div className="space-y-4">
          <ProductSkeleton orientation="horizontal" />
          <ProductSkeleton orientation="horizontal" showBadge={false} />
          <ProductSkeleton orientation="horizontal" showRating={false} />
        </div>
      </div>
    </div>
  ),
};

// List item skeleton
export const ListItemSkeletons: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div>
        <p className="text-sm text-neutral-600 mb-2">User list</p>
        <div className="space-y-3">
          <ListItemSkeleton />
          <ListItemSkeleton />
          <ListItemSkeleton />
        </div>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Simple list</p>
        <div className="space-y-3">
          <ListItemSkeleton showAvatar={false} />
          <ListItemSkeleton showAvatar={false} />
          <ListItemSkeleton showAvatar={false} />
        </div>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">With actions</p>
        <div className="space-y-3">
          <ListItemSkeleton showAction />
          <ListItemSkeleton showAction />
          <ListItemSkeleton showAction />
        </div>
      </div>
    </div>
  ),
};

// Real-world example: Product page
export const ProductPage: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product images */}
        <div className="space-y-4">
          <Skeleton width="100%" height={400} rounded="lg" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} width="100%" height={80} rounded="md" />
            ))}
          </div>
        </div>
        
        {/* Product info */}
        <div className="space-y-4">
          <Skeleton width="80%" height={32} />
          <div className="flex items-center gap-2">
            <Skeleton width={120} height={20} />
            <Skeleton width={60} height={20} />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton width={80} height={36} />
            <Skeleton width={60} height={24} />
          </div>
          <TextSkeleton lines={4} />
          
          <div className="space-y-3 pt-4">
            <FormSkeleton fields={2} showButton={false} />
            <div className="flex gap-3">
              <ButtonSkeleton size="lg" width={200} />
              <ButtonSkeleton size="lg" width={150} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Related products */}
      <div className="mt-12">
        <Skeleton width={200} height={28} className="mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  ),
};

// Real-world example: Dashboard
export const Dashboard: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton width="60%" height={16} className="mb-2" />
            <Skeleton width="80%" height={32} />
          </div>
        ))}
      </div>
      
      {/* Chart placeholder */}
      <div className="border rounded-lg p-6">
        <Skeleton width={200} height={24} className="mb-4" />
        <Skeleton width="100%" height={300} rounded="md" />
      </div>
      
      {/* Recent activities */}
      <div className="border rounded-lg p-6">
        <Skeleton width={150} height={24} className="mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  ),
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 text-white p-8 rounded-lg">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Dark Theme Skeletons</h3>
          <div className="space-y-3">
            <Skeleton width="100%" height={20} />
            <TextSkeleton lines={3} />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton showImage={false} />
          <div className="space-y-3">
            <AvatarSkeleton size="lg" />
            <ButtonSkeleton width="100%" />
          </div>
        </div>
        
        <TableSkeleton rows={3} columns={4} />
      </div>
    </div>
  ),
};