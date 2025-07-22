import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Card } from '../../atoms/Card/Card';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import { Progress } from '../../atoms/Progress/Progress';
import { Button } from '../../atoms/Button/Button';

const tierProgressVariants = cva(
  'relative',
  {
    variants: {
      variant: {
        default: '',
        compact: 'p-4',
        detailed: 'p-6',
      },
      status: {
        active: '',
        achieved: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800',
        locked: 'opacity-60',
      },
    },
    defaultVariants: {
      variant: 'default',
      status: 'active',
    },
  }
);

export interface Tier {
  id: string;
  name: string;
  minRevenue: number;
  maxRevenue?: number;
  commissionRate: number;
  benefits?: string[];
  icon?: string;
  color?: string;
}

export interface TierProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tierProgressVariants> {
  currentTier: Tier;
  nextTier?: Tier;
  tiers?: Tier[];
  currentRevenue: number;
  period?: string;
  showAllTiers?: boolean;
  showBenefits?: boolean;
  showProjection?: boolean;
  projectedRevenue?: number;
  onTierClick?: (tier: Tier) => void;
  onLearnMore?: () => void;
  loading?: boolean;
  currency?: string;
  className?: string;
}

export const TierProgress: React.FC<TierProgressProps> = ({
  currentTier,
  nextTier,
  tiers = [],
  currentRevenue,
  period = 'This month',
  showAllTiers = false,
  showBenefits = true,
  showProjection = false,
  projectedRevenue,
  onTierClick,
  onLearnMore,
  loading = false,
  currency = '$',
  variant,
  status,
  className,
  ...props
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === '$' ? 'USD' : 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const calculateProgress = () => {
    if (!nextTier || !nextTier.minRevenue) return 100;
    
    const currentTierMin = currentTier.minRevenue || 0;
    const nextTierMin = nextTier.minRevenue;
    const range = nextTierMin - currentTierMin;
    const progress = currentRevenue - currentTierMin;
    
    return Math.min(100, Math.max(0, (progress / range) * 100));
  };

  const getRevenueToNextTier = () => {
    if (!nextTier || !nextTier.minRevenue) return 0;
    return Math.max(0, nextTier.minRevenue - currentRevenue);
  };

  const getTierStatus = (tier: Tier) => {
    if (tier.id === currentTier.id) return 'current';
    if (tier.minRevenue <= currentRevenue) return 'achieved';
    return 'locked';
  };

  const getTierIcon = (tier: Tier) => {
    return tier.icon || 'star';
  };

  const getTierColor = (tier: Tier, tierStatus: string) => {
    if (tierStatus === 'locked') return 'text-neutral-400';
    if (tierStatus === 'achieved') return 'text-green-600 dark:text-green-400';
    return tier.color || 'text-primary-600 dark:text-primary-400';
  };

  if (loading) {
    return (
      <Card className={cn(tierProgressVariants({ variant, status }), className)} {...props}>
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-4" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-2" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-6" />
          <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
          </div>
        </div>
      </Card>
    );
  }

  const progress = calculateProgress();
  const revenueToNext = getRevenueToNextTier();

  // Detailed variant
  if (variant === 'detailed') {
    return (
      <Card className={cn(tierProgressVariants({ variant, status }), className)} {...props}>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Commission Tier Progress</h3>
              {period && (
                <Badge variant="secondary" size="sm">
                  {period}
                </Badge>
              )}
            </div>
            
            {/* Current tier info */}
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                'bg-primary-100 dark:bg-primary-900/30'
              )}>
                <Icon 
                  icon={getTierIcon(currentTier)} 
                  className="w-5 h-5 text-primary-600 dark:text-primary-400" 
                />
              </div>
              <div>
                <p className="font-medium">{currentTier.name}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {currentTier.commissionRate}% commission rate
                </p>
              </div>
            </div>

            {/* Revenue info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Current Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(currentRevenue)}</p>
              </div>
              {showProjection && projectedRevenue && (
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Projected</p>
                  <p className="text-xl font-bold">{formatCurrency(projectedRevenue)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Progress to {nextTier.name}
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {formatCurrency(revenueToNext)} to go
                </span>
              </div>
              <Progress value={progress} className="h-3 mb-2" />
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Reach {formatCurrency(nextTier.minRevenue)} to unlock {nextTier.commissionRate}% commission
              </p>
            </div>
          )}

          {/* Benefits */}
          {showBenefits && currentTier.benefits && currentTier.benefits.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Current Benefits</h4>
              <ul className="space-y-1">
                {currentTier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Icon icon="check" className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* All tiers */}
          {showAllTiers && tiers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">All Tiers</h4>
              <div className="space-y-2">
                {tiers.map((tier) => {
                  const tierStatus = getTierStatus(tier);
                  const isClickable = onTierClick && tierStatus !== 'locked';
                  
                  return (
                    <div
                      key={tier.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border',
                        tierStatus === 'current' && 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
                        tierStatus === 'achieved' && 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800',
                        tierStatus === 'locked' && 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700',
                        isClickable && 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800',
                        tierStatus === 'locked' && 'opacity-60'
                      )}
                      onClick={() => isClickable && onTierClick(tier)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon 
                          icon={getTierIcon(tier)} 
                          className={cn('w-5 h-5', getTierColor(tier, tierStatus))}
                        />
                        <div>
                          <p className="font-medium text-sm">{tier.name}</p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {tier.minRevenue ? `From ${formatCurrency(tier.minRevenue)}` : 'Base tier'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{tier.commissionRate}%</p>
                        {tierStatus === 'current' && (
                          <Badge variant="default" size="sm">Current</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Learn more */}
          {onLearnMore && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLearnMore}
              className="w-full"
            >
              Learn more about tiers
              <Icon icon="arrow-right" className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Card className={cn(tierProgressVariants({ variant, status }), className)} {...props}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon 
              icon={getTierIcon(currentTier)} 
              className="w-5 h-5 text-primary-600 dark:text-primary-400" 
            />
            <span className="font-medium">{currentTier.name}</span>
            <Badge variant="secondary" size="sm">
              {currentTier.commissionRate}%
            </Badge>
          </div>
          {period && (
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {period}
            </span>
          )}
        </div>
        
        {nextTier && (
          <>
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatCurrency(revenueToNext)} to {nextTier.name} ({nextTier.commissionRate}%)
            </p>
          </>
        )}
      </Card>
    );
  }

  // Default variant
  return (
    <div className={cn(tierProgressVariants({ variant, status }), 'space-y-4', className)} {...props}>
      {/* Current status */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {period}
          </h3>
          <p className="text-2xl font-bold">{formatCurrency(currentRevenue)}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <Icon 
              icon={getTierIcon(currentTier)} 
              className="w-4 h-4 text-primary-600 dark:text-primary-400" 
            />
            <span className="font-medium">{currentTier.name}</span>
          </div>
          <Badge variant="secondary">
            {currentTier.commissionRate}% commission
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      {nextTier && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Next: {nextTier.name}
            </span>
            <span className="text-sm font-medium">
              {formatCurrency(revenueToNext)} to go
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Projection */}
      {showProjection && projectedRevenue && projectedRevenue > currentRevenue && (
        <div className="flex items-center gap-2 text-sm">
          <Icon icon="trending-up" className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-neutral-600 dark:text-neutral-400">
            Projected: <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {formatCurrency(projectedRevenue)}
            </span>
            {projectedRevenue >= (nextTier?.minRevenue || 0) && nextTier && (
              <span className="text-green-600 dark:text-green-400 ml-1">
                (Reaches {nextTier.name})
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

TierProgress.displayName = 'TierProgress';