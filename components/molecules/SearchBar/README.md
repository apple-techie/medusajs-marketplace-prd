# SearchBar Component

A comprehensive search bar component with category filtering, suggestions, recent searches, and trending searches. Perfect for e-commerce platforms, marketplaces, and content-heavy applications.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { SearchBar, useSearchBar } from '@/components/molecules/SearchBar';

// Basic usage
<SearchBar 
  onSearch={(query) => console.log('Searching for:', query)}
/>

// With categories and suggestions
<SearchBar 
  categories={[
    { id: '1', label: 'Electronics', value: 'electronics' },
    { id: '2', label: 'Clothing', value: 'clothing' },
  ]}
  suggestions={[
    { id: '1', text: 'laptop gaming' },
    { id: '2', text: 'laptop bag' },
  ]}
  onSearch={(query, category) => {
    console.log(`Searching for "${query}" in ${category || 'all categories'}`);
  }}
/>
```

## Component Props

### SearchBarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `'Search products...'` | Input placeholder text |
| `value` | `string` | - | Controlled input value |
| `onSearch` | `(query: string, category?: string) => void` | - | Called when search is submitted |
| `onChange` | `(value: string) => void` | - | Called when input value changes |
| `onClear` | `() => void` | - | Called when clear button is clicked |
| `categories` | `SearchCategory[]` | `[]` | Category options for filtering |
| `selectedCategory` | `string` | `''` | Selected category value |
| `onCategoryChange` | `(category: string) => void` | - | Called when category changes |
| `suggestions` | `SearchSuggestion[]` | `[]` | Search suggestions |
| `showSuggestions` | `boolean` | `true` | Show suggestions dropdown |
| `recentSearches` | `string[]` | `[]` | Recent search history |
| `trendingSearches` | `string[]` | `[]` | Trending search terms |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable input |
| `autoFocus` | `boolean` | `false` | Auto-focus input on mount |
| `showCategoryDropdown` | `boolean` | `true` | Show category filter |
| `showSearchButton` | `boolean` | `true` | Show search button |
| `searchButtonText` | `string` | `'Search'` | Search button text |
| `maxSuggestions` | `number` | `8` | Maximum suggestions to show |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `variant` | `'default' \| 'filled' \| 'minimal'` | `'default'` | Visual variant |
| `className` | `string` | - | Additional CSS classes |
| `inputClassName` | `string` | - | CSS classes for input |
| `dropdownClassName` | `string` | - | CSS classes for dropdown |

### SearchCategory Interface

```tsx
interface SearchCategory {
  id: string;
  label: string;
  value: string;
  icon?: string;
}
```

### SearchSuggestion Interface

```tsx
interface SearchSuggestion {
  id: string;
  text: string;
  category?: string;
  icon?: string;
  trending?: boolean;
}
```

### useSearchBar Hook

```tsx
const {
  query,              // Current search query
  category,           // Selected category
  recentSearches,     // Recent search history
  suggestions,        // Current suggestions
  loading,           // Loading state
  setQuery,          // Update query
  setCategory,       // Update category
  setSuggestions,    // Update suggestions
  search,            // Perform search
  clearRecentSearches, // Clear history
} = useSearchBar();
```

## Examples

### Basic Search

```tsx
function BasicSearch() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Perform search API call
  };

  return (
    <SearchBar 
      onSearch={handleSearch}
      placeholder="What are you looking for?"
    />
  );
}
```

### With Categories

```tsx
function CategorySearch() {
  const categories = [
    { id: '1', label: 'Electronics', value: 'electronics', icon: 'monitor' },
    { id: '2', label: 'Fashion', value: 'fashion', icon: 'shirt' },
    { id: '3', label: 'Home', value: 'home', icon: 'home' },
  ];

  const handleSearch = (query: string, category?: string) => {
    if (category) {
      console.log(`Searching for "${query}" in ${category}`);
    } else {
      console.log(`Searching for "${query}" in all categories`);
    }
  };

  return (
    <SearchBar 
      categories={categories}
      onSearch={handleSearch}
    />
  );
}
```

### With Suggestions

```tsx
function SearchWithSuggestions() {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  
  const handleChange = async (value: string) => {
    if (value.length > 2) {
      // Fetch suggestions from API
      const response = await fetch(`/api/suggestions?q=${value}`);
      const data = await response.json();
      setSuggestions(data);
    }
  };

  return (
    <SearchBar 
      onChange={handleChange}
      suggestions={suggestions}
      onSearch={(query) => {
        // Navigate to search results
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
      }}
    />
  );
}
```

### Complete Example with Hook

```tsx
function AdvancedSearch() {
  const {
    query,
    category,
    recentSearches,
    loading,
    setQuery,
    setCategory,
    search,
  } = useSearchBar();

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (searchQuery: string, searchCategory?: string) => {
    await search(searchQuery, searchCategory);
    
    // Fetch results
    const params = new URLSearchParams({
      q: searchQuery,
      ...(searchCategory && { category: searchCategory }),
    });
    
    const response = await fetch(`/api/products?${params}`);
    const data = await response.json();
    setSearchResults(data);
  };

  return (
    <>
      <SearchBar
        value={query}
        selectedCategory={category}
        onSearch={handleSearch}
        onChange={setQuery}
        onCategoryChange={setCategory}
        categories={productCategories}
        recentSearches={recentSearches}
        trendingSearches={['iPhone 15', 'PlayStation 5', 'Air Fryer']}
        loading={loading}
      />
      
      {/* Display search results */}
      <div className="mt-8">
        {searchResults.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </>
  );
}
```

### Header Integration

```tsx
function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <Logo />
        
        <div className="flex-1 max-w-2xl">
          <SearchBar
            size="md"
            variant="filled"
            placeholder="Search products, brands, and categories..."
            categories={mainCategories}
            showSearchButton={false} // Use Enter key
          />
        </div>
        
        <NavigationMenu />
      </div>
    </header>
  );
}
```

### Mobile Responsive

```tsx
function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile search trigger */}
      <button 
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon="search" />
      </button>

      {/* Mobile search overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="p-4">
            <SearchBar
              size="sm"
              autoFocus
              showSearchButton={false}
              onSearch={(query) => {
                handleSearch(query);
                setIsOpen(false);
              }}
            />
            <button onClick={() => setIsOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Desktop search */}
      <div className="hidden md:block">
        <SearchBar />
      </div>
    </>
  );
}
```

## Features

### Category Filtering
- Dropdown with category options
- Optional category icons
- "All Categories" default option

### Suggestions Dropdown
- Real-time search suggestions
- Highlighted matching text
- Category indicators
- Trending badges
- Recent searches section
- Trending searches section

### Interactive Features
- Clear button for quick reset
- Loading spinner during search
- Keyboard navigation support
- Click outside to close dropdown
- Enter key to submit

### Styling Options
- **Sizes**: Small, medium, large
- **Variants**: Default, filled, minimal
- **Customizable**: All parts can be styled

## Styling

### Size Variants
- `sm`: Compact 40px height
- `md`: Default 48px height
- `lg`: Large 56px height

### Visual Variants
- `default`: Standard bordered input
- `filled`: Gray background, no border
- `minimal`: Subtle shadow, no border

### Custom Styling

```tsx
<SearchBar
  className="shadow-lg"
  inputClassName="font-medium"
  dropdownClassName="max-h-[400px]"
/>
```

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Clear button labeled
- Form submission support

## Best Practices

1. **Debounce onChange**: Debounce API calls when fetching suggestions
2. **Limit suggestions**: Keep suggestions under 10 for better UX
3. **Highlight matches**: Show which part of suggestion matches query
4. **Recent searches**: Store in localStorage for persistence
5. **Loading states**: Show spinner during API calls
6. **Error handling**: Handle failed searches gracefully
7. **Mobile optimization**: Consider full-screen search on mobile
8. **Keyboard shortcuts**: Support Cmd/Ctrl+K for focus
9. **Analytics**: Track search queries for insights
10. **Performance**: Use virtualization for long suggestion lists