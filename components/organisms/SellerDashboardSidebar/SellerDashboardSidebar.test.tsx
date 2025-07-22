import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SellerDashboardSidebar, useSellerSidebar } from './SellerDashboardSidebar';
import { renderHook, act } from '@testing-library/react';

describe('SellerDashboardSidebar Component', () => {
  const mockStoreInfo = {
    logo: 'https://example.com/logo.png',
    name: 'Tech Store Pro',
    openTime: '24 hours',
    totalTransactions: '192.4k',
    followers: '82k',
  };

  const mockMenuItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'inbox', label: 'Inbox', icon: 'mail', badge: '5' },
    {
      id: 'products',
      label: 'Products',
      icon: 'package',
      items: [
        { id: 'add-product', label: 'Add Product', icon: 'plus' },
        { id: 'product-list', label: 'Product Lists', icon: 'list' },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: 'chart',
      items: [
        { id: 'store-performance', label: 'Store Performance', icon: 'trending' },
        { id: 'product-performance', label: 'Product Performance', icon: 'activity' },
        { id: 'customer-insights', label: 'Customer Insights', icon: 'users' },
      ],
    },
  ];

  it('renders store header with info', () => {
    render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
      />
    );

    expect(screen.getByText('Tech Store Pro')).toBeInTheDocument();
    expect(screen.getByText('Open Time: 24 hours')).toBeInTheDocument();
    expect(screen.getByText('Total Transaction: 192.4k')).toBeInTheDocument();
    expect(screen.getByText('Followers: 82k')).toBeInTheDocument();
  });

  it('renders menu items', () => {
    render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
      />
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Reports')).toBeInTheDocument();
  });

  it('shows badges on menu items', () => {
    render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('expands and collapses menu items with children', async () => {
    render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
      />
    );

    // Initially sub-items should not be visible
    expect(screen.queryByText('Add Product')).not.toBeInTheDocument();
    expect(screen.queryByText('Product Lists')).not.toBeInTheDocument();

    // Click on Products to expand
    fireEvent.click(screen.getByText('Products'));

    // Sub-items should now be visible
    await waitFor(() => {
      expect(screen.getByText('Add Product')).toBeInTheDocument();
      expect(screen.getByText('Product Lists')).toBeInTheDocument();
    });

    // Click again to collapse
    fireEvent.click(screen.getByText('Products'));

    // Sub-items should be hidden again
    await waitFor(() => {
      expect(screen.queryByText('Add Product')).not.toBeInTheDocument();
      expect(screen.queryByText('Product Lists')).not.toBeInTheDocument();
    });
  });

  it('highlights active menu item', () => {
    render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
        activeItemId="home"
      />
    );

    const homeItem = screen.getByText('Home').closest('div');
    expect(homeItem).toHaveClass('bg-primary-50', 'text-primary-700');
  });

  it('auto-expands parent when child is active', () => {
    render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
        activeItemId="add-product"
      />
    );

    // Parent should be expanded and child should be visible
    expect(screen.getByText('Add Product')).toBeInTheDocument();
    expect(screen.getByText('Product Lists')).toBeInTheDocument();
  });

  it('handles item click', () => {
    const handleItemClick = jest.fn();
    render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
        onItemClick={handleItemClick}
      />
    );

    fireEvent.click(screen.getByText('Home'));
    expect(handleItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'home', label: 'Home' })
    );
  });

  it('collapses and expands sidebar', async () => {
    render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
        collapsible={true}
      />
    );

    const collapseButton = screen.getByLabelText('Collapse sidebar');
    expect(collapseButton).toBeInTheDocument();

    // Initially expanded
    expect(screen.getByText('Tech Store Pro')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(collapseButton);

    // Store name should be hidden when collapsed
    await waitFor(() => {
      expect(screen.queryByText('Tech Store Pro')).not.toBeInTheDocument();
    });

    // Button should now say expand
    const expandButton = screen.getByLabelText('Expand sidebar');
    expect(expandButton).toBeInTheDocument();

    // Click to expand
    fireEvent.click(expandButton);

    // Store name should be visible again
    await waitFor(() => {
      expect(screen.getByText('Tech Store Pro')).toBeInTheDocument();
    });
  });

  it('shows tooltip on hover when collapsed', async () => {
    const { container } = render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
        collapsed={true}
      />
    );

    const homeItem = screen.getByText('Home', { selector: '.absolute' });
    const menuItemDiv = homeItem.closest('.group');
    
    // Simulate hover
    fireEvent.mouseEnter(menuItemDiv!);

    await waitFor(() => {
      expect(homeItem).toHaveClass('group-hover:opacity-100', 'group-hover:visible');
    });
  });

  it('respects controlled collapsed state', () => {
    const { rerender } = render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
        collapsed={true}
      />
    );

    // Should be collapsed
    expect(screen.queryByText('Tech Store Pro')).not.toBeInTheDocument();

    // Change to expanded
    rerender(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
        collapsed={false}
      />
    );

    // Should be expanded
    expect(screen.getByText('Tech Store Pro')).toBeInTheDocument();
  });

  it('calls onCollapsedChange when toggled', () => {
    const handleCollapsedChange = jest.fn();
    render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
        onCollapsedChange={handleCollapsedChange}
      />
    );

    fireEvent.click(screen.getByLabelText('Collapse sidebar'));
    expect(handleCollapsedChange).toHaveBeenCalledWith(true);
  });

  it('hides stats when showStoreStats is false', () => {
    render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
        showStoreStats={false}
      />
    );

    expect(screen.queryByText('Open Time: 24 hours')).not.toBeInTheDocument();
    expect(screen.queryByText('Total Transaction: 192.4k')).not.toBeInTheDocument();
    expect(screen.queryByText('Followers: 82k')).not.toBeInTheDocument();
  });

  it('disables collapsible when set to false', () => {
    render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
        collapsible={false}
      />
    );

    expect(screen.queryByLabelText('Collapse sidebar')).not.toBeInTheDocument();
  });

  it('handles disabled menu items', () => {
    const itemsWithDisabled = [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'disabled', label: 'Disabled', icon: 'lock', disabled: true },
    ];

    render(
      <SellerDashboardSidebar 
        menuItems={itemsWithDisabled}
      />
    );

    const disabledItem = screen.getByText('Disabled').closest('div');
    expect(disabledItem).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SellerDashboardSidebar 
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
        className="custom-sidebar"
      />
    );

    expect(container.firstChild).toHaveClass('custom-sidebar');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <SellerDashboardSidebar 
        ref={ref}
        storeInfo={mockStoreInfo}
        menuItems={mockMenuItems}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('useSellerSidebar Hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useSellerSidebar());
    
    expect(result.current.collapsed).toBe(false);
    expect(result.current.activeItemId).toBe('');
  });

  it('toggles collapsed state', () => {
    const { result } = renderHook(() => useSellerSidebar());
    
    act(() => {
      result.current.toggleCollapsed();
    });
    
    expect(result.current.collapsed).toBe(true);

    act(() => {
      result.current.toggleCollapsed();
    });
    
    expect(result.current.collapsed).toBe(false);
  });

  it('sets collapsed state directly', () => {
    const { result } = renderHook(() => useSellerSidebar());
    
    act(() => {
      result.current.setCollapsed(true);
    });
    
    expect(result.current.collapsed).toBe(true);
  });

  it('sets active item', () => {
    const { result } = renderHook(() => useSellerSidebar());
    
    act(() => {
      result.current.setActiveItem('products');
    });
    
    expect(result.current.activeItemId).toBe('products');
  });
});