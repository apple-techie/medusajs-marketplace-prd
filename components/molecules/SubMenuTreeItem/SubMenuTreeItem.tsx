import React, { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';

// Define tree item variants
const treeItemVariants = cva(
  'relative flex items-center gap-2 px-3 py-2 cursor-pointer transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'hover:bg-neutral-50',
        rounded: 'rounded-lg hover:bg-neutral-50',
        minimal: 'hover:bg-transparent hover:text-primary-600',
      },
      size: {
        sm: 'text-xs py-1.5',
        md: 'text-sm py-2',
        lg: 'text-base py-2.5',
      },
      state: {
        default: '',
        active: 'bg-primary-50 text-primary-700 font-medium',
        disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
    },
  }
);

// Types
export interface TreeItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  disabled?: boolean;
  children?: TreeItem[];
  metadata?: Record<string, any>;
}

export interface SubMenuTreeItemProps extends VariantProps<typeof treeItemVariants> {
  item: TreeItem;
  level?: number;
  isExpanded?: boolean;
  isActive?: boolean;
  onToggle?: (item: TreeItem) => void;
  onClick?: (item: TreeItem) => void;
  onActiveChange?: (itemId: string) => void;
  expandIcon?: string;
  collapseIcon?: string;
  showExpandIcon?: boolean;
  indentSize?: number;
  showConnectors?: boolean;
  className?: string;
}

// Connector line component
const ConnectorLine: React.FC<{
  isLast: boolean;
  level: number;
  indentSize: number;
}> = ({ isLast, level, indentSize }) => {
  return (
    <div
      className="absolute top-0 bottom-0"
      style={{ left: `${level * indentSize}px` }}
    >
      <div className="relative h-full">
        {/* Vertical line */}
        <div
          className={cn(
            'absolute left-2 top-0 w-px bg-neutral-200',
            isLast ? 'h-1/2' : 'h-full'
          )}
        />
        {/* Horizontal line */}
        <div className="absolute left-2 top-1/2 h-px w-3 bg-neutral-200" />
      </div>
    </div>
  );
};

// Main SubMenuTreeItem component
export const SubMenuTreeItem = React.forwardRef<HTMLDivElement, SubMenuTreeItemProps>(
  ({
    item,
    level = 0,
    isExpanded: controlledExpanded,
    isActive: controlledActive,
    onToggle,
    onClick,
    onActiveChange,
    expandIcon = 'chevronRight',
    collapseIcon = 'chevronDown',
    showExpandIcon = true,
    indentSize = 24,
    showConnectors = false,
    variant,
    size,
    state: propState,
    className,
    ...props
  }, ref) => {
    const [internalExpanded, setInternalExpanded] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    
    // Use controlled expanded state if provided
    const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
    
    // Determine if this item or any of its children are active
    const isItemActive = controlledActive || false;
    
    // Determine the actual state
    const state = item.disabled ? 'disabled' : (isItemActive ? 'active' : propState || 'default');

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (hasChildren) {
        if (controlledExpanded === undefined) {
          setInternalExpanded(!internalExpanded);
        }
        onToggle?.(item);
      }
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (!item.disabled) {
        if (hasChildren && !item.href) {
          handleToggle(e);
        } else {
          onClick?.(item);
          onActiveChange?.(item.id);
        }
      }
    };

    const content = (
      <>
        {/* Connector lines */}
        {showConnectors && level > 0 && (
          <ConnectorLine
            isLast={false}
            level={level - 1}
            indentSize={indentSize}
          />
        )}

        {/* Main item content */}
        <div
          ref={ref}
          className={cn(
            treeItemVariants({ variant, size, state }),
            'w-full',
            className
          )}
          style={{ paddingLeft: `${level * indentSize + 12}px` }}
          onClick={handleClick}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={isItemActive}
          aria-disabled={item.disabled}
          {...props}
        >
          {/* Expand/Collapse Icon */}
          {showExpandIcon && hasChildren && (
            <button
              className="flex-shrink-0 p-0.5 hover:bg-neutral-100 rounded transition-colors"
              onClick={handleToggle}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <Icon
                icon={isExpanded ? collapseIcon : expandIcon}
                size="xs"
                className={cn(
                  'transition-transform duration-200',
                  state === 'active' ? 'text-primary-700' : 'text-neutral-500'
                )}
              />
            </button>
          )}

          {/* Spacer when no expand icon */}
          {showExpandIcon && !hasChildren && (
            <div className="w-5 flex-shrink-0" />
          )}

          {/* Item Icon */}
          {item.icon && (
            <Icon
              icon={item.icon}
              size="sm"
              className={cn(
                'flex-shrink-0',
                state === 'active' ? 'text-primary-700' : 'text-neutral-500'
              )}
            />
          )}

          {/* Label */}
          <span
            className={cn(
              'flex-1 truncate',
              state === 'active' ? 'font-medium' : ''
            )}
          >
            {item.label}
          </span>

          {/* Badge */}
          {item.badge && (
            <Badge
              variant={item.badgeVariant || (state === 'active' ? 'primary' : 'secondary')}
              size="xs"
            >
              {item.badge}
            </Badge>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {item.children!.map((child, index) => (
              <SubMenuTreeItem
                key={child.id}
                item={child}
                level={level + 1}
                onToggle={onToggle}
                onClick={onClick}
                onActiveChange={onActiveChange}
                expandIcon={expandIcon}
                collapseIcon={collapseIcon}
                showExpandIcon={showExpandIcon}
                indentSize={indentSize}
                showConnectors={showConnectors}
                variant={variant}
                size={size}
                isActive={controlledActive}
              />
            ))}
          </div>
        )}
      </>
    );

    // Wrap in anchor tag if href is provided
    if (item.href && !hasChildren) {
      return (
        <a href={item.href} className="no-underline text-inherit">
          {content}
        </a>
      );
    }

    return <>{content}</>;
  }
);

SubMenuTreeItem.displayName = 'SubMenuTreeItem';

// Tree component for rendering multiple items
export interface SubMenuTreeProps {
  items: TreeItem[];
  activeItemId?: string;
  expandedItemIds?: Set<string>;
  onItemClick?: (item: TreeItem) => void;
  onItemToggle?: (item: TreeItem) => void;
  onActiveChange?: (itemId: string) => void;
  showExpandIcon?: boolean;
  indentSize?: number;
  showConnectors?: boolean;
  variant?: VariantProps<typeof treeItemVariants>['variant'];
  size?: VariantProps<typeof treeItemVariants>['size'];
  className?: string;
}

export const SubMenuTree: React.FC<SubMenuTreeProps> = ({
  items,
  activeItemId,
  expandedItemIds,
  onItemClick,
  onItemToggle,
  onActiveChange,
  showExpandIcon = true,
  indentSize = 24,
  showConnectors = false,
  variant,
  size,
  className,
}) => {
  const isItemActive = (item: TreeItem): boolean => {
    if (item.id === activeItemId) return true;
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return false;
  };

  const isItemExpanded = (item: TreeItem): boolean => {
    return expandedItemIds?.has(item.id) || false;
  };

  return (
    <div className={cn('w-full', className)} role="tree">
      {items.map((item) => (
        <SubMenuTreeItem
          key={item.id}
          item={item}
          isExpanded={isItemExpanded(item)}
          isActive={isItemActive(item)}
          onToggle={onItemToggle}
          onClick={onItemClick}
          onActiveChange={onActiveChange}
          showExpandIcon={showExpandIcon}
          indentSize={indentSize}
          showConnectors={showConnectors}
          variant={variant}
          size={size}
        />
      ))}
    </div>
  );
};

// Hook for managing tree state
export const useSubMenuTree = (items: TreeItem[], defaultExpandedIds?: string[]) => {
  const [expandedItemIds, setExpandedItemIds] = useState<Set<string>>(
    new Set(defaultExpandedIds || [])
  );
  const [activeItemId, setActiveItemId] = useState<string>('');

  const toggleItem = (item: TreeItem) => {
    setExpandedItemIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item.id)) {
        newSet.delete(item.id);
      } else {
        newSet.add(item.id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (items: TreeItem[]) => {
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          allIds.add(item.id);
          collectIds(item.children);
        }
      });
    };
    collectIds(items);
    setExpandedItemIds(allIds);
  };

  const collapseAll = () => {
    setExpandedItemIds(new Set());
  };

  const expandToItem = (itemId: string) => {
    const path: string[] = [];
    const findPath = (items: TreeItem[], targetId: string, currentPath: string[] = []): boolean => {
      for (const item of items) {
        if (item.id === targetId) {
          path.push(...currentPath);
          return true;
        }
        if (item.children) {
          if (findPath(item.children, targetId, [...currentPath, item.id])) {
            return true;
          }
        }
      }
      return false;
    };
    
    findPath(items, itemId);
    setExpandedItemIds(new Set(path));
  };

  return {
    expandedItemIds,
    activeItemId,
    setActiveItemId,
    toggleItem,
    expandAll,
    collapseAll,
    expandToItem,
  };
};

export { treeItemVariants };