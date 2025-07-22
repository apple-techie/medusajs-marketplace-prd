import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CategoryGrid, QuickCategoryGrid } from './CategoryGrid';

const meta = {
  title: 'Organisms/CategoryGrid',
  component: CategoryGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'featured', 'mixed'],
      description: 'Grid variant',
    },
    columns: {
      control: 'select',
      options: [2, 3, 4, 5, 6],
      description: 'Number of columns',
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Grid gap size',
    },
    showFilter: {
      control: 'boolean',
      description: 'Show filter dropdown',
    },
    showPagination: {
      control: 'boolean',
      description: 'Enable pagination',
    },
    showFeaturedSeparately: {
      control: 'boolean',
      description: 'Show featured categories in separate section',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
  },
} satisfies Meta<typeof CategoryGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample categories data
const sampleCategories = [
  {
    id: 1,
    title: 'Electronics',
    description: 'Phones, tablets, computers and more',
    href: '/categories/electronics',
    icon: 'desktop',
    productCount: 1234,
    badge: 'Hot',
    badgeVariant: 'danger' as const,
  },
  {
    id: 2,
    title: 'Fashion',
    description: 'Latest trends and styles',
    href: '/categories/fashion',
    icon: 'shopping-bag',
    productCount: 567,
    featured: true,
  },
  {
    id: 3,
    title: 'Home & Garden',
    description: 'Everything for your home',
    href: '/categories/home',
    icon: 'home',
    productCount: 890,
  },
  {
    id: 4,
    title: 'Sports & Outdoors',
    description: 'Gear for active lifestyles',
    href: '/categories/sports',
    icon: 'activity',
    productCount: 345,
    badge: 'Sale',
    badgeVariant: 'success' as const,
  },
  {
    id: 5,
    title: 'Beauty & Health',
    description: 'Personal care and wellness',
    href: '/categories/beauty',
    icon: 'heart',
    productCount: 678,
  },
  {
    id: 6,
    title: 'Toys & Games',
    description: 'Fun for all ages',
    href: '/categories/toys',
    icon: 'gift',
    productCount: 234,
    featured: true,
  },
  {
    id: 7,
    title: 'Books & Media',
    description: 'Books, movies, music',
    href: '/categories/books',
    icon: 'book',
    productCount: 456,
  },
  {
    id: 8,
    title: 'Food & Beverages',
    description: 'Groceries and gourmet',
    href: '/categories/food',
    icon: 'coffee',
    productCount: 789,
    badge: 'New',
    badgeVariant: 'primary' as const,
  },
];

// Basic category grid
export const Default: Story = {
  args: {
    categories: sampleCategories,
  },
};

// With header and view all
export const WithHeader: Story = {
  args: {
    categories: sampleCategories,
    title: 'Shop by Category',
    subtitle: 'Browse our wide selection of products',
    showViewAll: true,
    viewAllHref: '/categories',
    viewAllText: 'View All Categories',
  },
};

// With filtering and sorting
export const WithFilterAndSort: Story = {
  args: {
    categories: sampleCategories,
    title: 'All Categories',
    showFilter: true,
    filterOptions: [
      { label: 'Popular', value: 'popular' },
      { label: 'New Arrivals', value: 'new' },
      { label: 'On Sale', value: 'sale' },
    ],
    sortOptions: [
      { label: 'Name A-Z', value: 'name' },
      { label: 'Name Z-A', value: 'name-desc' },
      { label: 'Most Products', value: 'products' },
      { label: 'Least Products', value: 'products-asc' },
    ],
    defaultSort: 'name',
  },
};

// With pagination
export const WithPagination: Story = {
  args: {
    categories: [...sampleCategories, ...sampleCategories.map(c => ({ ...c, id: c.id + 10 }))],
    title: 'Browse Categories',
    showPagination: true,
    itemsPerPage: 6,
  },
};

// Featured categories separated
export const WithFeaturedSection: Story = {
  args: {
    categories: sampleCategories,
    title: 'All Categories',
    showFeaturedSeparately: true,
    featuredTitle: 'Featured Categories',
    featuredSubtitle: 'Popular categories this month',
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
        <CategoryGrid
          categories={sampleCategories.slice(0, 4)}
          variant="default"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Compact Variant</h3>
        <CategoryGrid
          categories={sampleCategories.slice(0, 6)}
          variant="compact"
          columns={6}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Featured Variant</h3>
        <CategoryGrid
          categories={sampleCategories.slice(0, 3)}
          variant="featured"
          columns={3}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Mixed Variant</h3>
        <CategoryGrid
          categories={sampleCategories}
          variant="mixed"
          columns={4}
        />
      </div>
    </div>
  ),
};

// Different column layouts
export const ColumnLayouts: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <h3 className="text-lg font-semibold mb-4">2 Columns</h3>
        <CategoryGrid
          categories={sampleCategories.slice(0, 4)}
          columns={2}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">3 Columns</h3>
        <CategoryGrid
          categories={sampleCategories.slice(0, 6)}
          columns={3}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">5 Columns</h3>
        <CategoryGrid
          categories={sampleCategories.slice(0, 5)}
          columns={5}
        />
      </div>
    </div>
  ),
};

// Loading state
export const LoadingState: Story = {
  args: {
    categories: [],
    title: 'Loading Categories',
    loading: true,
    skeletonCount: 8,
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    categories: [],
    title: 'Categories',
  },
};

// With images
export const WithImages: Story = {
  args: {
    categories: sampleCategories.map(cat => ({
      ...cat,
      image: `https://images.unsplash.com/photo-${1500000000000 + cat.id}?w=400`,
      icon: undefined,
    })),
    columns: 3,
  },
};

// Quick category grid
export const QuickGrid: Story = {
  render: () => {
    const quickCategories = [
      { id: 1, title: 'Electronics', icon: 'desktop', href: '/electronics', productCount: 1234 },
      { id: 2, title: 'Fashion', icon: 'shopping-bag', href: '/fashion', productCount: 567 },
      { id: 3, title: 'Home', icon: 'home', href: '/home', productCount: 890 },
      { id: 4, title: 'Sports', icon: 'activity', href: '/sports', productCount: 345 },
      { id: 5, title: 'Beauty', icon: 'heart', href: '/beauty', productCount: 678 },
      { id: 6, title: 'Toys', icon: 'gift', href: '/toys', productCount: 234 },
      { id: 7, title: 'Books', icon: 'book', href: '/books', productCount: 456 },
      { id: 8, title: 'Food', icon: 'coffee', href: '/food', productCount: 789 },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Grid - 6 Columns</h3>
          <QuickCategoryGrid categories={quickCategories} columns={6} />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Grid - 8 Columns</h3>
          <QuickCategoryGrid categories={quickCategories} columns={8} />
        </div>
      </div>
    );
  },
};

// Real-world example
export const MarketplaceCategories: Story = {
  render: () => {
    const marketplaceCategories = [
      {
        id: 1,
        title: 'Electronics & Tech',
        description: 'Latest gadgets and devices',
        href: '/categories/electronics',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        productCount: 5678,
        badge: 'Hot',
        badgeVariant: 'danger' as const,
        featured: true,
      },
      {
        id: 2,
        title: 'Fashion & Apparel',
        description: 'Trending styles for everyone',
        href: '/categories/fashion',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
        productCount: 8901,
        featured: true,
      },
      {
        id: 3,
        title: 'Home & Living',
        description: 'Transform your space',
        href: '/categories/home',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        productCount: 3456,
        badge: 'Sale',
        badgeVariant: 'success' as const,
      },
      {
        id: 4,
        title: 'Sports & Outdoors',
        description: 'Gear for active lifestyles',
        href: '/categories/sports',
        image: 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=400',
        productCount: 2345,
      },
      {
        id: 5,
        title: 'Beauty & Personal Care',
        description: 'Look and feel your best',
        href: '/categories/beauty',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        productCount: 4567,
      },
      {
        id: 6,
        title: 'Toys & Games',
        description: 'Fun for all ages',
        href: '/categories/toys',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        productCount: 1234,
      },
      {
        id: 7,
        title: 'Books & Media',
        description: 'Knowledge and entertainment',
        href: '/categories/books',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        productCount: 3456,
        badge: 'New',
        badgeVariant: 'primary' as const,
      },
      {
        id: 8,
        title: 'Food & Gourmet',
        description: 'Delicious treats and essentials',
        href: '/categories/food',
        image: 'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=400',
        productCount: 2345,
      },
    ];

    return (
      <CategoryGrid
        categories={marketplaceCategories}
        title="Shop by Category"
        subtitle="Discover products from over 10,000 verified vendors"
        showViewAll
        viewAllHref="/categories"
        showFeaturedSeparately
        featuredTitle="Trending Now"
        featuredSubtitle="Most popular categories this week"
        showFilter
        filterOptions={[
          { label: 'Most Popular', value: 'popular' },
          { label: 'New Categories', value: 'new' },
          { label: 'On Sale', value: 'sale' },
        ]}
        columns={4}
        gap="lg"
        onCategoryClick={(category) => console.log('Category clicked:', category)}
      />
    );
  },
};

// Interactive example
export const InteractiveGrid: Story = {
  render: () => {
    const [filter, setFilter] = React.useState('all');
    const [sort, setSort] = React.useState('name');

    const handleFilterChange = (newFilter: string) => {
      setFilter(newFilter);
      console.log('Filter changed to:', newFilter);
    };

    const handleSortChange = (newSort: string) => {
      setSort(newSort);
      console.log('Sort changed to:', newSort);
    };

    const handleCategoryClick = (category: any) => {
      alert(`Clicked on: ${category.title}`);
    };

    return (
      <CategoryGrid
        categories={sampleCategories}
        title="Interactive Category Grid"
        subtitle="Click on categories to see interactions"
        showFilter
        filterOptions={[
          { label: 'All Categories', value: 'all' },
          { label: 'Featured Only', value: 'featured' },
          { label: 'With Badges', value: 'badges' },
        ]}
        defaultFilter={filter}
        sortOptions={[
          { label: 'Name A-Z', value: 'name' },
          { label: 'Name Z-A', value: 'name-desc' },
          { label: 'Most Products', value: 'products' },
        ]}
        defaultSort={sort}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onCategoryClick={handleCategoryClick}
        showPagination
        itemsPerPage={4}
      />
    );
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 text-white p-8 rounded-lg">
      <CategoryGrid
        categories={sampleCategories}
        title="Dark Mode Categories"
        subtitle="Beautiful in dark theme"
        showViewAll
        viewAllHref="/categories"
        columns={4}
      />
    </div>
  ),
};