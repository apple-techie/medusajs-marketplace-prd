import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubMenuTreeItem, SubMenuTree, useSubMenuTree } from './SubMenuTreeItem';
import { renderHook, act } from '@testing-library/react';

describe('SubMenuTreeItem Component', () => {
  const mockItem = {
    id: 'item1',
    label: 'Item 1',
    icon: 'folder',
  };

  const mockItemWithChildren = {
    id: 'parent',
    label: 'Parent Item',
    icon: 'folder',
    children: [
      { id: 'child1', label: 'Child 1', icon: 'file' },
      { id: 'child2', label: 'Child 2', icon: 'file' },
    ],
  };

  it('renders basic item', () => {
    render(<SubMenuTreeItem item={mockItem} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByRole('treeitem')).toBeInTheDocument();
  });

  it('renders item with icon', () => {
    render(<SubMenuTreeItem item={mockItem} />);
    
    // Icon should be rendered (checking by class since icon is mocked)
    const icons = screen.getAllByText('folder');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('renders item with badge', () => {
    const itemWithBadge = {
      ...mockItem,
      badge: '5',
      badgeVariant: 'primary' as const,
    };
    
    render(<SubMenuTreeItem item={itemWithBadge} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders expandable item with children', () => {
    render(<SubMenuTreeItem item={mockItemWithChildren} />);
    
    expect(screen.getByText('Parent Item')).toBeInTheDocument();
    expect(screen.getByLabelText('Expand')).toBeInTheDocument();
    
    // Children should not be visible initially
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Child 2')).not.toBeInTheDocument();
  });

  it('expands and collapses on click', async () => {
    render(<SubMenuTreeItem item={mockItemWithChildren} />);
    
    const expandButton = screen.getByLabelText('Expand');
    fireEvent.click(expandButton);
    
    // Children should now be visible
    await waitFor(() => {
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
    
    // Click again to collapse
    const collapseButton = screen.getByLabelText('Collapse');
    fireEvent.click(collapseButton);
    
    // Children should be hidden again
    await waitFor(() => {
      expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Child 2')).not.toBeInTheDocument();
    });
  });

  it('handles controlled expanded state', () => {
    const { rerender } = render(
      <SubMenuTreeItem item={mockItemWithChildren} isExpanded={false} />
    );
    
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
    
    rerender(
      <SubMenuTreeItem item={mockItemWithChildren} isExpanded={true} />
    );
    
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });

  it('calls onToggle when expand button is clicked', () => {
    const handleToggle = jest.fn();
    render(
      <SubMenuTreeItem 
        item={mockItemWithChildren} 
        onToggle={handleToggle}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Expand'));
    expect(handleToggle).toHaveBeenCalledWith(mockItemWithChildren);
  });

  it('calls onClick when item is clicked', () => {
    const handleClick = jest.fn();
    render(
      <SubMenuTreeItem 
        item={mockItem} 
        onClick={handleClick}
      />
    );
    
    fireEvent.click(screen.getByText('Item 1'));
    expect(handleClick).toHaveBeenCalledWith(mockItem);
  });

  it('calls onActiveChange when item is clicked', () => {
    const handleActiveChange = jest.fn();
    render(
      <SubMenuTreeItem 
        item={mockItem} 
        onActiveChange={handleActiveChange}
      />
    );
    
    fireEvent.click(screen.getByText('Item 1'));
    expect(handleActiveChange).toHaveBeenCalledWith('item1');
  });

  it('renders as link when href is provided', () => {
    const itemWithHref = {
      ...mockItem,
      href: '/page/item1',
    };
    
    render(<SubMenuTreeItem item={itemWithHref} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/page/item1');
  });

  it('applies active state', () => {
    render(<SubMenuTreeItem item={mockItem} isActive={true} />);
    
    const treeItem = screen.getByRole('treeitem');
    expect(treeItem).toHaveClass('bg-primary-50', 'text-primary-700');
    expect(treeItem).toHaveAttribute('aria-selected', 'true');
  });

  it('applies disabled state', () => {
    const disabledItem = {
      ...mockItem,
      disabled: true,
    };
    
    render(<SubMenuTreeItem item={disabledItem} />);
    
    const treeItem = screen.getByRole('treeitem');
    expect(treeItem).toHaveClass('opacity-50', 'cursor-not-allowed');
    expect(treeItem).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not trigger click handlers when disabled', () => {
    const handleClick = jest.fn();
    const disabledItem = {
      ...mockItem,
      disabled: true,
    };
    
    render(
      <SubMenuTreeItem 
        item={disabledItem} 
        onClick={handleClick}
      />
    );
    
    fireEvent.click(screen.getByText('Item 1'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies size variants', () => {
    const { rerender } = render(<SubMenuTreeItem item={mockItem} size="sm" />);
    expect(screen.getByRole('treeitem')).toHaveClass('text-xs', 'py-1.5');
    
    rerender(<SubMenuTreeItem item={mockItem} size="lg" />);
    expect(screen.getByRole('treeitem')).toHaveClass('text-base', 'py-2.5');
  });

  it('applies style variants', () => {
    const { rerender } = render(<SubMenuTreeItem item={mockItem} variant="rounded" />);
    expect(screen.getByRole('treeitem')).toHaveClass('rounded-lg');
    
    rerender(<SubMenuTreeItem item={mockItem} variant="minimal" />);
    expect(screen.getByRole('treeitem')).toHaveClass('hover:bg-transparent');
  });

  it('applies proper indentation based on level', () => {
    render(<SubMenuTreeItem item={mockItem} level={2} indentSize={20} />);
    
    const treeItem = screen.getByRole('treeitem');
    expect(treeItem).toHaveStyle({ paddingLeft: '52px' }); // (2 * 20) + 12
  });

  it('shows/hides expand icon based on prop', () => {
    const { rerender } = render(
      <SubMenuTreeItem item={mockItemWithChildren} showExpandIcon={true} />
    );
    
    expect(screen.getByLabelText('Expand')).toBeInTheDocument();
    
    rerender(
      <SubMenuTreeItem item={mockItemWithChildren} showExpandIcon={false} />
    );
    
    expect(screen.queryByLabelText('Expand')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<SubMenuTreeItem item={mockItem} className="custom-class" />);
    
    expect(screen.getByRole('treeitem')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<SubMenuTreeItem item={mockItem} ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('SubMenuTree Component', () => {
  const mockItems = [
    {
      id: '1',
      label: 'Item 1',
      icon: 'folder',
      children: [
        { id: '1.1', label: 'Item 1.1', icon: 'file' },
        { id: '1.2', label: 'Item 1.2', icon: 'file' },
      ],
    },
    {
      id: '2',
      label: 'Item 2',
      icon: 'folder',
      badge: '3',
    },
    {
      id: '3',
      label: 'Item 3',
      icon: 'file',
      disabled: true,
    },
  ];

  it('renders all items', () => {
    render(<SubMenuTree items={mockItems} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('handles item click', () => {
    const handleItemClick = jest.fn();
    render(<SubMenuTree items={mockItems} onItemClick={handleItemClick} />);
    
    fireEvent.click(screen.getByText('Item 2'));
    expect(handleItemClick).toHaveBeenCalledWith(mockItems[1]);
  });

  it('handles item toggle', () => {
    const handleItemToggle = jest.fn();
    render(<SubMenuTree items={mockItems} onItemToggle={handleItemToggle} />);
    
    fireEvent.click(screen.getByLabelText('Expand'));
    expect(handleItemToggle).toHaveBeenCalledWith(mockItems[0]);
  });

  it('respects expanded item ids', () => {
    const expandedIds = new Set(['1']);
    render(<SubMenuTree items={mockItems} expandedItemIds={expandedIds} />);
    
    expect(screen.getByText('Item 1.1')).toBeInTheDocument();
    expect(screen.getByText('Item 1.2')).toBeInTheDocument();
  });

  it('highlights active item and parents', () => {
    render(<SubMenuTree items={mockItems} activeItemId="1.1" />);
    
    // Both parent and child should have active styling
    const treeItems = screen.getAllByRole('treeitem');
    const activeItems = treeItems.filter(item => 
      item.getAttribute('aria-selected') === 'true'
    );
    
    expect(activeItems.length).toBeGreaterThan(0);
  });

  it('applies tree role', () => {
    const { container } = render(<SubMenuTree items={mockItems} />);
    
    expect(container.querySelector('[role="tree"]')).toBeInTheDocument();
  });
});

describe('useSubMenuTree Hook', () => {
  const mockItems = [
    {
      id: '1',
      label: 'Item 1',
      children: [
        { 
          id: '1.1', 
          label: 'Item 1.1',
          children: [
            { id: '1.1.1', label: 'Item 1.1.1' },
          ],
        },
        { id: '1.2', label: 'Item 1.2' },
      ],
    },
    {
      id: '2',
      label: 'Item 2',
    },
  ];

  it('initializes with default values', () => {
    const { result } = renderHook(() => useSubMenuTree(mockItems));
    
    expect(result.current.expandedItemIds.size).toBe(0);
    expect(result.current.activeItemId).toBe('');
  });

  it('initializes with default expanded ids', () => {
    const { result } = renderHook(() => useSubMenuTree(mockItems, ['1', '1.1']));
    
    expect(result.current.expandedItemIds.has('1')).toBe(true);
    expect(result.current.expandedItemIds.has('1.1')).toBe(true);
  });

  it('toggles item expansion', () => {
    const { result } = renderHook(() => useSubMenuTree(mockItems));
    
    act(() => {
      result.current.toggleItem(mockItems[0]);
    });
    
    expect(result.current.expandedItemIds.has('1')).toBe(true);
    
    act(() => {
      result.current.toggleItem(mockItems[0]);
    });
    
    expect(result.current.expandedItemIds.has('1')).toBe(false);
  });

  it('sets active item', () => {
    const { result } = renderHook(() => useSubMenuTree(mockItems));
    
    act(() => {
      result.current.setActiveItemId('1.1');
    });
    
    expect(result.current.activeItemId).toBe('1.1');
  });

  it('expands all items', () => {
    const { result } = renderHook(() => useSubMenuTree(mockItems));
    
    act(() => {
      result.current.expandAll();
    });
    
    expect(result.current.expandedItemIds.has('1')).toBe(true);
    expect(result.current.expandedItemIds.has('1.1')).toBe(true);
  });

  it('collapses all items', () => {
    const { result } = renderHook(() => useSubMenuTree(mockItems, ['1', '1.1']));
    
    expect(result.current.expandedItemIds.size).toBe(2);
    
    act(() => {
      result.current.collapseAll();
    });
    
    expect(result.current.expandedItemIds.size).toBe(0);
  });

  it('expands to specific item', () => {
    const { result } = renderHook(() => useSubMenuTree(mockItems));
    
    act(() => {
      result.current.expandToItem('1.1.1');
    });
    
    expect(result.current.expandedItemIds.has('1')).toBe(true);
    expect(result.current.expandedItemIds.has('1.1')).toBe(true);
  });
});