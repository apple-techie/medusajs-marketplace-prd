import React, { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Badge } from '../../atoms/Badge/Badge';

// Define navigation bar variants
const navBarVariants = cva(
  'w-full bg-white border-b border-neutral-200 sticky top-0 z-50',
  {
    variants: {
      variant: {
        default: 'bg-white',
        transparent: 'bg-transparent border-transparent',
        dark: 'bg-neutral-900 text-white border-neutral-800',
      },
      size: {
        sm: 'h-14',
        md: 'h-16',
        lg: 'h-20',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
}

export interface TopNavigationBarProps extends VariantProps<typeof navBarVariants> {
  logo?: React.ReactNode;
  logoHref?: string;
  navItems?: NavItem[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showCart?: boolean;
  cartCount?: number;
  onCartClick?: () => void;
  showNotifications?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  onUserMenuClick?: () => void;
  userMenuItems?: NavItem[];
  rightActions?: React.ReactNode;
  mobileMenuItems?: NavItem[];
  className?: string;
  sticky?: boolean;
}

// SearchInput component
const SearchInput: React.FC<{
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}> = ({ placeholder = 'Search products or brands', onSearch, className }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className={cn(
        'relative flex items-center transition-all duration-200',
        isFocused && 'ring-2 ring-primary-500 ring-offset-1',
        'rounded-lg'
      )}>
        <Icon 
          icon="search" 
          size="sm" 
          className="absolute left-3 text-neutral-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200',
            'rounded-lg text-sm placeholder-neutral-500',
            'focus:outline-none focus:bg-white',
            'transition-all duration-200'
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 p-1 hover:bg-neutral-100 rounded"
          >
            <Icon icon="close" size="xs" className="text-neutral-500" />
          </button>
        )}
      </div>
    </form>
  );
};

// UserMenu component
const UserMenu: React.FC<{
  user?: TopNavigationBarProps['user'];
  menuItems?: NavItem[];
  onMenuClick?: () => void;
}> = ({ user, menuItems, onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
    onMenuClick?.();
  };

  if (!user) {
    return (
      <Button variant="ghost" size="sm" leftIcon={<Icon icon="user" size="sm" />}>
        Sign In
      </Button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleMenuClick}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
      >
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="sm"
          fallback={user.name.charAt(0)}
        />
        <span className="text-sm font-medium hidden md:block">{user.name}</span>
        <Icon icon="chevronDown" size="xs" className="text-neutral-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-1">
          <div className="px-4 py-2 border-b border-neutral-100">
            <p className="text-sm font-medium text-neutral-900">{user.name}</p>
            {user.email && (
              <p className="text-xs text-neutral-500">{user.email}</p>
            )}
          </div>
          
          {menuItems?.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              {item.icon && <Icon icon={item.icon} size="xs" />}
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

// Main TopNavigationBar component
export const TopNavigationBar = React.forwardRef<HTMLElement, TopNavigationBarProps>(
  ({ 
    logo,
    logoHref = '/',
    navItems = [],
    showSearch = true,
    searchPlaceholder,
    onSearch,
    showCart = true,
    cartCount = 0,
    onCartClick,
    showNotifications = false,
    notificationCount = 0,
    onNotificationClick,
    user,
    onUserMenuClick,
    userMenuItems = [],
    rightActions,
    mobileMenuItems = [],
    variant = 'default',
    size = 'md',
    className,
    sticky = true,
    ...props 
  }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const defaultUserMenuItems: NavItem[] = [
      { id: 'profile', label: 'My Profile', href: '/profile', icon: 'user' },
      { id: 'orders', label: 'My Orders', href: '/orders', icon: 'package' },
      { id: 'settings', label: 'Settings', href: '/settings', icon: 'settings' },
      { id: 'logout', label: 'Sign Out', href: '/logout', icon: 'logout' },
    ];

    const finalUserMenuItems = userMenuItems.length > 0 ? userMenuItems : defaultUserMenuItems;

    return (
      <nav
        ref={ref}
        className={cn(
          navBarVariants({ variant, size }),
          sticky && 'sticky',
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <a href={logoHref} className="flex items-center">
                {logo || (
                  <span className="text-xl font-bold text-primary-600">NeoMart</span>
                )}
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      variant === 'dark' 
                        ? "text-neutral-300 hover:text-white" 
                        : "text-neutral-700 hover:text-primary-600"
                    )}
                  >
                    {item.label}
                    {item.badge && (
                      <Badge variant="primary" size="xs" className="ml-2">
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                ))}
              </nav>
            </div>

            {/* Center - Search */}
            {showSearch && (
              <div className="hidden md:block flex-1 max-w-2xl px-8">
                <SearchInput 
                  placeholder={searchPlaceholder}
                  onSearch={onSearch}
                />
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Button */}
              {showSearch && (
                <button
                  className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="Search"
                >
                  <Icon icon="search" size="sm" />
                </button>
              )}

              {/* Notifications */}
              {showNotifications && (
                <button
                  onClick={onNotificationClick}
                  className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="Notifications"
                >
                  <Icon icon="bell" size="sm" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
              )}

              {/* Cart */}
              {showCart && (
                <button
                  onClick={onCartClick}
                  className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="Shopping cart"
                >
                  <Icon icon="shoppingCart" size="sm" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* User Menu */}
              <UserMenu 
                user={user}
                menuItems={finalUserMenuItems}
                onMenuClick={onUserMenuClick}
              />

              {/* Custom Right Actions */}
              {rightActions}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <Icon icon={isMobileMenuOpen ? 'close' : 'menu'} size="sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search */}
              {showSearch && (
                <div className="mb-4">
                  <SearchInput 
                    placeholder={searchPlaceholder}
                    onSearch={(query) => {
                      onSearch?.(query);
                      setIsMobileMenuOpen(false);
                    }}
                  />
                </div>
              )}

              {/* Mobile Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      {item.icon && <Icon icon={item.icon} size="sm" />}
                      {item.label}
                    </span>
                    {item.badge && (
                      <Badge variant="primary" size="xs">
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                ))}
                
                {/* Additional Mobile Menu Items */}
                {mobileMenuItems.length > 0 && (
                  <>
                    <div className="border-t border-neutral-200 my-2" />
                    {mobileMenuItems.map((item) => (
                      <a
                        key={item.id}
                        href={item.href}
                        className="flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          {item.icon && <Icon icon={item.icon} size="sm" />}
                          {item.label}
                        </span>
                      </a>
                    ))}
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </nav>
    );
  }
);

TopNavigationBar.displayName = 'TopNavigationBar';

// Hook for managing navigation state
export const useTopNavigation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  const updateCartCount = (count: number) => {
    setCartCount(count);
  };

  const updateNotificationCount = (count: number) => {
    setNotificationCount(count);
  };

  const search = (query: string) => {
    setSearchQuery(query);
    // Implement search logic
  };

  return {
    searchQuery,
    cartCount,
    notificationCount,
    updateCartCount,
    updateNotificationCount,
    search,
  };
};

export { navBarVariants };