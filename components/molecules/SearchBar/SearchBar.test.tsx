import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar, useSearchBar } from './SearchBar';
import { renderHook, act } from '@testing-library/react';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnChange = jest.fn();
  const mockOnClear = jest.fn();
  const mockOnCategoryChange = jest.fn();

  const defaultProps = {
    onSearch: mockOnSearch,
    onChange: mockOnChange,
    onClear: mockOnClear,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder', () => {
    render(<SearchBar {...defaultProps} placeholder="Search for items..." />);
    
    expect(screen.getByPlaceholderText('Search for items...')).toBeInTheDocument();
  });

  it('handles text input', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    await user.type(input, 'laptop');
    
    expect(input).toHaveValue('laptop');
    expect(mockOnChange).toHaveBeenCalledWith('laptop');
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    await user.type(input, 'laptop');
    await user.keyboard('{Enter}');
    
    expect(mockOnSearch).toHaveBeenCalledWith('laptop', '');
  });

  it('handles search button click', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    await user.type(input, 'phone');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('phone', '');
  });

  it('shows and handles clear button', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    await user.type(input, 'test');
    
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
    
    await user.click(clearButton);
    
    expect(input).toHaveValue('');
    expect(mockOnChange).toHaveBeenCalledWith('');
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('renders with categories dropdown', () => {
    const categories = [
      { id: '1', label: 'Electronics', value: 'electronics' },
      { id: '2', label: 'Clothing', value: 'clothing' },
    ];
    
    render(
      <SearchBar 
        {...defaultProps} 
        categories={categories}
        onCategoryChange={mockOnCategoryChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
  });

  it('handles category selection', async () => {
    const user = userEvent.setup();
    const categories = [
      { id: '1', label: 'Electronics', value: 'electronics' },
    ];
    
    render(
      <SearchBar 
        {...defaultProps} 
        categories={categories}
        onCategoryChange={mockOnCategoryChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'electronics');
    
    expect(mockOnCategoryChange).toHaveBeenCalledWith('electronics');
  });

  it('shows suggestions dropdown when focused', async () => {
    const user = userEvent.setup();
    const suggestions = [
      { id: '1', text: 'laptop gaming' },
      { id: '2', text: 'laptop bag' },
    ];
    
    render(
      <SearchBar 
        {...defaultProps} 
        suggestions={suggestions}
      />
    );
    
    const input = screen.getByPlaceholderText('Search products...');
    await user.click(input);
    
    expect(screen.getByText('laptop gaming')).toBeInTheDocument();
    expect(screen.getByText('laptop bag')).toBeInTheDocument();
  });

  it('handles suggestion selection', async () => {
    const user = userEvent.setup();
    const suggestions = [
      { id: '1', text: 'laptop gaming' },
    ];
    
    render(
      <SearchBar 
        {...defaultProps} 
        suggestions={suggestions}
      />
    );
    
    const input = screen.getByPlaceholderText('Search products...');
    await user.click(input);
    
    const suggestion = screen.getByText('laptop gaming');
    await user.click(suggestion);
    
    expect(input).toHaveValue('laptop gaming');
    expect(mockOnSearch).toHaveBeenCalledWith('laptop gaming', '');
  });

  it('shows recent searches when no query', async () => {
    const user = userEvent.setup();
    const recentSearches = ['phone', 'laptop', 'headphones'];
    
    render(
      <SearchBar 
        {...defaultProps} 
        recentSearches={recentSearches}
      />
    );
    
    const input = screen.getByPlaceholderText('Search products...');
    await user.click(input);
    
    expect(screen.getByText('Recent Searches')).toBeInTheDocument();
    expect(screen.getByText('phone')).toBeInTheDocument();
    expect(screen.getByText('laptop')).toBeInTheDocument();
  });

  it('shows trending searches when no query', async () => {
    const user = userEvent.setup();
    const trendingSearches = ['iPhone 15', 'PlayStation 5'];
    
    render(
      <SearchBar 
        {...defaultProps} 
        trendingSearches={trendingSearches}
      />
    );
    
    const input = screen.getByPlaceholderText('Search products...');
    await user.click(input);
    
    expect(screen.getByText('Trending')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
  });

  it('highlights matching text in suggestions', async () => {
    const user = userEvent.setup();
    const suggestions = [
      { id: '1', text: 'laptop gaming' },
    ];
    
    render(
      <SearchBar 
        {...defaultProps} 
        suggestions={suggestions}
      />
    );
    
    const input = screen.getByPlaceholderText('Search products...');
    await user.type(input, 'lap');
    
    const highlighted = screen.getByText('lap');
    expect(highlighted.tagName).toBe('MARK');
  });

  it('shows loading state', () => {
    render(<SearchBar {...defaultProps} loading={true} />);
    
    expect(screen.getByTestId(/loader/i)).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<SearchBar {...defaultProps} disabled={true} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    expect(input).toBeDisabled();
  });

  it('applies size variants', () => {
    const { rerender } = render(<SearchBar {...defaultProps} size="sm" />);
    expect(screen.getByRole('form').firstChild).toHaveClass('h-10');
    
    rerender(<SearchBar {...defaultProps} size="md" />);
    expect(screen.getByRole('form').firstChild).toHaveClass('h-12');
    
    rerender(<SearchBar {...defaultProps} size="lg" />);
    expect(screen.getByRole('form').firstChild).toHaveClass('h-14');
  });

  it('applies variant styles', () => {
    const { rerender } = render(<SearchBar {...defaultProps} variant="default" />);
    expect(screen.getByRole('form').firstChild).toHaveClass('border-neutral-300');
    
    rerender(<SearchBar {...defaultProps} variant="filled" />);
    expect(screen.getByRole('form').firstChild).toHaveClass('bg-neutral-100');
  });

  it('hides category dropdown when showCategoryDropdown is false', () => {
    const categories = [
      { id: '1', label: 'Electronics', value: 'electronics' },
    ];
    
    render(
      <SearchBar 
        {...defaultProps} 
        categories={categories}
        showCategoryDropdown={false}
      />
    );
    
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('hides search button when showSearchButton is false', () => {
    render(<SearchBar {...defaultProps} showSearchButton={false} />);
    
    expect(screen.queryByRole('button', { name: /search/i })).not.toBeInTheDocument();
  });

  it('uses custom search button text', () => {
    render(<SearchBar {...defaultProps} searchButtonText="Find" />);
    
    expect(screen.getByRole('button', { name: 'Find' })).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    const suggestions = [
      { id: '1', text: 'laptop' },
    ];
    
    render(
      <div>
        <SearchBar {...defaultProps} suggestions={suggestions} />
        <button>Outside</button>
      </div>
    );
    
    const input = screen.getByPlaceholderText('Search products...');
    await user.click(input);
    
    expect(screen.getByText('laptop')).toBeInTheDocument();
    
    await user.click(screen.getByText('Outside'));
    
    await waitFor(() => {
      expect(screen.queryByText('laptop')).not.toBeInTheDocument();
    });
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<SearchBar {...defaultProps} ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

describe('useSearchBar Hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useSearchBar());
    
    expect(result.current.query).toBe('');
    expect(result.current.category).toBe('');
    expect(result.current.recentSearches).toEqual([]);
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('updates query and category', () => {
    const { result } = renderHook(() => useSearchBar());
    
    act(() => {
      result.current.setQuery('laptop');
      result.current.setCategory('electronics');
    });
    
    expect(result.current.query).toBe('laptop');
    expect(result.current.category).toBe('electronics');
  });

  it('adds recent searches', async () => {
    const { result } = renderHook(() => useSearchBar());
    
    await act(async () => {
      await result.current.search('laptop');
    });
    
    expect(result.current.recentSearches).toContain('laptop');
  });

  it('prevents duplicate recent searches', async () => {
    const { result } = renderHook(() => useSearchBar());
    
    await act(async () => {
      await result.current.search('laptop');
      await result.current.search('phone');
      await result.current.search('laptop');
    });
    
    expect(result.current.recentSearches).toEqual(['laptop', 'phone']);
  });

  it('limits recent searches to 10', async () => {
    const { result } = renderHook(() => useSearchBar());
    
    for (let i = 0; i < 15; i++) {
      await act(async () => {
        await result.current.search(`search${i}`);
      });
    }
    
    expect(result.current.recentSearches).toHaveLength(10);
  });

  it('clears recent searches', async () => {
    const { result } = renderHook(() => useSearchBar());
    
    await act(async () => {
      await result.current.search('laptop');
    });
    
    act(() => {
      result.current.clearRecentSearches();
    });
    
    expect(result.current.recentSearches).toEqual([]);
  });
});