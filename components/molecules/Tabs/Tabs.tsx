import React, { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define tab variants
const tabVariants = cva(
  'relative inline-flex items-center justify-center px-4 py-2 font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'text-neutral-600 hover:text-neutral-900 data-[state=active]:text-neutral-900',
        underline: 'text-neutral-600 hover:text-neutral-900 data-[state=active]:text-neutral-900 border-b-2 border-transparent data-[state=active]:border-primary-600',
        pills: 'text-neutral-600 hover:text-neutral-900 data-[state=active]:text-white data-[state=active]:bg-neutral-900 rounded-lg',
        bordered: 'text-neutral-600 hover:text-neutral-900 data-[state=active]:text-neutral-900 border border-neutral-300 data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-50 first:rounded-l-lg last:rounded-r-lg',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-5 py-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const tabListVariants = cva(
  'inline-flex items-center',
  {
    variants: {
      variant: {
        default: 'gap-4',
        underline: 'gap-0 border-b border-neutral-200',
        pills: 'gap-1 p-1 bg-neutral-100 rounded-lg',
        bordered: 'gap-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Tab context
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  variant?: VariantProps<typeof tabVariants>['variant'];
  size?: VariantProps<typeof tabVariants>['size'];
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

// Main Tabs component
export interface TabsProps extends VariantProps<typeof tabVariants> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    value: controlledValue,
    defaultValue,
    onValueChange,
    children,
    className,
    variant,
    size,
    orientation = 'horizontal',
    ...props 
  }, ref) => {
    const [value, setValue] = useState(controlledValue || defaultValue || '');
    
    const handleValueChange = (newValue: string) => {
      if (controlledValue === undefined) {
        setValue(newValue);
      }
      onValueChange?.(newValue);
    };
    
    const contextValue: TabsContextValue = {
      value: controlledValue !== undefined ? controlledValue : value,
      onValueChange: handleValueChange,
      variant,
      size,
    };
    
    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            'w-full',
            orientation === 'vertical' && 'flex gap-4',
            className
          )}
          data-orientation={orientation}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

// TabsList component
export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = useTabsContext();
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
    const tabsRef = useRef<HTMLDivElement>(null);
    
    // Update indicator position for underline variant
    useEffect(() => {
      if (variant === 'underline' && tabsRef.current) {
        const activeTab = tabsRef.current.querySelector('[data-state="active"]');
        if (activeTab) {
          const { offsetLeft, offsetWidth } = activeTab as HTMLElement;
          setIndicatorStyle({
            left: offsetLeft,
            width: offsetWidth,
          });
        }
      }
    }, [variant, children]);
    
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(tabListVariants({ variant }), className)}
        {...props}
      >
        <div ref={tabsRef} className="relative inline-flex items-center">
          {children}
          {variant === 'underline' && (
            <div
              className="absolute bottom-0 h-0.5 bg-primary-600 transition-all duration-200"
              style={indicatorStyle}
            />
          )}
        </div>
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

// TabsTrigger component
export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, disabled, icon, badge, ...props }, ref) => {
    const { value: selectedValue, onValueChange, variant, size } = useTabsContext();
    const isActive = selectedValue === value;
    
    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        data-state={isActive ? 'active' : 'inactive'}
        disabled={disabled}
        className={cn(
          tabVariants({ variant, size }),
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={() => !disabled && onValueChange(value)}
        {...props}
      >
        {icon && (
          <span className="mr-2 shrink-0">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {badge && (
          <span className="ml-2 shrink-0">
            {badge}
          </span>
        )}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

// TabsContent component
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  forceMount?: boolean;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, forceMount = false, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext();
    const isActive = selectedValue === value;
    
    if (!forceMount && !isActive) {
      return null;
    }
    
    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state={isActive ? 'active' : 'inactive'}
        hidden={!isActive}
        className={cn(
          'mt-4 focus:outline-none',
          !isActive && forceMount && 'hidden',
          className
        )}
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';

// Helper hook for controlled tabs
export const useTabs = (defaultValue?: string) => {
  const [value, setValue] = useState(defaultValue || '');
  
  return {
    value,
    onValueChange: setValue,
  };
};

export { tabVariants, tabListVariants };