import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';

export interface MetricCardProps {
  // Content
  title: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  
  // Trend/Change
  trend?: 'up' | 'down' | 'neutral';
  change?: string | number;
  changeLabel?: string;
  
  // Visual
  icon?: string;
  iconColor?: string;
  iconBackground?: boolean;
  
  // Display options
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  
  // Badge
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'success';
  };
  
  // Progress
  progress?: {
    value: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
  };
  
  // Sparkline data
  sparkline?: number[];
  sparklineColor?: string;
  
  // Loading state
  loading?: boolean;
  
  // Interactive
  href?: string;
  onClick?: () => void;
  
  // Comparison
  comparison?: {
    label: string;
    value: string | number;
    trend?: 'better' | 'worse' | 'same';
  };
  
  // Footer actions
  footerAction?: {
    label: string;
    onClick: () => void;
  };
  
  // Styling
  className?: string;
  valueClassName?: string;
  iconClassName?: string;
  
  'aria-label'?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  description,
  trend,
  change,
  changeLabel = 'from last period',
  icon,
  iconColor,
  iconBackground = true,
  variant = 'default',
  size = 'md',
  badge,
  progress,
  sparkline,
  sparklineColor = 'currentColor',
  loading = false,
  href,
  onClick,
  comparison,
  footerAction,
  className,
  valueClassName,
  iconClassName,
  'aria-label': ariaLabel,
}) => {
  const isInteractive = !!(href || onClick);

  // Size classes
  const sizeClasses = {
    sm: {
      padding: 'p-3',
      value: 'text-xl',
      title: 'text-xs',
      icon: 'sm' as const,
      iconContainer: 'w-8 h-8',
    },
    md: {
      padding: 'p-4',
      value: 'text-2xl',
      title: 'text-sm',
      icon: 'md' as const,
      iconContainer: 'w-10 h-10',
    },
    lg: {
      padding: 'p-6',
      value: 'text-3xl',
      title: 'text-base',
      icon: 'lg' as const,
      iconContainer: 'w-12 h-12',
    },
  };

  const currentSize = sizeClasses[size];

  // Trend colors
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-neutral-600 dark:text-neutral-400';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'trending-up';
    if (trend === 'down') return 'trending-down';
    return 'minus';
  };

  // Render sparkline
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;

    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = max - min || 1;
    const width = 80;
    const height = 32;
    
    const points = sparkline.map((value, index) => {
      const x = (index / (sparkline.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg
        width={width}
        height={height}
        className="flex-shrink-0"
        aria-hidden="true"
      >
        <polyline
          points={points}
          fill="none"
          stroke={sparklineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn(
        'rounded-lg border bg-card',
        currentSize.padding,
        className
      )}>
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mb-2" />
          <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-2" />
          {variant !== 'minimal' && (
            <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
          )}
        </div>
      </div>
    );
  }

  const content = (
    <>
      {/* Header with icon and badge */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          {icon && variant !== 'minimal' && (
            <div
              className={cn(
                'flex items-center justify-center rounded-lg flex-shrink-0',
                currentSize.iconContainer,
                iconBackground && 'bg-primary-100 dark:bg-primary-900/20',
                iconClassName
              )}
            >
              <Icon
                icon={icon}
                size={currentSize.icon}
                className={iconColor || 'text-primary-600 dark:text-primary-400'}
              />
            </div>
          )}
          <div>
            <h3 className={cn(
              'font-medium text-neutral-600 dark:text-neutral-400',
              currentSize.title
            )}>
              {title}
            </h3>
            {subtitle && variant === 'detailed' && (
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {badge && (
          <Badge variant={badge.variant} size="sm">
            {badge.text}
          </Badge>
        )}
      </div>

      {/* Value and trend */}
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <p className={cn(
            'font-bold',
            currentSize.value,
            valueClassName
          )}>
            {value}
          </p>
          {subtitle && variant !== 'detailed' && (
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {subtitle}
            </span>
          )}
        </div>
        
        {sparkline && variant !== 'minimal' && (
          <div className="ml-auto">
            {renderSparkline()}
          </div>
        )}
      </div>

      {/* Change indicator */}
      {change !== undefined && variant !== 'minimal' && (
        <div className={cn('flex items-center gap-1 mt-2', getTrendColor())}>
          <Icon icon={getTrendIcon()} size="xs" />
          <span className="text-sm font-medium">
            {typeof change === 'number' && change > 0 ? '+' : ''}{change}
          </span>
          {changeLabel && (
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {changeLabel}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      {description && variant === 'detailed' && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          {description}
        </p>
      )}

      {/* Progress bar */}
      {progress && variant !== 'minimal' && (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            {progress.label && (
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                {progress.label}
              </span>
            )}
            {progress.showPercentage && (
              <span className="text-xs font-medium">
                {Math.round((progress.value / (progress.max || 100)) * 100)}%
              </span>
            )}
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${(progress.value / (progress.max || 100)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Comparison */}
      {comparison && variant === 'detailed' && (
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            {comparison.label}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{comparison.value}</span>
            {comparison.trend && (
              <Icon
                icon={
                  comparison.trend === 'better' ? 'arrow-up' :
                  comparison.trend === 'worse' ? 'arrow-down' :
                  'minus'
                }
                size="xs"
                className={cn(
                  comparison.trend === 'better' && 'text-green-600 dark:text-green-400',
                  comparison.trend === 'worse' && 'text-red-600 dark:text-red-400',
                  comparison.trend === 'same' && 'text-neutral-600 dark:text-neutral-400'
                )}
              />
            )}
          </div>
        </div>
      )}

      {/* Footer action */}
      {footerAction && variant !== 'minimal' && (
        <button
          onClick={footerAction.onClick}
          className="mt-3 pt-3 border-t w-full text-left text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          {footerAction.label} →
        </button>
      )}
    </>
  );

  const cardClasses = cn(
    'rounded-lg border bg-card',
    currentSize.padding,
    isInteractive && 'cursor-pointer hover:shadow-md transition-shadow',
    variant === 'minimal' && 'border-0 shadow-sm',
    variant === 'compact' && 'space-y-1',
    className
  );

  if (href) {
    return (
      <a
        href={href}
        className={cardClasses}
        aria-label={ariaLabel || `${title}: ${value}`}
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(cardClasses, 'w-full text-left')}
        aria-label={ariaLabel || `${title}: ${value}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={cardClasses}
      aria-label={ariaLabel || `${title}: ${value}`}
    >
      {content}
    </div>
  );
};

MetricCard.displayName = 'MetricCard';