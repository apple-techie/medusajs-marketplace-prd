import React, { useState, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Badge } from '../../atoms/Badge/Badge';

// Define sidebar variants
const sidebarVariants = cva(
  'flex flex-col h-full bg-white border-r border-neutral-200 transition-all duration-300',
  {
    variants: {
      size: {
        collapsed: 'w-16',
        default: 'w-64',
        expanded: 'w-80',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Types
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  badge?: string | number;
  items?: MenuItem[];
  disabled?: boolean;
}

export interface StoreInfo {
  logo?: string;
  name: string;
  openTime?: string;
  totalTransactions?: string;
  followers?: string;
}

export interface SellerDashboardSidebarProps extends VariantProps<typeof sidebarVariants> {
  storeInfo?: StoreInfo;
  menuItems?: MenuItem[];
  activeItemId?: string;
  onItemClick?: (item: MenuItem) => void;
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  showStoreStats?: boolean;
  className?: string;
}

// Store Header Component
const StoreHeader: React.FC<{
  storeInfo?: StoreInfo;
  collapsed?: boolean;
  showStats?: boolean;
}> = ({ storeInfo, collapsed, showStats }) => {
  if (!storeInfo) return null;

  return (
    <div className="p-4 border-b border-neutral-200">
      <div className="flex items-center gap-3">
        <Avatar
          src={storeInfo.logo}
          alt={storeInfo.name}
          size={collapsed ? 'sm' : 'md'}
          fallback={storeInfo.name.charAt(0)}
          className="flex-shrink-0"
        />
        {!collapsed && (
          <div className="min-w-0">
            <h3 className="font-semibold text-neutral-900 truncate">
              {storeInfo.name}
            </h3>
            {showStats && (
              <div className="mt-2 space-y-1">
                {storeInfo.openTime && (
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Icon icon="clock" size="xs" />
                    <span>Open Time: {storeInfo.openTime}</span>
                  </div>
                )}
                {storeInfo.totalTransactions && (
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Icon icon="trending" size="xs" />
                    <span>Total Transaction: {storeInfo.totalTransactions}</span>
                  </div>
                )}
                {storeInfo.followers && (
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Icon icon="users" size="xs" />
                    <span>Followers: {storeInfo.followers}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Menu Item Component
const MenuItemComponent: React.FC<{
  item: MenuItem;
  isActive?: boolean;
  isExpanded?: boolean;
  collapsed?: boolean;
  level?: number;
  onClick?: (item: MenuItem) => void;
  onToggleExpand?: () => void;
}> = ({ 
  item, 
  isActive, 
  isExpanded, 
  collapsed, 
  level = 0, 
  onClick,
  onToggleExpand 
}) => {
  const hasChildren = item.items && item.items.length > 0;
  const isRootLevel = level === 0;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (hasChildren && !item.href) {
      onToggleExpand?.();
    } else {
      onClick?.(item);
    }
  };

  return (
    <div
      className={cn(
        'group relative flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200',
        'hover:bg-neutral-50',
        isActive && 'bg-primary-50 text-primary-700 hover:bg-primary-100',
        item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        !isRootLevel && 'ml-6'
      )}
      onClick={handleClick}
      style={{ paddingLeft: collapsed && isRootLevel ? '12px' : `${12 + level * 24}px` }}
    >
      <Icon 
        icon={item.icon} 
        size="sm" 
        className={cn(
          'flex-shrink-0 transition-colors',
          isActive ? 'text-primary-700' : 'text-neutral-500 group-hover:text-neutral-700'
        )}
      />
      
      {!collapsed && (
        <>
          <span className={cn(
            'ml-3 flex-1 text-sm font-medium truncate',
            isActive ? 'text-primary-700' : 'text-neutral-700'
          )}>
            {item.label}
          </span>
          
          {item.badge && (
            <Badge 
              variant={isActive ? 'primary' : 'secondary'} 
              size="xs"
              className="ml-2"
            >
              {item.badge}
            </Badge>
          )}
          
          {hasChildren && (
            <Icon 
              icon="chevronDown" 
              size="xs"
              className={cn(
                'ml-2 transition-transform duration-200',
                isExpanded && 'rotate-180',
                isActive ? 'text-primary-700' : 'text-neutral-400'
              )}
            />
          )}
        </>
      )}
      
      {collapsed && isRootLevel && (
        <div className="absolute left-full ml-2 px-3 py-1.5 bg-neutral-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          {item.label}
          {item.badge && (
            <Badge variant="secondary" size="xs" className="ml-2">
              {item.badge}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

// Main Sidebar Component
export const SellerDashboardSidebar = React.forwardRef<HTMLElement, SellerDashboardSidebarProps>(
  ({
    storeInfo,
    menuItems = [],
    activeItemId,
    onItemClick,
    collapsible = true,
    collapsed: controlledCollapsed,
    onCollapsedChange,
    showStoreStats = true,
    size,
    className,
    ...props
  }, ref) => {
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    
    // Use controlled value if provided, otherwise use internal state
    const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
    
    const handleToggleCollapse = () => {
      const newValue = !isCollapsed;
      if (controlledCollapsed === undefined) {
        setInternalCollapsed(newValue);
      }
      onCollapsedChange?.(newValue);
    };

    const toggleItemExpanded = (itemId: string) => {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    };

    const isItemActive = (item: MenuItem): boolean => {
      if (item.id === activeItemId) return true;
      if (item.items) {
        return item.items.some(child => isItemActive(child));
      }
      return false;
    };

    // Expand parent items if child is active
    useEffect(() => {
      if (activeItemId) {
        const findParentIds = (items: MenuItem[], targetId: string, parentIds: string[] = []): string[] => {
          for (const item of items) {
            if (item.id === targetId) {
              return parentIds;
            }
            if (item.items) {
              const found = findParentIds(item.items, targetId, [...parentIds, item.id]);
              if (found.length > parentIds.length) {
                return found;
              }
            }
          }
          return [];
        };

        const parentIds = findParentIds(menuItems, activeItemId);
        if (parentIds.length > 0) {
          setExpandedItems(new Set(parentIds));
        }
      }
    }, [activeItemId, menuItems]);

    const renderMenuItems = (items: MenuItem[], level = 0) => {
      return items.map(item => {
        const isActive = isItemActive(item);
        const isExpanded = expandedItems.has(item.id);
        const hasChildren = item.items && item.items.length > 0;

        return (
          <div key={item.id}>
            <MenuItemComponent
              item={item}
              isActive={isActive}
              isExpanded={isExpanded}
              collapsed={isCollapsed}
              level={level}
              onClick={onItemClick}
              onToggleExpand={() => toggleItemExpanded(item.id)}
            />
            
            {hasChildren && isExpanded && !isCollapsed && (
              <div className="mt-1">
                {renderMenuItems(item.items!, level + 1)}
              </div>
            )}
          </div>
        );
      });
    };

    return (
      <aside
        ref={ref}
        className={cn(
          sidebarVariants({ size: isCollapsed ? 'collapsed' : size }),
          className
        )}
        {...props}
      >
        {/* Store Header */}
        <StoreHeader
          storeInfo={storeInfo}
          collapsed={isCollapsed}
          showStats={showStoreStats}
        />

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {renderMenuItems(menuItems)}
          </div>
        </nav>

        {/* Collapse Toggle */}
        {collapsible && (
          <div className="p-3 border-t border-neutral-200">
            <button
              onClick={handleToggleCollapse}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon 
                icon={isCollapsed ? 'chevronRight' : 'chevronLeft'} 
                size="sm"
                className="text-neutral-600"
              />
            </button>
          </div>
        )}
      </aside>
    );
  }
);

SellerDashboardSidebar.displayName = 'SellerDashboardSidebar';

// Hook for managing sidebar state
export const useSellerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string>('');

  const toggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };

  const setActiveItem = (itemId: string) => {
    setActiveItemId(itemId);
  };

  return {
    collapsed,
    activeItemId,
    setCollapsed,
    toggleCollapsed,
    setActiveItem,
  };
};

export { sidebarVariants };