import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Skeleton variants
const skeletonVariants = cva(
  'animate-pulse',
  {
    variants: {
      variant: {
        default: 'bg-neutral-200 dark:bg-neutral-800',
        primary: 'bg-primary-100 dark:bg-primary-900/20',
        secondary: 'bg-secondary-100 dark:bg-secondary-900/20',
        light: 'bg-neutral-100 dark:bg-neutral-900',
        dark: 'bg-neutral-300 dark:bg-neutral-700',
      },
      animation: {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
        none: '',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      animation: 'pulse',
      rounded: 'md',
    },
  }
);

export interface SkeletonProps extends VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  className?: string;
  as?: 'div' | 'span' | 'p';
  'aria-label'?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  className,
  as: Component = 'div',
  'aria-label': ariaLabel = 'Loading...',
  variant,
  animation,
  rounded,
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <Component
      className={cn(
        skeletonVariants({ variant, animation, rounded }),
        className
      )}
      style={style}
      aria-label={ariaLabel}
      aria-busy="true"
      role="status"
    />
  );
};

Skeleton.displayName = 'Skeleton';

// Text skeleton with multiple lines
export interface TextSkeletonProps extends Omit<SkeletonProps, 'height'> {
  lines?: number;
  lineHeight?: number;
  spacing?: number;
  lastLineWidth?: string | number;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  lineHeight = 20,
  spacing = 8,
  lastLineWidth = '80%',
  width = '100%',
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : width}
          height={lineHeight}
          {...props}
        />
      ))}
    </div>
  );
};

// Avatar skeleton
export interface AvatarSkeletonProps extends Omit<SkeletonProps, 'width' | 'height'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
  size = 'md',
  className,
  ...props
}) => {
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  return (
    <Skeleton
      width={sizeMap[size]}
      height={sizeMap[size]}
      rounded="full"
      className={className}
      {...props}
    />
  );
};

// Button skeleton
export interface ButtonSkeletonProps extends Omit<SkeletonProps, 'height'> {
  size?: 'sm' | 'md' | 'lg';
}

export const ButtonSkeleton: React.FC<ButtonSkeletonProps> = ({
  size = 'md',
  width,
  className,
  ...props
}) => {
  const sizeMap = {
    sm: { height: 32, defaultWidth: 80 },
    md: { height: 40, defaultWidth: 100 },
    lg: { height: 48, defaultWidth: 120 },
  };

  return (
    <Skeleton
      width={width || sizeMap[size].defaultWidth}
      height={sizeMap[size].height}
      className={className}
      {...props}
    />
  );
};

// Card skeleton
export interface CardSkeletonProps extends Omit<SkeletonProps, 'width' | 'height'> {
  showImage?: boolean;
  imageHeight?: number;
  showTitle?: boolean;
  showDescription?: boolean;
  descriptionLines?: number;
  showActions?: boolean;
  padding?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showImage = true,
  imageHeight = 200,
  showTitle = true,
  showDescription = true,
  descriptionLines = 3,
  showActions = true,
  padding = true,
  className,
  ...props
}) => {
  return (
    <div className={cn('overflow-hidden', className)}>
      {showImage && (
        <Skeleton
          width="100%"
          height={imageHeight}
          rounded="none"
          {...props}
        />
      )}
      
      <div className={padding ? 'p-4 space-y-3' : 'space-y-3'}>
        {showTitle && (
          <Skeleton
            width="70%"
            height={24}
            {...props}
          />
        )}
        
        {showDescription && (
          <TextSkeleton
            lines={descriptionLines}
            lineHeight={16}
            spacing={6}
            {...props}
          />
        )}
        
        {showActions && (
          <div className="flex gap-2 pt-2">
            <ButtonSkeleton size="sm" {...props} />
            <ButtonSkeleton size="sm" width={60} {...props} />
          </div>
        )}
      </div>
    </div>
  );
};

// Table skeleton
export interface TableSkeletonProps extends Omit<SkeletonProps, 'width' | 'height'> {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  columnWidths?: (string | number)[];
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  columnWidths,
  className,
  ...props
}) => {
  const getColumnWidth = (index: number) => {
    if (columnWidths && columnWidths[index]) {
      return columnWidths[index];
    }
    return '100%';
  };

  return (
    <div className={cn('w-full', className)}>
      {showHeader && (
        <div className="flex gap-4 pb-4 border-b">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={`header-${index}`}
              width={getColumnWidth(index)}
              height={20}
              {...props}
            />
          ))}
        </div>
      )}
      
      <div className="space-y-3 pt-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                width={getColumnWidth(colIndex)}
                height={16}
                {...props}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Form skeleton
export interface FormSkeletonProps extends Omit<SkeletonProps, 'width' | 'height'> {
  fields?: number;
  showLabels?: boolean;
  showButton?: boolean;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 3,
  showLabels = true,
  showButton = true,
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          {showLabels && (
            <Skeleton
              width="30%"
              height={16}
              {...props}
            />
          )}
          <Skeleton
            width="100%"
            height={40}
            {...props}
          />
        </div>
      ))}
      
      {showButton && (
        <ButtonSkeleton
          size="lg"
          width="100%"
          className="mt-6"
          {...props}
        />
      )}
    </div>
  );
};

// Product skeleton
export interface ProductSkeletonProps extends Omit<SkeletonProps, 'width' | 'height'> {
  showBadge?: boolean;
  showRating?: boolean;
  showPrice?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({
  showBadge = true,
  showRating = true,
  showPrice = true,
  orientation = 'vertical',
  className,
  ...props
}) => {
  if (orientation === 'horizontal') {
    return (
      <div className={cn('flex gap-4', className)}>
        <Skeleton
          width={120}
          height={120}
          rounded="lg"
          {...props}
        />
        
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={20} {...props} />
          <TextSkeleton lines={2} lineHeight={16} {...props} />
          
          {showRating && (
            <Skeleton width={100} height={16} {...props} />
          )}
          
          {showPrice && (
            <div className="flex items-center gap-2 pt-1">
              <Skeleton width={60} height={24} {...props} />
              <Skeleton width={40} height={16} {...props} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {showBadge && (
        <Skeleton
          width={60}
          height={24}
          className="absolute top-2 left-2 z-10"
          {...props}
        />
      )}
      
      <Skeleton
        width="100%"
        height={200}
        rounded="lg"
        className="mb-3"
        {...props}
      />
      
      <div className="space-y-2">
        <Skeleton width="80%" height={20} {...props} />
        
        {showRating && (
          <Skeleton width={100} height={16} {...props} />
        )}
        
        {showPrice && (
          <div className="flex items-center gap-2 pt-1">
            <Skeleton width={60} height={24} {...props} />
            <Skeleton width={40} height={16} {...props} />
          </div>
        )}
      </div>
    </div>
  );
};

// List item skeleton
export interface ListItemSkeletonProps extends Omit<SkeletonProps, 'width' | 'height'> {
  showAvatar?: boolean;
  showSecondaryText?: boolean;
  showAction?: boolean;
}

export const ListItemSkeleton: React.FC<ListItemSkeletonProps> = ({
  showAvatar = true,
  showSecondaryText = true,
  showAction = false,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {showAvatar && (
        <AvatarSkeleton size="md" {...props} />
      )}
      
      <div className="flex-1 space-y-1">
        <Skeleton width="60%" height={16} {...props} />
        {showSecondaryText && (
          <Skeleton width="40%" height={14} {...props} />
        )}
      </div>
      
      {showAction && (
        <Skeleton width={32} height={32} rounded="md" {...props} />
      )}
    </div>
  );
};