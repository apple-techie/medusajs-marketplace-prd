import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SearchBar, useSearchBar, type SearchSuggestion, type SearchCategory } from './SearchBar';
import { Icon } from '../../atoms/Icon/Icon';

const meta = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'minimal'],
    },
    showCategoryDropdown: {
      control: 'boolean',
    },
    showSearchButton: {
      control: 'boolean',
    },
    showSuggestions: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const categories: SearchCategory[] = [
  { id: '1', label: 'Electronics', value: 'electronics', icon: 'monitor' },
  { id: '2', label: 'Clothing', value: 'clothing', icon: 'shirt' },
  { id: '3', label: 'Home & Garden', value: 'home', icon: 'home' },
  { id: '4', label: 'Sports', value: 'sports', icon: 'activity' },
  { id: '5', label: 'Books', value: 'books', icon: 'book' },
];

const suggestions: SearchSuggestion[] = [
  { id: '1', text: 'laptop gaming asus', category: 'Electronics', icon: 'monitor' },
  { id: '2', text: 'laptop bag leather', category: 'Accessories', icon: 'briefcase' },
  { id: '3', text: 'laptop stand adjustable', category: 'Office', icon: 'monitor', trending: true },
  { id: '4', text: 'laptop cooling pad', category: 'Electronics', icon: 'monitor' },
];

const recentSearches = [
  'wireless headphones',
  'gaming keyboard',
  'office chair',
  'monitor 27 inch',
  'USB-C hub',
];

const trendingSearches = [
  'iPhone 15 Pro',
  'PlayStation 5',
  'Air Fryer',
  'Electric Scooter',
  'Smart Watch',
];

// Basic SearchBar
export const Default: Story = {
  args: {
    placeholder: 'Search products...',
  },
};

// With categories
export const WithCategories: Story = {
  args: {
    categories,
    placeholder: 'Search in all categories...',
  },
};

// With suggestions
export const WithSuggestions: Story = {
  args: {
    suggestions,
    placeholder: 'Type to see suggestions...',
  },
};

// Complete example
export const CompleteExample: Story = {
  args: {
    categories,
    suggestions,
    recentSearches,
    trendingSearches,
    placeholder: 'Search for products, brands, and more...',
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const {
      query,
      category,
      recentSearches: recent,
      loading,
      setQuery,
      setCategory,
      search,
    } = useSearchBar();

    const [searchResults, setSearchResults] = useState<string[]>([]);

    const handleSearch = async (q: string, cat?: string) => {
      await search(q, cat);
      // Simulate search results
      setSearchResults([
        `Result 1 for "${q}"${cat ? ` in ${cat}` : ''}`,
        `Result 2 for "${q}"${cat ? ` in ${cat}` : ''}`,
        `Result 3 for "${q}"${cat ? ` in ${cat}` : ''}`,
      ]);
    };

    return (
      <div className="space-y-4">
        <SearchBar
          value={query}
          selectedCategory={category}
          onSearch={handleSearch}
          onChange={setQuery}
          onCategoryChange={setCategory}
          categories={categories}
          suggestions={suggestions}
          recentSearches={recent}
          trendingSearches={trendingSearches}
          loading={loading}
        />
        
        {searchResults.length > 0 && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-medium mb-2">Search Results:</h3>
            <ul className="space-y-1">
              {searchResults.map((result, index) => (
                <li key={index} className="text-sm text-neutral-600">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Small</p>
        <SearchBar size="sm" placeholder="Small search bar..." />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Medium (Default)</p>
        <SearchBar size="md" placeholder="Medium search bar..." />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Large</p>
        <SearchBar size="lg" placeholder="Large search bar..." />
      </div>
    </div>
  ),
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Default</p>
        <SearchBar variant="default" placeholder="Default variant..." />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Filled</p>
        <SearchBar variant="filled" placeholder="Filled variant..." />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Minimal</p>
        <SearchBar variant="minimal" placeholder="Minimal variant..." />
      </div>
    </div>
  ),
};

// Loading state
export const Loading: Story = {
  args: {
    loading: true,
    value: 'Searching for laptops...',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Search disabled...',
  },
};

// Without search button
export const WithoutSearchButton: Story = {
  args: {
    showSearchButton: false,
    placeholder: 'Press Enter to search...',
  },
};

// Without categories
export const WithoutCategories: Story = {
  args: {
    showCategoryDropdown: false,
    suggestions,
    placeholder: 'Search everything...',
  },
};

// Custom search button text
export const CustomSearchButton: Story = {
  args: {
    searchButtonText: 'Find',
    placeholder: 'What are you looking for?',
  },
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    categories,
    suggestions,
    variant: 'filled',
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 p-8 rounded-lg">
        <div className="[&_input]:text-white [&_select]:text-white [&_.bg-neutral-100]:bg-neutral-800 [&_.border-neutral-300]:border-neutral-700 [&_.text-neutral-400]:text-neutral-500">
          <Story />
        </div>
      </div>
    ),
  ],
};

// Header integration
export const HeaderIntegration: Story = {
  render: () => (
    <header className="bg-white border-b border-neutral-200 py-4">
      <div className="container mx-auto px-4 flex items-center gap-4">
        <div className="font-bold text-xl">Neo Mart</div>
        <div className="flex-1 max-w-xl">
          <SearchBar
            categories={categories}
            suggestions={suggestions}
            placeholder="Search for products..."
            size="md"
          />
        </div>
        <nav className="flex gap-4">
          <button className="flex items-center gap-1">
            <Icon icon="shoppingCart" size="sm" />
            <span>Cart</span>
          </button>
          <button className="flex items-center gap-1">
            <Icon icon="user" size="sm" />
            <span>Account</span>
          </button>
        </nav>
      </div>
    </header>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// Mobile responsive
export const Mobile: Story = {
  args: {
    size: 'sm',
    showSearchButton: false,
    placeholder: 'Search...',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// E-commerce specific
export const EcommerceSearch: Story = {
  render: () => {
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    const ecommerceSuggestions: SearchSuggestion[] = [
      { id: '1', text: 'iPhone 15 Pro Max 256GB', category: 'Electronics', icon: 'smartphone', trending: true },
      { id: '2', text: 'Samsung Galaxy S24 Ultra', category: 'Electronics', icon: 'smartphone' },
      { id: '3', text: 'Nike Air Max 90', category: 'Shoes', icon: 'shoppingBag', trending: true },
      { id: '4', text: 'Sony WH-1000XM5 Headphones', category: 'Audio', icon: 'headphones' },
    ];

    const handleSearch = async (query: string, category?: string) => {
      setSearching(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResults([
        {
          id: '1',
          name: 'Product matching your search',
          price: '$99.99',
          image: 'https://via.placeholder.com/100',
        },
      ]);
      setSearching(false);
    };

    return (
      <div className="space-y-4">
        <SearchBar
          categories={categories}
          suggestions={ecommerceSuggestions}
          recentSearches={['iPhone', 'Nike shoes', 'Laptop']}
          trendingSearches={['Black Friday deals', 'Christmas gifts', 'Winter clothing']}
          onSearch={handleSearch}
          loading={searching}
          placeholder="Search for products, brands, categories..."
        />
        
        {results.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Quick Results</h3>
            {results.map(product => (
              <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded">
                <img src={product.image} alt="" className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-primary-600">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};