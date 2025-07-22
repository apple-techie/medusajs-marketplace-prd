import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabPanel } from './TabPanel';

// Mock components
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, className }: any) => (
    <span data-testid={`icon-${icon}`} className={className}>
      {icon}
    </span>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, size, variant }: any) => (
    <span data-testid="badge" data-size={size} data-variant={variant}>
      {children}
    </span>
  ),
}));

describe('TabPanel Component', () => {
  const mockTabs = [
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <div>Content 1</div>,
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: <div>Content 2</div>,
    },
    {
      id: 'tab3',
      label: 'Tab 3',
      content: <div>Content 3</div>,
      disabled: true,
    },
  ];

  it('renders all tabs', () => {
    render(<TabPanel tabs={mockTabs} />);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('shows first tab content by default', () => {
    render(<TabPanel tabs={mockTabs} />);
    
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('shows default tab when specified', () => {
    render(<TabPanel tabs={mockTabs} defaultTab="tab2" />);
    
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('switches tabs on click', () => {
    render(<TabPanel tabs={mockTabs} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('calls onChange when tab is clicked', () => {
    const handleChange = jest.fn();
    render(<TabPanel tabs={mockTabs} onChange={handleChange} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });

  it('respects controlled active tab', () => {
    const { rerender } = render(
      <TabPanel tabs={mockTabs} activeTab="tab2" onChange={() => {}} />
    );
    
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    
    // Try to click tab 1
    fireEvent.click(screen.getByText('Tab 1'));
    
    // Should still show tab 2 (controlled)
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    
    // Update controlled value
    rerender(
      <TabPanel tabs={mockTabs} activeTab="tab1" onChange={() => {}} />
    );
    
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('renders tabs with icons', () => {
    const tabsWithIcons = [
      { id: '1', label: 'Home', content: 'Home content', icon: 'home' },
      { id: '2', label: 'Settings', content: 'Settings content', icon: 'settings' },
    ];
    
    render(<TabPanel tabs={tabsWithIcons} />);
    
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
  });

  it('renders tabs with badges', () => {
    const tabsWithBadges = [
      { id: '1', label: 'Messages', content: 'Messages', badge: 5 },
      { id: '2', label: 'Notifications', content: 'Notifications', badge: 'New' },
    ];
    
    render(<TabPanel tabs={tabsWithBadges} />);
    
    const badges = screen.getAllByTestId('badge');
    expect(badges[0]).toHaveTextContent('5');
    expect(badges[1]).toHaveTextContent('New');
  });

  it('disables disabled tabs', () => {
    render(<TabPanel tabs={mockTabs} />);
    
    const disabledTab = screen.getByText('Tab 3').closest('button');
    expect(disabledTab).toBeDisabled();
    
    fireEvent.click(disabledTab!);
    // Should not switch to disabled tab
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<TabPanel tabs={mockTabs} keyboard />);
    
    const tab1 = screen.getByText('Tab 1');
    tab1.focus();
    
    // Arrow right
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('Tab 2')).toHaveFocus();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    
    // Arrow right again (should skip disabled tab)
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('Tab 1')).toHaveFocus();
    
    // Arrow left
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('Tab 2')).toHaveFocus();
  });

  it('supports Home and End keys', async () => {
    const user = userEvent.setup();
    render(<TabPanel tabs={mockTabs} keyboard />);
    
    const tab2 = screen.getByText('Tab 2');
    tab2.focus();
    
    // Home key
    await user.keyboard('{Home}');
    expect(screen.getByText('Tab 1')).toHaveFocus();
    
    // End key
    await user.keyboard('{End}');
    expect(screen.getByText('Tab 2')).toHaveFocus(); // Tab 3 is disabled
  });

  it('supports vertical orientation', async () => {
    const user = userEvent.setup();
    render(<TabPanel tabs={mockTabs} orientation="vertical" keyboard />);
    
    const tab1 = screen.getByText('Tab 1');
    tab1.focus();
    
    // Arrow down in vertical mode
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Tab 2')).toHaveFocus();
    
    // Arrow up
    await user.keyboard('{ArrowUp}');
    expect(screen.getByText('Tab 1')).toHaveFocus();
  });

  it('supports lazy loading', () => {
    render(<TabPanel tabs={mockTabs} lazy />);
    
    // Only first tab content should be in DOM
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    
    // Click tab 2
    fireEvent.click(screen.getByText('Tab 2'));
    
    // Now both should be in DOM
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = render(
      <TabPanel tabs={mockTabs} variant="pills" />
    );
    
    let tab1 = screen.getByText('Tab 1').closest('button');
    expect(tab1).toHaveClass('rounded-md');
    
    rerender(<TabPanel tabs={mockTabs} variant="underline" />);
    tab1 = screen.getByText('Tab 1').closest('button');
    expect(tab1).toHaveClass('border-b-2');
    
    rerender(<TabPanel tabs={mockTabs} variant="boxed" />);
    const tabList = screen.getByRole('tablist');
    expect(tabList).toHaveClass('bg-neutral-100');
  });

  it('renders different sizes', () => {
    const { rerender } = render(
      <TabPanel tabs={mockTabs} size="sm" />
    );
    
    let tab1 = screen.getByText('Tab 1').closest('button');
    expect(tab1).toHaveClass('px-3', 'py-1.5', 'text-sm');
    
    rerender(<TabPanel tabs={mockTabs} size="lg" />);
    tab1 = screen.getByText('Tab 1').closest('button');
    expect(tab1).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('supports full width', () => {
    render(<TabPanel tabs={mockTabs} fullWidth />);
    
    const tab1 = screen.getByText('Tab 1').closest('button');
    expect(tab1).toHaveClass('flex-1', 'justify-center');
  });

  it('auto focuses active tab when autoFocus is true', () => {
    render(<TabPanel tabs={mockTabs} defaultTab="tab2" autoFocus />);
    
    expect(screen.getByText('Tab 2')).toHaveFocus();
  });

  it('skips first disabled tab for default', () => {
    const tabsWithFirstDisabled = [
      { id: '1', label: 'Disabled', content: 'Content 1', disabled: true },
      { id: '2', label: 'Enabled', content: 'Content 2' },
    ];
    
    render(<TabPanel tabs={tabsWithFirstDisabled} />);
    
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('applies custom class names', () => {
    render(
      <TabPanel
        tabs={mockTabs}
        className="custom-container"
        tabClassName="custom-tabs"
        contentClassName="custom-content"
      />
    );
    
    const container = screen.getByLabelText('Tab panel');
    expect(container).toHaveClass('custom-container');
    
    const tabList = screen.getByRole('tablist');
    expect(tabList).toHaveClass('custom-tabs');
    
    const content = screen.getByRole('tabpanel');
    expect(content.parentElement).toHaveClass('custom-content');
  });

  it('uses custom aria-label', () => {
    render(
      <TabPanel
        tabs={mockTabs}
        aria-label="Product information tabs"
      />
    );
    
    expect(screen.getByLabelText('Product information tabs')).toBeInTheDocument();
  });

  it('sets proper ARIA attributes', () => {
    render(<TabPanel tabs={mockTabs} />);
    
    const tab1 = screen.getByText('Tab 1').closest('button');
    const tab2 = screen.getByText('Tab 2').closest('button');
    const panel1 = screen.getByRole('tabpanel');
    
    expect(tab1).toHaveAttribute('role', 'tab');
    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(tab1).toHaveAttribute('aria-controls', 'tabpanel-tab1');
    expect(tab1).toHaveAttribute('id', 'tab-tab1');
    
    expect(tab2).toHaveAttribute('aria-selected', 'false');
    
    expect(panel1).toHaveAttribute('aria-labelledby', 'tab-tab1');
    expect(panel1).toHaveAttribute('id', 'tabpanel-tab1');
  });

  it('handles empty tabs array', () => {
    render(<TabPanel tabs={[]} />);
    
    const tabList = screen.getByRole('tablist');
    expect(tabList).toBeEmptyDOMElement();
  });
});