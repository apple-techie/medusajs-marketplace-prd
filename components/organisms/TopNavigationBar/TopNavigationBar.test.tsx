import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopNavigationBar, useTopNavigation } from './TopNavigationBar';
import { renderHook, act } from '@testing-library/react';

describe('TopNavigationBar Component', () => {
  const mockNavItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'shop', label: 'Shop', href: '/shop', badge: 'New' },
    { id: 'about', label: 'About', href: '/about' },
  ];

  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  it('renders with default logo', () => {
    render(<TopNavigationBar />);
    expect(screen.getByText('NeoMart')).toBeInTheDocument();
  });

  it('renders with custom logo', () => {
    render(
      <TopNavigationBar 
        logo={<img src="/logo.png" alt="Custom Logo" />}
      />
    );
    expect(screen.getByAltText('Custom Logo')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<TopNavigationBar navItems={mockNavItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('shows search input when enabled', () => {
    render(<TopNavigationBar showSearch={true} />);
    expect(screen.getByPlaceholderText('Search products or brands')).toBeInTheDocument();
  });

  it('hides search input when disabled', () => {
    render(<TopNavigationBar showSearch={false} />);
    expect(screen.queryByPlaceholderText('Search products or brands')).not.toBeInTheDocument();
  });

  it('handles search submission', async () => {
    const handleSearch = jest.fn();
    const user = userEvent.setup();
    
    render(
      <TopNavigationBar 
        showSearch={true}
        onSearch={handleSearch}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search products or brands');
    await user.type(searchInput, 'test query');
    await user.keyboard('{Enter}');
    
    expect(handleSearch).toHaveBeenCalledWith('test query');
  });

  it('shows cart with count', () => {
    render(<TopNavigationBar showCart={true} cartCount={5} />);
    
    const cartButton = screen.getByLabelText('Shopping cart');
    expect(cartButton).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows 9+ for cart count over 9', () => {
    render(<TopNavigationBar showCart={true} cartCount={15} />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('handles cart click', () => {
    const handleCartClick = jest.fn();
    render(
      <TopNavigationBar 
        showCart={true}
        cartCount={3}
        onCartClick={handleCartClick}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Shopping cart'));
    expect(handleCartClick).toHaveBeenCalledTimes(1);
  });

  it('shows notifications with count', () => {
    render(
      <TopNavigationBar 
        showNotifications={true}
        notificationCount={7}
      />
    );
    
    const notificationButton = screen.getByLabelText('Notifications');
    expect(notificationButton).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('shows sign in button when no user', () => {
    render(<TopNavigationBar user={undefined} />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('shows user menu when user is provided', () => {
    render(<TopNavigationBar user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument(); // Avatar fallback
  });

  it('toggles user menu on click', async () => {
    render(<TopNavigationBar user={mockUser} />);
    
    const userButton = screen.getByText('John Doe');
    fireEvent.click(userButton);
    
    await waitFor(() => {
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('My Profile')).toBeInTheDocument();
      expect(screen.getByText('My Orders')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  it('closes user menu on outside click', async () => {
    render(
      <div>
        <TopNavigationBar user={mockUser} />
        <button>Outside</button>
      </div>
    );
    
    const userButton = screen.getByText('John Doe');
    fireEvent.click(userButton);
    
    await waitFor(() => {
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
    
    fireEvent.mouseDown(screen.getByText('Outside'));
    
    await waitFor(() => {
      expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
    });
  });

  it('renders custom user menu items', () => {
    const customMenuItems = [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'home' },
      { id: 'logout', label: 'Logout', href: '/logout', icon: 'logout' },
    ];
    
    render(
      <TopNavigationBar 
        user={mockUser}
        userMenuItems={customMenuItems}
      />
    );
    
    fireEvent.click(screen.getByText('John Doe'));
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('My Profile')).not.toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<TopNavigationBar navItems={mockNavItems} />);
    
    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);
    
    // Check mobile menu is visible
    const mobileNavItems = screen.getAllByText('Shop');
    expect(mobileNavItems).toHaveLength(2); // Desktop and mobile
  });

  it('shows search in mobile menu', () => {
    render(<TopNavigationBar showSearch={true} />);
    
    const menuButton = screen.getByLabelText('Menu');
    fireEvent.click(menuButton);
    
    const searchInputs = screen.getAllByPlaceholderText('Search products or brands');
    expect(searchInputs).toHaveLength(2); // Desktop and mobile
  });

  it('applies variant styles', () => {
    const { container: defaultContainer } = render(
      <TopNavigationBar variant="default" />
    );
    expect(defaultContainer.firstChild).toHaveClass('bg-white');

    const { container: darkContainer } = render(
      <TopNavigationBar variant="dark" />
    );
    expect(darkContainer.firstChild).toHaveClass('bg-neutral-900', 'text-white');
  });

  it('applies size variants', () => {
    const { container: smContainer } = render(
      <TopNavigationBar size="sm" />
    );
    expect(smContainer.firstChild).toHaveClass('h-14');

    const { container: lgContainer } = render(
      <TopNavigationBar size="lg" />
    );
    expect(lgContainer.firstChild).toHaveClass('h-20');
  });

  it('applies sticky positioning', () => {
    const { container } = render(<TopNavigationBar sticky={true} />);
    expect(container.firstChild).toHaveClass('sticky', 'top-0', 'z-50');
  });

  it('removes sticky positioning when disabled', () => {
    const { container } = render(<TopNavigationBar sticky={false} />);
    expect(container.firstChild).not.toHaveClass('sticky');
  });

  it('renders custom right actions', () => {
    render(
      <TopNavigationBar 
        rightActions={<button>Custom Action</button>}
      />
    );
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('renders mobile menu items', () => {
    const mobileItems = [
      { id: 'help', label: 'Help', href: '/help' },
      { id: 'contact', label: 'Contact', href: '/contact' },
    ];
    
    render(
      <TopNavigationBar 
        navItems={mockNavItems}
        mobileMenuItems={mobileItems}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Menu'));
    
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TopNavigationBar className="custom-nav" />
    );
    expect(container.firstChild).toHaveClass('custom-nav');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLElement>();
    render(<TopNavigationBar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('useTopNavigation Hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useTopNavigation());
    
    expect(result.current.searchQuery).toBe('');
    expect(result.current.cartCount).toBe(0);
    expect(result.current.notificationCount).toBe(0);
  });

  it('updates cart count', () => {
    const { result } = renderHook(() => useTopNavigation());
    
    act(() => {
      result.current.updateCartCount(5);
    });
    
    expect(result.current.cartCount).toBe(5);
  });

  it('updates notification count', () => {
    const { result } = renderHook(() => useTopNavigation());
    
    act(() => {
      result.current.updateNotificationCount(3);
    });
    
    expect(result.current.notificationCount).toBe(3);
  });

  it('updates search query', () => {
    const { result } = renderHook(() => useTopNavigation());
    
    act(() => {
      result.current.search('test query');
    });
    
    expect(result.current.searchQuery).toBe('test query');
  });
});