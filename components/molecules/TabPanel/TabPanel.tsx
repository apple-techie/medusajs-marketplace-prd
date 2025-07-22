import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabPanelProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  
  // Display options
  variant?: 'default' | 'pills' | 'underline' | 'boxed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  
  // Behavior
  lazy?: boolean;
  keyboard?: boolean;
  autoFocus?: boolean;
  
  // Orientation
  orientation?: 'horizontal' | 'vertical';
  
  // Styling
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
  
  'aria-label'?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  lazy = false,
  keyboard = true,
  autoFocus = false,
  orientation = 'horizontal',
  className,
  tabClassName,
  contentClassName,
  'aria-label': ariaLabel,
}) => {
  // Determine initial tab
  const firstEnabledTab = tabs.find(tab => !tab.disabled)?.id || tabs[0]?.id;
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || firstEnabledTab
  );
  
  // Controlled vs uncontrolled
  const isControlled = controlledActiveTab !== undefined;
  const activeTabId = isControlled ? controlledActiveTab : internalActiveTab;
  
  // Tab refs for keyboard navigation
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const tabListRef = useRef<HTMLDivElement>(null);
  
  // Keep track of rendered tabs for lazy loading
  const [renderedTabs, setRenderedTabs] = useState<Set<string>>(
    new Set([activeTabId])
  );
  
  const handleTabClick = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab || tab.disabled) return;
    
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    
    if (lazy && !renderedTabs.has(tabId)) {
      setRenderedTabs(prev => new Set([...prev, tabId]));
    }
    
    onChange?.(tabId);
  }, [tabs, isControlled, onChange, lazy, renderedTabs]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!keyboard) return;
    
    const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);
    let nextIndex = currentIndex;
    
    const isHorizontal = orientation === 'horizontal';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    
    switch (event.key) {
      case prevKey:
        event.preventDefault();
        nextIndex = currentIndex - 1;
        while (nextIndex >= 0 && tabs[nextIndex].disabled) {
          nextIndex--;
        }
        if (nextIndex < 0) {
          // Wrap to end
          nextIndex = tabs.length - 1;
          while (nextIndex > currentIndex && tabs[nextIndex].disabled) {
            nextIndex--;
          }
        }
        break;
        
      case nextKey:
        event.preventDefault();
        nextIndex = currentIndex + 1;
        while (nextIndex < tabs.length && tabs[nextIndex].disabled) {
          nextIndex++;
        }
        if (nextIndex >= tabs.length) {
          // Wrap to start
          nextIndex = 0;
          while (nextIndex < currentIndex && tabs[nextIndex].disabled) {
            nextIndex++;
          }
        }
        break;
        
      case 'Home':
        event.preventDefault();
        nextIndex = tabs.findIndex(tab => !tab.disabled);
        break;
        
      case 'End':
        event.preventDefault();
        for (let i = tabs.length - 1; i >= 0; i--) {
          if (!tabs[i].disabled) {
            nextIndex = i;
            break;
          }
        }
        break;
        
      default:
        return;
    }
    
    if (nextIndex !== currentIndex && nextIndex >= 0 && nextIndex < tabs.length) {
      const nextTab = tabs[nextIndex];
      handleTabClick(nextTab.id);
      
      // Focus the next tab
      const nextTabElement = tabRefs.current.get(nextTab.id);
      nextTabElement?.focus();
    }
  }, [tabs, activeTabId, orientation, keyboard, handleTabClick]);
  
  // Auto focus active tab on mount
  useEffect(() => {
    if (autoFocus) {
      const activeTabElement = tabRefs.current.get(activeTabId);
      activeTabElement?.focus();
    }
  }, [autoFocus, activeTabId]);
  
  // Size styles
  const sizeStyles = {
    sm: {
      tab: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-1.5',
    },
    md: {
      tab: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      gap: 'gap-2',
    },
    lg: {
      tab: 'px-6 py-3 text-lg',
      icon: 'w-6 h-6',
      gap: 'gap-2.5',
    },
  };
  
  // Variant styles
  const variantStyles = {
    default: {
      list: orientation === 'horizontal' 
        ? 'border-b border-neutral-200 dark:border-neutral-700'
        : 'border-r border-neutral-200 dark:border-neutral-700',
      tab: cn(
        'relative font-medium transition-colors',
        'hover:text-neutral-900 dark:hover:text-neutral-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      ),
      active: orientation === 'horizontal'
        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 -mb-px'
        : 'text-primary-600 dark:text-primary-400 border-r-2 border-primary-600 dark:border-primary-400 -mr-px',
      inactive: 'text-neutral-600 dark:text-neutral-400',
    },
    pills: {
      list: orientation === 'horizontal' ? 'gap-2' : 'gap-2',
      tab: cn(
        'rounded-md font-medium transition-all',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      ),
      active: 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
      inactive: 'text-neutral-700 dark:text-neutral-300',
    },
    underline: {
      list: orientation === 'horizontal' ? 'gap-6' : 'gap-4',
      tab: cn(
        'pb-2 font-medium transition-all border-b-2',
        'hover:text-neutral-900 dark:hover:text-neutral-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      ),
      active: 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400',
      inactive: 'text-neutral-600 dark:text-neutral-400 border-transparent hover:border-neutral-300 dark:hover:border-neutral-600',
    },
    boxed: {
      list: cn(
        'p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800',
        orientation === 'horizontal' ? 'gap-1' : 'gap-1'
      ),
      tab: cn(
        'rounded-md font-medium transition-all',
        'hover:bg-neutral-200 dark:hover:bg-neutral-700',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      ),
      active: 'bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-neutral-100',
      inactive: 'text-neutral-600 dark:text-neutral-400',
    },
  };
  
  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  
  const activeTabData = tabs.find(tab => tab.id === activeTabId);
  
  return (
    <div
      className={cn(
        'w-full',
        orientation === 'vertical' && 'flex gap-6',
        className
      )}
      aria-label={ariaLabel || 'Tab panel'}
    >
      {/* Tab list */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          fullWidth && orientation === 'horizontal' && 'w-full',
          currentVariant.list,
          tabClassName
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={handleKeyDown}
              className={cn(
                currentVariant.tab,
                currentSize.tab,
                isActive ? currentVariant.active : currentVariant.inactive,
                fullWidth && orientation === 'horizontal' && 'flex-1 justify-center',
                'flex items-center',
                currentSize.gap
              )}
            >
              {tab.icon && (
                <Icon
                  icon={tab.icon}
                  className={cn(currentSize.icon, 'flex-shrink-0')}
                />
              )}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <Badge
                  size="sm"
                  variant={isActive ? 'secondary' : 'outline'}
                >
                  {tab.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Tab panels */}
      <div className={cn('flex-1', contentClassName)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const shouldRender = !lazy || renderedTabs.has(tab.id);
          
          if (!shouldRender) return null;
          
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`tabpanel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={!isActive}
              tabIndex={0}
              className={cn(
                'focus:outline-none',
                !isActive && 'hidden'
              )}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

TabPanel.displayName = 'TabPanel';