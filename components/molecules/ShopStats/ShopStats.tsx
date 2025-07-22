import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';

export interface ShopStat {
  label: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export interface ShopStatsProps {
  stats: ShopStat[];
  variant?: 'default' | 'compact' | 'detailed';
  columns?: 2 | 3 | 4;
  loading?: boolean;
  className?: string;
}

export const ShopStats: React.FC<ShopStatsProps> = ({
  stats,
  variant = 'default',
  columns = 3,
  loading = false,
  className,
}) => {
  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={cn('grid gap-4', gridCols[columns], className)}>
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20 mb-2" />
            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap gap-6', className)}>
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-2">
            {stat.icon && (
              <Icon icon={stat.icon} className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            )}
            <div className="flex items-baseline gap-1">
              <span className="font-semibold">{formatValue(stat.value)}</span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('grid gap-4', gridCols[columns], className)}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 space-y-2"
          >
            {stat.icon && (
              <Icon icon={stat.icon} className="w-5 h-5 text-primary-500 mb-2" />
            )}
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {stat.label}
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">
                {formatValue(stat.value)}
              </span>
              {stat.trend && (
                <div className={cn(
                  'flex items-center gap-1 text-sm',
                  stat.trend.direction === 'up' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                )}>
                  <Icon 
                    icon={stat.trend.direction === 'up' ? 'trending-up' : 'trending-down'} 
                    className="w-4 h-4" 
                  />
                  <span>{Math.abs(stat.trend.value)}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('grid gap-6 text-center', gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <div key={index}>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
            {stat.label}
          </p>
          <p className="text-2xl font-bold">
            {formatValue(stat.value)}
          </p>
          {stat.trend && (
            <div className={cn(
              'flex items-center justify-center gap-1 text-sm mt-1',
              stat.trend.direction === 'up' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            )}>
              <Icon 
                icon={stat.trend.direction === 'up' ? 'trending-up' : 'trending-down'} 
                className="w-3 h-3" 
              />
              <span>{Math.abs(stat.trend.value)}%</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

ShopStats.displayName = 'ShopStats';