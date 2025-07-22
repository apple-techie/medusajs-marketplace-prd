import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Card } from '../../atoms/Card/Card';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { Progress } from '../../atoms/Progress/Progress';

const loyaltyPointsCardVariants = cva(
  'relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20',
        premium: 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/20',
        vip: 'bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-800/20',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface LoyaltyPointsCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loyaltyPointsCardVariants> {
  points: number;
  tier?: string;
  tierIcon?: string;
  pointsToNextTier?: number;
  nextTier?: string;
  expiringPoints?: {
    amount: number;
    date: string | Date;
  };
  history?: Array<{
    id: string;
    description: string;
    points: number;
    date: string | Date;
    type: 'earned' | 'redeemed';
  }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
    icon?: string;
  }>;
  showProgress?: boolean;
  showHistory?: boolean;
  historyLimit?: number;
  loading?: boolean;
  currency?: string;
  pointsLabel?: string;
  className?: string;
}

export const LoyaltyPointsCard: React.FC<LoyaltyPointsCardProps> = ({
  points,
  tier,
  tierIcon = 'star',
  pointsToNextTier,
  nextTier,
  expiringPoints,
  history = [],
  actions = [],
  showProgress = true,
  showHistory = true,
  historyLimit = 3,
  loading = false,
  currency,
  pointsLabel = 'points',
  variant,
  size,
  className,
  ...props
}) => {
  const formatPoints = (pts: number) => {
    return new Intl.NumberFormat('en-US').format(pts);
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(dateObj);
  };

  const calculateProgress = () => {
    if (!pointsToNextTier) return 0;
    const currentTierPoints = points;
    const totalNeeded = currentTierPoints + pointsToNextTier;
    return (currentTierPoints / totalNeeded) * 100;
  };

  const getPointValue = () => {
    if (!currency) return null;
    // Assuming 100 points = $1 as default conversion
    return (points / 100).toFixed(2);
  };

  const recentHistory = showHistory ? history.slice(0, historyLimit) : [];

  if (loading) {
    return (
      <Card className={cn(loyaltyPointsCardVariants({ variant, size }), className)} {...props}>
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-4" />
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-6" />
          {showProgress && (
            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded mb-4" />
          )}
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(loyaltyPointsCardVariants({ variant, size }), className)} {...props}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 opacity-10">
        <Icon icon={tierIcon} className="w-full h-full" />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            {tier && (
              <div className="flex items-center gap-2 mb-2">
                <Icon icon={tierIcon} className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {tier}
                </span>
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {formatPoints(points)}
              </span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {pointsLabel}
              </span>
            </div>
            {currency && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                ≈ {currency}{getPointValue()} value
              </p>
            )}
          </div>

          {expiringPoints && (
            <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20">
              <Icon icon="alert-circle" className="w-3 h-3 mr-1" />
              {formatPoints(expiringPoints.amount)} expiring {formatDate(expiringPoints.date)}
            </Badge>
          )}
        </div>

        {/* Progress to next tier */}
        {showProgress && pointsToNextTier && nextTier && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Progress to {nextTier}
              </span>
              <span className="text-sm font-medium">
                {formatPoints(pointsToNextTier)} {pointsLabel} to go
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        )}

        {/* Recent history */}
        {showHistory && recentHistory.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Recent Activity
            </h4>
            <div className="space-y-2">
              {recentHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={item.type === 'earned' ? 'plus-circle' : 'minus-circle'}
                      className={cn(
                        'w-4 h-4',
                        item.type === 'earned'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      item.type === 'earned'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {item.type === 'earned' ? '+' : '-'}{formatPoints(item.points)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.onClick}
              >
                {action.icon && (
                  <Icon icon={action.icon} className="w-4 h-4 mr-1.5" />
                )}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

LoyaltyPointsCard.displayName = 'LoyaltyPointsCard';