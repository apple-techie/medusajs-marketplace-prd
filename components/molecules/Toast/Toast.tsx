import React, { useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define toast variants
const toastVariants = cva(
  'flex items-center gap-4 p-4 rounded-xl shadow-lg transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-neutral-900 text-white',
        success: 'bg-success-600 text-white',
        warning: 'bg-warning-500 text-white',
        danger: 'bg-danger-600 text-white',
        info: 'bg-primary-600 text-white',
      },
      position: {
        'top-left': 'top-4 left-4',
        'top-center': 'top-4 left-1/2 -translate-x-1/2',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'top-right',
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  // Content
  message: string;
  description?: string;
  
  // Icon
  icon?: React.ReactNode;
  showIcon?: boolean;
  
  // Behavior
  duration?: number;
  persistent?: boolean;
  onClose?: () => void;
  
  // Actions
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast icons
const ToastIcons = {
  success: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
        fill="currentColor"
      />
    </svg>
  ),
  warning: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"
        fill="currentColor"
      />
    </svg>
  ),
  danger: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
        fill="currentColor"
      />
    </svg>
  ),
  info: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
        fill="currentColor"
      />
    </svg>
  ),
};

// Close icon
const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 5L5 15M5 5L15 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant,
      position,
      message,
      description,
      icon,
      showIcon = true,
      duration = 5000,
      persistent = false,
      onClose,
      action,
      style,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    
    // Get default icon based on variant
    const defaultIcon = variant && variant !== 'default' ? ToastIcons[variant] : null;
    const displayIcon = icon || defaultIcon;
    
    // Handle auto-dismiss
    useEffect(() => {
      if (!persistent && duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }, [duration, persistent]);
    
    const handleClose = () => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300); // Match transition duration
    };
    
    if (!isVisible) return null;
    
    return (
      <div
        ref={ref}
        className={cn(
          toastVariants({ variant }),
          'fixed z-50 min-w-[300px] max-w-[500px]',
          position && toastVariants({ position }),
          isExiting && 'opacity-0 translate-y-2',
          className
        )}
        role="alert"
        aria-live="polite"
        style={style}
        {...props}
      >
        {showIcon && displayIcon && (
          <span className="shrink-0 w-6 h-6">
            {displayIcon}
          </span>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-base leading-6">
            {message}
          </p>
          {description && (
            <p className="mt-1 text-sm leading-5 opacity-90">
              {description}
            </p>
          )}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            >
              {action.label}
            </button>
          )}
        </div>
        
        {onClose && (
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 w-5 h-5 ml-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            aria-label="Close notification"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

// Toast Container for managing multiple toasts
export interface ToastContainerProps {
  position?: ToastProps['position'];
  children: React.ReactNode;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ 
  position = 'top-right',
  children 
}) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };
  
  const stackDirection = position.includes('bottom') ? 'flex-col-reverse' : 'flex-col';
  
  return (
    <div
      className={cn(
        'fixed z-50 flex gap-3 pointer-events-none',
        stackDirection,
        positionClasses[position]
      )}
    >
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

// Hook for managing toasts
export interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const clearToasts = () => {
    setToasts([]);
  };
  
  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };
};

export { Toast, toastVariants };