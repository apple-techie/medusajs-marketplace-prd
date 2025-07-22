import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';

export interface CategoryCardProps {
  title: string;
  description?: string;
  image?: string;
  icon?: string;
  href: string;
  
  // Display options
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  layout?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  
  // Content
  productCount?: number;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  subcategories?: string[];
  
  // Styling
  imageAspectRatio?: 'square' | '4:3' | '16:9' | '3:2';
  overlay?: boolean;
  overlayGradient?: boolean;
  hoverEffect?: 'none' | 'lift' | 'zoom' | 'darken';
  
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  
  // Actions
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  'aria-label'?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  image,
  icon,
  href,
  variant = 'default',
  layout = 'vertical',
  size = 'md',
  productCount,
  badge,
  badgeVariant = 'default',
  subcategories,
  imageAspectRatio = 'square',
  overlay = false,
  overlayGradient = true,
  hoverEffect = 'lift',
  className,
  imageClassName,
  contentClassName,
  onClick,
  'aria-label': ariaLabel,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'p-3',
      iconSize: 'sm',
      titleSize: 'text-sm',
      descSize: 'text-xs',
      imageHeight: 'h-32',
      gap: 'gap-2',
    },
    md: {
      padding: 'p-4',
      iconSize: 'md',
      titleSize: 'text-base',
      descSize: 'text-sm',
      imageHeight: 'h-48',
      gap: 'gap-3',
    },
    lg: {
      padding: 'p-6',
      iconSize: 'lg',
      titleSize: 'text-lg',
      descSize: 'text-base',
      imageHeight: 'h-64',
      gap: 'gap-4',
    },
  };

  const sizes = sizeConfig[size];

  // Aspect ratio classes
  const aspectRatioClasses = {
    'square': 'aspect-square',
    '4:3': 'aspect-4/3',
    '16:9': 'aspect-video',
    '3:2': 'aspect-3/2',
  };

  // Hover effect classes
  const hoverEffectClasses = {
    none: '',
    lift: 'transition-transform hover:-translate-y-1',
    zoom: 'group',
    darken: 'group',
  };

  // Base card classes
  const cardClasses = cn(
    'relative block overflow-hidden rounded-lg',
    'bg-white dark:bg-neutral-900',
    'border border-neutral-200 dark:border-neutral-800',
    hoverEffectClasses[hoverEffect],
    'transition-all duration-200',
    'hover:shadow-lg',
    className
  );

  // Render image with overlay
  const renderImage = () => {
    if (!image) return null;

    return (
      <div className={cn(
        'relative overflow-hidden',
        layout === 'vertical' ? aspectRatioClasses[imageAspectRatio] : sizes.imageHeight,
        layout === 'horizontal' && 'w-1/3 flex-shrink-0',
        imageClassName
      )}>
        <img
          src={image}
          alt={title}
          className={cn(
            'h-full w-full object-cover',
            hoverEffect === 'zoom' && 'transition-transform duration-300 group-hover:scale-110',
            hoverEffect === 'darken' && 'transition-opacity duration-200 group-hover:opacity-80'
          )}
        />
        
        {overlay && (
          <div className={cn(
            'absolute inset-0',
            overlayGradient
              ? 'bg-gradient-to-t from-black/60 via-black/20 to-transparent'
              : 'bg-black/40'
          )} />
        )}
        
        {badge && (
          <div className="absolute top-2 right-2">
            <Badge variant={badgeVariant} size="sm">
              {badge}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  // Render content based on variant
  const renderContent = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className={cn(sizes.padding, contentClassName)}>
            <h3 className={cn('font-medium', sizes.titleSize)}>{title}</h3>
            {productCount !== undefined && (
              <p className={cn('text-neutral-500 dark:text-neutral-400 mt-1', sizes.descSize)}>
                {productCount} products
              </p>
            )}
          </div>
        );

      case 'compact':
        return (
          <div className={cn('p-3 flex items-center', sizes.gap, contentClassName)}>
            {icon && (
              <Icon 
                icon={icon} 
                size={sizes.iconSize as any}
                className="text-primary-600 dark:text-primary-400 flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <h3 className={cn('font-medium truncate', sizes.titleSize)}>{title}</h3>
              {productCount !== undefined && (
                <p className={cn('text-neutral-500 dark:text-neutral-400', sizes.descSize)}>
                  {productCount} items
                </p>
              )}
            </div>
          </div>
        );

      case 'featured':
        return (
          <div className={cn(sizes.padding, 'space-y-3', contentClassName)}>
            {icon && !image && (
              <Icon 
                icon={icon} 
                size="lg"
                className="text-primary-600 dark:text-primary-400 mb-2"
              />
            )}
            <div>
              <h3 className={cn('font-semibold', sizes.titleSize)}>{title}</h3>
              {description && (
                <p className={cn('text-neutral-600 dark:text-neutral-400 mt-1', sizes.descSize)}>
                  {description}
                </p>
              )}
            </div>
            
            {subcategories && subcategories.length > 0 && (
              <div className="space-y-1">
                {subcategories.slice(0, 3).map((sub, index) => (
                  <div key={index} className={cn('text-neutral-500 dark:text-neutral-400', sizes.descSize)}>
                    {sub}
                  </div>
                ))}
                {subcategories.length > 3 && (
                  <div className={cn('text-primary-600 dark:text-primary-400 font-medium', sizes.descSize)}>
                    +{subcategories.length - 3} more
                  </div>
                )}
              </div>
            )}
            
            {productCount !== undefined && (
              <div className={cn('text-neutral-500 dark:text-neutral-400 pt-2 border-t', sizes.descSize)}>
                {productCount} products
              </div>
            )}
          </div>
        );

      default: // 'default'
        return (
          <div className={cn(sizes.padding, contentClassName)}>
            {icon && !image && (
              <Icon 
                icon={icon} 
                size={sizes.iconSize as any}
                className="text-primary-600 dark:text-primary-400 mb-3"
              />
            )}
            <h3 className={cn('font-medium', sizes.titleSize)}>{title}</h3>
            {description && (
              <p className={cn('text-neutral-600 dark:text-neutral-400 mt-1', sizes.descSize)}>
                {description}
              </p>
            )}
            {productCount !== undefined && (
              <p className={cn('text-neutral-500 dark:text-neutral-400 mt-2', sizes.descSize)}>
                {productCount} products
              </p>
            )}
          </div>
        );
    }
  };

  // Render overlay content (for image overlay variant)
  if (overlay && image && variant !== 'compact') {
    return (
      <Link
        href={href}
        className={cardClasses}
        onClick={onClick}
        aria-label={ariaLabel || `Browse ${title} category`}
      >
        <div className="relative h-full">
          {renderImage()}
          <div className={cn(
            'absolute inset-0 flex flex-col justify-end',
            sizes.padding,
            contentClassName
          )}>
            <div className="text-white">
              <h3 className={cn('font-semibold mb-1', sizes.titleSize)}>{title}</h3>
              {description && (
                <p className={cn('opacity-90', sizes.descSize)}>{description}</p>
              )}
              {productCount !== undefined && (
                <p className={cn('opacity-75 mt-2', sizes.descSize)}>
                  {productCount} products
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Horizontal layout
  if (layout === 'horizontal') {
    return (
      <Link
        href={href}
        className={cardClasses}
        onClick={onClick}
        aria-label={ariaLabel || `Browse ${title} category`}
      >
        <div className="flex">
          {renderImage()}
          {renderContent()}
        </div>
      </Link>
    );
  }

  // Vertical layout (default)
  return (
    <Link
      href={href}
      className={cardClasses}
      onClick={onClick}
      aria-label={ariaLabel || `Browse ${title} category`}
    >
      {renderImage()}
      {renderContent()}
    </Link>
  );
};

CategoryCard.displayName = 'CategoryCard';

// Grid wrapper component for category cards
export interface CategoryCardGridProps {
  categories: Array<Omit<CategoryCardProps, 'size'> & { id: string | number }>;
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CategoryCardGrid: React.FC<CategoryCardGridProps> = ({
  categories,
  columns = 4,
  gap = 'md',
  size = 'md',
  className,
}) => {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={cn(
      'grid',
      columnClasses[columns],
      gapClasses[gap],
      className
    )}>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          size={size}
          {...category}
        />
      ))}
    </div>
  );
};