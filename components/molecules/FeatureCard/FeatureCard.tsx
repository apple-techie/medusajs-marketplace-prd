import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import Link from 'next/link';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  image?: string;
  
  // Display options
  variant?: 'default' | 'centered' | 'horizontal' | 'minimal' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center' | 'right';
  
  // Additional content
  features?: string[];
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  
  // Styling
  iconColor?: string;
  iconBackground?: boolean;
  border?: boolean;
  shadow?: boolean;
  hover?: boolean;
  
  className?: string;
  iconClassName?: string;
  contentClassName?: string;
  
  'aria-label'?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  image,
  variant = 'default',
  size = 'md',
  align = 'left',
  features,
  badge,
  badgeVariant = 'default',
  action,
  iconColor,
  iconBackground = true,
  border = true,
  shadow = false,
  hover = true,
  className,
  iconClassName,
  contentClassName,
  'aria-label': ariaLabel,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'p-4',
      iconSize: 'md',
      titleSize: 'text-base',
      descSize: 'text-sm',
      featureSize: 'text-xs',
      gap: 'gap-3',
      iconBg: 'w-10 h-10',
    },
    md: {
      padding: 'p-6',
      iconSize: 'lg',
      titleSize: 'text-lg',
      descSize: 'text-base',
      featureSize: 'text-sm',
      gap: 'gap-4',
      iconBg: 'w-12 h-12',
    },
    lg: {
      padding: 'p-8',
      iconSize: 'xl',
      titleSize: 'text-xl',
      descSize: 'text-base',
      featureSize: 'text-base',
      gap: 'gap-5',
      iconBg: 'w-16 h-16',
    },
  };

  const sizes = sizeConfig[size];

  // Alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  // Base card classes
  const cardClasses = cn(
    'relative overflow-hidden rounded-lg',
    'bg-white dark:bg-neutral-900',
    border && 'border border-neutral-200 dark:border-neutral-800',
    shadow && 'shadow-lg',
    hover && 'transition-all duration-200 hover:shadow-xl hover:scale-[1.02]',
    sizes.padding,
    className
  );

  // Render icon or image
  const renderVisual = () => {
    if (image) {
      return (
        <img
          src={image}
          alt={title}
          className={cn(
            'w-full h-48 object-cover rounded-lg mb-4',
            variant === 'horizontal' && 'w-1/3 h-full mb-0 mr-6 flex-shrink-0'
          )}
        />
      );
    }

    if (icon) {
      const iconElement = (
        <Icon
          icon={icon}
          size={sizes.iconSize as any}
          className={cn(
            iconColor || 'text-primary-600 dark:text-primary-400',
            iconClassName
          )}
        />
      );

      if (iconBackground) {
        return (
          <div
            className={cn(
              'inline-flex items-center justify-center rounded-lg',
              'bg-primary-100 dark:bg-primary-900/20',
              sizes.iconBg,
              variant === 'horizontal' && 'flex-shrink-0',
              iconClassName
            )}
          >
            {iconElement}
          </div>
        );
      }

      return iconElement;
    }

    return null;
  };

  // Render features list
  const renderFeatures = () => {
    if (!features || features.length === 0) return null;

    return (
      <ul className={cn('space-y-2 mt-4', sizes.featureSize)}>
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Icon
              icon="check"
              size="xs"
              className="text-success-600 dark:text-success-400 mt-0.5 flex-shrink-0"
            />
            <span className="text-neutral-600 dark:text-neutral-400">
              {feature}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Render action button/link
  const renderAction = () => {
    if (!action) return null;

    const actionClasses = cn(
      'inline-flex items-center gap-2 font-medium',
      'text-primary-600 dark:text-primary-400',
      'hover:text-primary-700 dark:hover:text-primary-300',
      'transition-colors',
      sizes.featureSize
    );

    if (action.href) {
      return (
        <Link href={action.href} className={actionClasses}>
          {action.label}
          <Icon icon="arrow-right" size="xs" />
        </Link>
      );
    }

    return (
      <button onClick={action.onClick} className={actionClasses}>
        {action.label}
        <Icon icon="arrow-right" size="xs" />
      </button>
    );
  };

  // Content wrapper
  const content = (
    <div className={cn('flex-1', contentClassName)}>
      {badge && (
        <Badge variant={badgeVariant} size="sm" className="mb-3">
          {badge}
        </Badge>
      )}
      
      <h3 className={cn('font-semibold mb-2', sizes.titleSize)}>
        {title}
      </h3>
      
      <p className={cn('text-neutral-600 dark:text-neutral-400', sizes.descSize)}>
        {description}
      </p>
      
      {renderFeatures()}
      
      {action && (
        <div className="mt-4">
          {renderAction()}
        </div>
      )}
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'centered':
      return (
        <div
          className={cn(cardClasses, 'flex flex-col', alignClasses.center)}
          aria-label={ariaLabel}
        >
          {renderVisual()}
          {content}
        </div>
      );

    case 'horizontal':
      return (
        <div
          className={cn(cardClasses, 'flex items-start')}
          aria-label={ariaLabel}
        >
          {renderVisual()}
          {content}
        </div>
      );

    case 'minimal':
      return (
        <div
          className={cn(
            'relative',
            sizes.gap,
            alignClasses[align],
            className
          )}
          aria-label={ariaLabel}
        >
          {renderVisual()}
          <div className={contentClassName}>
            <h3 className={cn('font-semibold mb-1', sizes.titleSize)}>
              {title}
            </h3>
            <p className={cn('text-neutral-600 dark:text-neutral-400', sizes.descSize)}>
              {description}
            </p>
            {renderAction()}
          </div>
        </div>
      );

    case 'detailed':
      return (
        <div
          className={cn(cardClasses, 'space-y-4')}
          aria-label={ariaLabel}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {renderVisual()}
              <div>
                {badge && (
                  <Badge variant={badgeVariant} size="sm" className="mb-2">
                    {badge}
                  </Badge>
                )}
                <h3 className={cn('font-semibold', sizes.titleSize)}>
                  {title}
                </h3>
              </div>
            </div>
          </div>
          
          <p className={cn('text-neutral-600 dark:text-neutral-400', sizes.descSize)}>
            {description}
          </p>
          
          {renderFeatures()}
          
          {action && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              {renderAction()}
            </div>
          )}
        </div>
      );

    default: // 'default'
      return (
        <div
          className={cn(
            cardClasses,
            'flex flex-col',
            sizes.gap,
            alignClasses[align]
          )}
          aria-label={ariaLabel}
        >
          {renderVisual()}
          {content}
        </div>
      );
  }
};

FeatureCard.displayName = 'FeatureCard';

// Feature card grid wrapper
export interface FeatureCardGridProps {
  features: Array<Omit<FeatureCardProps, 'size'> & { id: string | number }>;
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FeatureCardGrid: React.FC<FeatureCardGridProps> = ({
  features,
  columns = 3,
  gap = 'md',
  size = 'md',
  className,
}) => {
  const columnClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div className={cn(
      'grid',
      columnClasses[columns],
      gapClasses[gap],
      className
    )}>
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          size={size}
          {...feature}
        />
      ))}
    </div>
  );
};

// Feature comparison component
export interface FeatureComparisonProps {
  title?: string;
  description?: string;
  features: Array<{
    name: string;
    basic?: boolean | string;
    pro?: boolean | string;
    enterprise?: boolean | string;
  }>;
  className?: string;
}

export const FeatureComparison: React.FC<FeatureComparisonProps> = ({
  title,
  description,
  features,
  className,
}) => {
  const renderValue = (value?: boolean | string) => {
    if (value === true) {
      return <Icon icon="check" size="sm" className="text-success-600" />;
    }
    if (value === false) {
      return <Icon icon="x" size="sm" className="text-neutral-400" />;
    }
    return <span className="text-sm">{value || '-'}</span>;
  };

  return (
    <div className={cn('overflow-x-auto', className)}>
      {(title || description) && (
        <div className="mb-6 text-center">
          {title && <h3 className="text-2xl font-bold mb-2">{title}</h3>}
          {description && (
            <p className="text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
      )}
      
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            <th className="text-left py-4 px-4 font-medium">Feature</th>
            <th className="text-center py-4 px-4 font-medium">Basic</th>
            <th className="text-center py-4 px-4 font-medium">Pro</th>
            <th className="text-center py-4 px-4 font-medium">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr
              key={index}
              className="border-b border-neutral-100 dark:border-neutral-800/50"
            >
              <td className="py-4 px-4 text-sm text-neutral-700 dark:text-neutral-300">
                {feature.name}
              </td>
              <td className="py-4 px-4 text-center">
                {renderValue(feature.basic)}
              </td>
              <td className="py-4 px-4 text-center">
                {renderValue(feature.pro)}
              </td>
              <td className="py-4 px-4 text-center">
                {renderValue(feature.enterprise)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};