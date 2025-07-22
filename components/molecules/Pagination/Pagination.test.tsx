import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination, SimplePagination, usePagination } from './Pagination';
import { renderHook, act } from '@testing-library/react';

describe('Pagination Component', () => {
  it('renders page numbers correctly', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={jest.fn()} 
      />
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows ellipsis for many pages', () => {
    render(
      <Pagination 
        currentPage={5} 
        totalPages={20} 
        onPageChange={jest.fn()} 
      />
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('...')).toHaveLength(2);
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('handles page click', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={handlePageChange} 
      />
    );
    
    fireEvent.click(screen.getByText('5'));
    expect(handlePageChange).toHaveBeenCalledWith(5);
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={jest.fn()} 
      />
    );
    
    const previousButton = screen.getByLabelText('Go to previous page');
    expect(previousButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination 
        currentPage={5} 
        totalPages={5} 
        onPageChange={jest.fn()} 
      />
    );
    
    const nextButton = screen.getByLabelText('Go to next page');
    expect(nextButton).toBeDisabled();
  });

  it('shows first and last buttons when enabled', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={jest.fn()} 
        showFirstLast={true}
      />
    );
    
    expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
  });

  it('hides prev/next buttons when disabled', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={5} 
        onPageChange={jest.fn()} 
        showPrevNext={false}
      />
    );
    
    expect(screen.queryByLabelText('Go to previous page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Go to next page')).not.toBeInTheDocument();
  });

  it('uses custom labels', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={5} 
        onPageChange={jest.fn()} 
        previousLabel="Back"
        nextLabel="Forward"
      />
    );
    
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Forward')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(
      <Pagination 
        currentPage={3} 
        totalPages={5} 
        onPageChange={jest.fn()} 
      />
    );
    
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton.parentElement).toHaveAttribute('aria-current', 'page');
    expect(currentPageButton.parentElement).toHaveClass('bg-primary-600', 'text-white');
  });

  it('handles navigation to first page', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination 
        currentPage={5} 
        totalPages={10} 
        onPageChange={handlePageChange} 
        showFirstLast={true}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Go to first page'));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('handles navigation to last page', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination 
        currentPage={1} 
        totalPages={10} 
        onPageChange={handlePageChange} 
        showFirstLast={true}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Go to last page'));
    expect(handlePageChange).toHaveBeenCalledWith(10);
  });

  it('applies size variants', () => {
    const { container: smContainer } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} size="sm" />
    );
    const smButton = smContainer.querySelector('button[aria-label="Go to page 1"]');
    expect(smButton).toHaveClass('h-8', 'w-8', 'text-xs');

    const { container: lgContainer } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} size="lg" />
    );
    const lgButton = lgContainer.querySelector('button[aria-label="Go to page 1"]');
    expect(lgButton).toHaveClass('h-12', 'w-12', 'text-base');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={jest.fn()} 
        className="custom-pagination"
      />
    );
    expect(container.firstChild).toHaveClass('custom-pagination');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <Pagination 
        ref={ref} 
        currentPage={1} 
        totalPages={5} 
        onPageChange={jest.fn()} 
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('respects custom sibling and boundary counts', () => {
    render(
      <Pagination 
        currentPage={10} 
        totalPages={20} 
        onPageChange={jest.fn()} 
        siblingCount={2}
        boundaryCount={2}
      />
    );
    
    // Should show: 1 2 ... 8 9 10 11 12 ... 19 20
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });
});

describe('SimplePagination Component', () => {
  it('renders page info correctly', () => {
    render(
      <SimplePagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Page 3 of 10')).toBeInTheDocument();
  });

  it('handles previous button click', () => {
    const handlePageChange = jest.fn();
    render(
      <SimplePagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={handlePageChange} 
      />
    );
    
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('handles next button click', () => {
    const handlePageChange = jest.fn();
    render(
      <SimplePagination 
        currentPage={3} 
        totalPages={10} 
        onPageChange={handlePageChange} 
      />
    );
    
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('disables previous button on first page', () => {
    render(
      <SimplePagination 
        currentPage={1} 
        totalPages={10} 
        onPageChange={jest.fn()} 
      />
    );
    
    const previousButton = screen.getByLabelText('Previous page');
    expect(previousButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <SimplePagination 
        currentPage={10} 
        totalPages={10} 
        onPageChange={jest.fn()} 
      />
    );
    
    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('applies size variants', () => {
    const { container } = render(
      <SimplePagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={jest.fn()} 
        size="sm"
      />
    );
    
    const text = screen.getByText('Page 1 of 5');
    expect(text).toHaveClass('text-xs');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SimplePagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={jest.fn()} 
        className="custom-simple"
      />
    );
    expect(container.firstChild).toHaveClass('custom-simple');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <SimplePagination 
        ref={ref} 
        currentPage={1} 
        totalPages={5} 
        onPageChange={jest.fn()} 
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('usePagination Hook', () => {
  it('initializes with correct values', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(10);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(10);
  });

  it('initializes with custom initial page', () => {
    const { result } = renderHook(() => usePagination(100, 10, 3));
    
    expect(result.current.currentPage).toBe(3);
    expect(result.current.startIndex).toBe(20);
    expect(result.current.endIndex).toBe(30);
  });

  it('navigates to next page', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    act(() => {
      result.current.nextPage();
    });
    
    expect(result.current.currentPage).toBe(2);
    expect(result.current.startIndex).toBe(10);
    expect(result.current.endIndex).toBe(20);
  });

  it('navigates to previous page', () => {
    const { result } = renderHook(() => usePagination(100, 10, 3));
    
    act(() => {
      result.current.previousPage();
    });
    
    expect(result.current.currentPage).toBe(2);
  });

  it('goes to specific page', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    act(() => {
      result.current.goToPage(5);
    });
    
    expect(result.current.currentPage).toBe(5);
    expect(result.current.startIndex).toBe(40);
    expect(result.current.endIndex).toBe(50);
  });

  it('goes to first page', () => {
    const { result } = renderHook(() => usePagination(100, 10, 5));
    
    act(() => {
      result.current.firstPage();
    });
    
    expect(result.current.currentPage).toBe(1);
  });

  it('goes to last page', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    act(() => {
      result.current.lastPage();
    });
    
    expect(result.current.currentPage).toBe(10);
    expect(result.current.startIndex).toBe(90);
    expect(result.current.endIndex).toBe(100);
  });

  it('prevents navigation beyond bounds', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    // Try to go before first page
    act(() => {
      result.current.previousPage();
    });
    expect(result.current.currentPage).toBe(1);
    
    // Try to go beyond last page
    act(() => {
      result.current.goToPage(20);
    });
    expect(result.current.currentPage).toBe(10);
  });

  it('correctly identifies hasNextPage and hasPreviousPage', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.hasNextPage).toBe(true);
    
    act(() => {
      result.current.goToPage(5);
    });
    
    expect(result.current.hasPreviousPage).toBe(true);
    expect(result.current.hasNextPage).toBe(true);
    
    act(() => {
      result.current.lastPage();
    });
    
    expect(result.current.hasPreviousPage).toBe(true);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('handles partial last page correctly', () => {
    const { result } = renderHook(() => usePagination(95, 10));
    
    expect(result.current.totalPages).toBe(10);
    
    act(() => {
      result.current.lastPage();
    });
    
    expect(result.current.currentPage).toBe(10);
    expect(result.current.startIndex).toBe(90);
    expect(result.current.endIndex).toBe(95);
  });
});