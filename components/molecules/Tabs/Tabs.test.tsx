import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent, useTabs } from './Tabs';
import { renderHook, act } from '@testing-library/react';

describe('Tabs Component', () => {
  const TestTabs = ({ defaultValue = 'tab1', ...props }) => (
    <Tabs defaultValue={defaultValue} {...props}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
      <TabsContent value="tab3">Content 3</TabsContent>
    </Tabs>
  );

  it('renders with default tab selected', () => {
    render(<TestTabs />);
    
    expect(screen.getByText('Tab 1')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Tab 2')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Tab 3')).toHaveAttribute('aria-selected', 'false');
    
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('switches tabs on click', () => {
    render(<TestTabs />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    
    expect(screen.getByText('Tab 1')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Tab 2')).toHaveAttribute('aria-selected', 'true');
    
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('works with controlled value', () => {
    const onValueChange = jest.fn();
    const { rerender } = render(
      <TestTabs value="tab1" onValueChange={onValueChange} />
    );
    
    fireEvent.click(screen.getByText('Tab 2'));
    expect(onValueChange).toHaveBeenCalledWith('tab2');
    
    // Content doesn't change until value prop is updated
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    
    // Update value prop
    rerender(<TestTabs value="tab2" onValueChange={onValueChange} />);
    
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container: defaultContainer } = render(
      <TestTabs variant="default" />
    );
    expect(defaultContainer.querySelector('[role="tablist"]')).toHaveClass('gap-4');

    const { container: underlineContainer } = render(
      <TestTabs variant="underline" />
    );
    expect(underlineContainer.querySelector('[role="tablist"]')).toHaveClass('border-b');

    const { container: pillsContainer } = render(
      <TestTabs variant="pills" />
    );
    expect(pillsContainer.querySelector('[role="tablist"]')).toHaveClass('bg-neutral-100', 'rounded-lg');

    const { container: borderedContainer } = render(
      <TestTabs variant="bordered" />
    );
    expect(borderedContainer.querySelector('[role="tablist"]')).toHaveClass('gap-0');
  });

  it('applies size variants', () => {
    const { container: smContainer } = render(<TestTabs size="sm" />);
    const smTab = smContainer.querySelector('[role="tab"]');
    expect(smTab).toHaveClass('text-sm', 'px-3', 'py-1.5');

    const { container: lgContainer } = render(<TestTabs size="lg" />);
    const lgTab = lgContainer.querySelector('[role="tab"]');
    expect(lgTab).toHaveClass('text-lg', 'px-5', 'py-2.5');
  });

  it('supports vertical orientation', () => {
    const { container } = render(<TestTabs orientation="vertical" />);
    const tabsDiv = container.firstChild;
    expect(tabsDiv).toHaveAttribute('data-orientation', 'vertical');
    expect(tabsDiv).toHaveClass('flex', 'gap-4');
  });

  it('handles disabled tabs', () => {
    const onValueChange = jest.fn();
    render(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    
    const disabledTab = screen.getByText('Tab 2');
    expect(disabledTab).toBeDisabled();
    expect(disabledTab).toHaveClass('opacity-50', 'cursor-not-allowed');
    
    fireEvent.click(disabledTab);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders with icon and badge', () => {
    const Icon = () => <span data-testid="icon">📦</span>;
    const Badge = () => <span data-testid="badge">3</span>;
    
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" icon={<Icon />} badge={<Badge />}>
            Tab with extras
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(<TestTabs />);
    
    const tabList = screen.getByRole('tablist');
    expect(tabList).toBeInTheDocument();
    
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    
    const tabPanels = screen.getAllByRole('tabpanel', { hidden: true });
    expect(tabPanels).toHaveLength(1); // Only active panel is rendered by default
  });

  it('applies custom className', () => {
    render(
      <Tabs defaultValue="tab1" className="custom-tabs">
        <TabsList className="custom-list">
          <TabsTrigger value="tab1" className="custom-trigger">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content">
          Content
        </TabsContent>
      </Tabs>
    );
    
    expect(document.querySelector('.custom-tabs')).toBeInTheDocument();
    expect(document.querySelector('.custom-list')).toBeInTheDocument();
    expect(document.querySelector('.custom-trigger')).toBeInTheDocument();
    expect(document.querySelector('.custom-content')).toBeInTheDocument();
  });

  it('forwards refs correctly', () => {
    const tabsRef = React.createRef<HTMLDivElement>();
    const listRef = React.createRef<HTMLDivElement>();
    const triggerRef = React.createRef<HTMLButtonElement>();
    const contentRef = React.createRef<HTMLDivElement>();
    
    render(
      <Tabs ref={tabsRef} defaultValue="tab1">
        <TabsList ref={listRef}>
          <TabsTrigger ref={triggerRef} value="tab1">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent ref={contentRef} value="tab1">
          Content
        </TabsContent>
      </Tabs>
    );
    
    expect(tabsRef.current).toBeInstanceOf(HTMLDivElement);
    expect(listRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('TabsContent forceMount', () => {
  it('renders inactive content when forceMount is true', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2" forceMount>
          Content 2
        </TabsContent>
      </Tabs>
    );
    
    const content2 = screen.getByText('Content 2');
    expect(content2).toBeInTheDocument();
    expect(content2.parentElement).toHaveAttribute('hidden');
    expect(content2.parentElement).toHaveClass('hidden');
  });
});

describe('useTabs Hook', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useTabs('tab2'));
    expect(result.current.value).toBe('tab2');
  });

  it('updates value when onValueChange is called', () => {
    const { result } = renderHook(() => useTabs('tab1'));
    
    act(() => {
      result.current.onValueChange('tab3');
    });
    
    expect(result.current.value).toBe('tab3');
  });

  it('works with Tabs component', () => {
    const TestComponent = () => {
      const tabs = useTabs('tab1');
      
      return (
        <Tabs {...tabs}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
    };
    
    render(<TestComponent />);
    
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Tab 2'));
    
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});