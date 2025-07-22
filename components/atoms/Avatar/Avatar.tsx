import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define avatar variants
const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden rounded-full shrink-0 font-medium',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
      },
      variant: {
        primary: 'bg-primary-100 text-primary-700',
        secondary: 'bg-neutral-100 text-neutral-700',
        success: 'bg-success-100 text-success-700',
        warning: 'bg-warning-100 text-warning-700',
        danger: 'bg-danger-100 text-danger-700',
        neutral: 'bg-neutral-200 text-neutral-900',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'neutral',
    },
  }
);

// Status indicator variants
const statusVariants = cva(
  'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
  {
    variants: {
      size: {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-4 w-4',
      },
      status: {
        online: 'bg-success-500',
        offline: 'bg-neutral-400',
        busy: 'bg-danger-500',
        away: 'bg-warning-500',
      },
    },
    defaultVariants: {
      size: 'md',
      status: 'offline',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  // Content
  src?: string;
  alt?: string;
  initials?: string;
  icon?: React.ReactNode;
  
  // Status
  status?: 'online' | 'offline' | 'busy' | 'away';
  showStatus?: boolean;
  
  // Fallback
  fallback?: React.ReactNode;
  
  // Loading
  loading?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      size,
      variant,
      src,
      alt,
      initials,
      icon,
      status,
      showStatus = false,
      fallback,
      loading = false,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoading, setImageLoading] = React.useState(true);
    
    // Get initials from alt text if not provided
    const getInitials = () => {
      if (initials) return initials;
      if (!alt) return '?';
      
      const words = alt.trim().split(' ');
      if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
      }
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };
    
    // Handle image load
    const handleImageLoad = () => {
      setImageLoading(false);
    };
    
    // Handle image error
    const handleImageError = () => {
      setImageError(true);
      setImageLoading(false);
    };
    
    // Determine what to render
    const renderContent = () => {
      // Loading state
      if (loading || (src && imageLoading && !imageError)) {
        return (
          <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
        );
      }
      
      // Image avatar
      if (src && !imageError) {
        return (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="h-full w-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        );
      }
      
      // Icon avatar
      if (icon) {
        return <span className="relative z-10">{icon}</span>;
      }
      
      // Custom fallback
      if (fallback) {
        return <span className="relative z-10">{fallback}</span>;
      }
      
      // Initials avatar
      return (
        <span className="relative z-10 select-none">
          {getInitials()}
        </span>
      );
    };
    
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, variant, className }))}
        {...props}
      >
        {renderContent()}
        
        {showStatus && status && (
          <span
            className={cn(statusVariants({ size, status }))}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar Group component for displaying multiple avatars
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  size?: VariantProps<typeof avatarVariants>['size'];
  spacing?: 'tight' | 'normal' | 'loose';
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max = 3, size = 'md', spacing = 'normal', ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const visibleChildren = childrenArray.slice(0, max);
    const remainingCount = childrenArray.length - max;
    
    const spacingClasses = {
      tight: '-space-x-2',
      normal: '-space-x-3',
      loose: '-space-x-4',
    };
    
    return (
      <div
        ref={ref}
        className={cn('flex', spacingClasses[spacing], className)}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <div
            key={index}
            className="relative inline-block ring-2 ring-white rounded-full"
            style={{ zIndex: max - index }}
          >
            {React.isValidElement(child) && child.type === Avatar
              ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
              : child}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div
            className="relative inline-block ring-2 ring-white rounded-full"
            style={{ zIndex: 0 }}
          >
            <Avatar
              size={size}
              variant="secondary"
              initials={`+${remainingCount}`}
              className="cursor-pointer"
              title={`${remainingCount} more`}
            />
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, avatarVariants };