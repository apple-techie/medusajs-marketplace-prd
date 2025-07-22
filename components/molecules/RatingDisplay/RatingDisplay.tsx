import React from 'react';
import { cn } from '@/lib/utils';
import { StarRating } from '../../atoms/StarRating/StarRating';
import { ProgressBar } from '../../atoms/ProgressBar/ProgressBar';

export interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  reviewCount?: number;
  
  // Display options
  variant?: 'default' | 'compact' | 'detailed' | 'inline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showAverage?: boolean;
  showReviewCount?: boolean;
  showStars?: boolean;
  
  // Rating distribution
  distribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  showDistribution?: boolean;
  
  // Actions
  onReviewClick?: () => void;
  reviewLinkText?: string;
  
  // Styling
  className?: string;
  ratingClassName?: string;
  reviewCountClassName?: string;
  distributionClassName?: string;
  
  'aria-label'?: string;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  maxRating = 5,
  reviewCount = 0,
  variant = 'default',
  size = 'md',
  showAverage = true,
  showReviewCount = true,
  showStars = true,
  distribution,
  showDistribution = false,
  onReviewClick,
  reviewLinkText = 'reviews',
  className,
  ratingClassName,
  reviewCountClassName,
  distributionClassName,
  'aria-label': ariaLabel,
}) => {
  // Size mappings
  const sizeMap = {
    xs: {
      stars: 'xs',
      text: 'text-xs',
      gap: 'gap-1',
    },
    sm: {
      stars: 'sm',
      text: 'text-sm',
      gap: 'gap-1.5',
    },
    md: {
      stars: 'md',
      text: 'text-base',
      gap: 'gap-2',
    },
    lg: {
      stars: 'lg',
      text: 'text-lg',
      gap: 'gap-3',
    },
  } as const;

  const sizes = sizeMap[size];

  // Calculate total reviews from distribution
  const totalReviews = distribution
    ? Object.values(distribution).reduce((sum, count) => sum + count, 0)
    : reviewCount;

  // Format review count
  const formatReviewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Render compact variant
  if (variant === 'compact') {
    return (
      <div
        className={cn('flex items-center', sizes.gap, className)}
        aria-label={ariaLabel || `${rating} out of ${maxRating} stars`}
      >
        <span className={cn('text-warning-500', sizes.text)}>★</span>
        <span className={cn('font-medium', sizes.text, ratingClassName)}>
          {rating.toFixed(1)}
        </span>
        {showReviewCount && totalReviews > 0 && (
          <>
            <span className={cn('text-neutral-400', sizes.text)}>•</span>
            <span className={cn('text-neutral-600 dark:text-neutral-400', sizes.text, reviewCountClassName)}>
              {formatReviewCount(totalReviews)}
            </span>
          </>
        )}
      </div>
    );
  }

  // Render inline variant
  if (variant === 'inline') {
    return (
      <div
        className={cn('inline-flex items-center', sizes.gap, className)}
        aria-label={ariaLabel || `${rating} out of ${maxRating} stars with ${totalReviews} reviews`}
      >
        {showStars && (
          <StarRating
            rating={rating}
            maxRating={maxRating}
            size={sizes.stars as any}
            readOnly
          />
        )}
        {showAverage && (
          <span className={cn('font-medium', sizes.text, ratingClassName)}>
            {rating.toFixed(1)}
          </span>
        )}
        {showReviewCount && totalReviews > 0 && (
          <button
            onClick={onReviewClick}
            className={cn(
              'text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors',
              sizes.text,
              reviewCountClassName
            )}
            disabled={!onReviewClick}
          >
            ({formatReviewCount(totalReviews)} {reviewLinkText})
          </button>
        )}
      </div>
    );
  }

  // Render detailed variant
  if (variant === 'detailed' && showDistribution && distribution) {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Summary */}
        <div className="flex items-start gap-6">
          <div className="text-center">
            <div className={cn('text-4xl font-bold mb-1', ratingClassName)}>
              {rating.toFixed(1)}
            </div>
            <StarRating
              rating={rating}
              maxRating={maxRating}
              size="md"
              readOnly
            />
            {showReviewCount && (
              <div className={cn('text-neutral-600 dark:text-neutral-400 mt-1', sizes.text, reviewCountClassName)}>
                {totalReviews.toLocaleString()} {reviewLinkText}
              </div>
            )}
          </div>

          {/* Distribution */}
          <div className={cn('flex-1 space-y-2', distributionClassName)}>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars as keyof typeof distribution] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={stars} className="flex items-center gap-2">
                  <button
                    onClick={onReviewClick}
                    className="flex items-center gap-1 text-sm hover:text-primary-600 transition-colors"
                    disabled={!onReviewClick}
                  >
                    <span>{stars}</span>
                    <span className="text-warning-500">★</span>
                  </button>
                  <div className="flex-1">
                    <ProgressBar
                      value={percentage}
                      size="sm"
                      variant="warning"
                      showValue={false}
                    />
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn('flex flex-col', sizes.gap, className)}
      aria-label={ariaLabel || `${rating} out of ${maxRating} stars with ${totalReviews} reviews`}
    >
      <div className={cn('flex items-center', sizes.gap)}>
        {showStars && (
          <StarRating
            rating={rating}
            maxRating={maxRating}
            size={sizes.stars as any}
            readOnly
          />
        )}
        {showAverage && (
          <span className={cn('font-medium', sizes.text, ratingClassName)}>
            {rating.toFixed(1)}
          </span>
        )}
      </div>
      
      {showReviewCount && totalReviews > 0 && (
        <button
          onClick={onReviewClick}
          className={cn(
            'text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-left',
            sizes.text,
            reviewCountClassName
          )}
          disabled={!onReviewClick}
        >
          {totalReviews.toLocaleString()} {reviewLinkText}
        </button>
      )}
    </div>
  );
};

RatingDisplay.displayName = 'RatingDisplay';

// Summary rating display for multiple ratings
export interface RatingSummaryProps {
  ratings: {
    label: string;
    rating: number;
    maxRating?: number;
  }[];
  overallRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showBars?: boolean;
  className?: string;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  ratings,
  overallRating,
  size = 'md',
  showBars = true,
  className,
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn('space-y-3', className)}>
      {overallRating !== undefined && (
        <div className="mb-4">
          <div className="text-2xl font-bold mb-1">{overallRating.toFixed(1)}</div>
          <div className="text-neutral-600 dark:text-neutral-400">Overall Rating</div>
        </div>
      )}
      
      {ratings.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between items-baseline">
            <span className={cn('text-neutral-700 dark:text-neutral-300', sizeClasses[size])}>
              {item.label}
            </span>
            <span className={cn('font-medium', sizeClasses[size])}>
              {item.rating.toFixed(1)}
            </span>
          </div>
          {showBars && (
            <ProgressBar
              value={(item.rating / (item.maxRating || 5)) * 100}
              size="sm"
              variant="primary"
              showValue={false}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Review statistics component
export interface ReviewStatsProps {
  averageRating: number;
  totalReviews: number;
  recommendationRate?: number;
  verifiedPurchases?: number;
  helpfulVotes?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({
  averageRating,
  totalReviews,
  recommendationRate,
  verifiedPurchases,
  helpfulVotes,
  size = 'md',
  className,
}) => {
  const stats = [
    {
      label: 'Average Rating',
      value: averageRating.toFixed(1),
      suffix: '/ 5',
    },
    {
      label: 'Total Reviews',
      value: totalReviews.toLocaleString(),
    },
  ];

  if (recommendationRate !== undefined) {
    stats.push({
      label: 'Would Recommend',
      value: `${Math.round(recommendationRate)}%`,
    });
  }

  if (verifiedPurchases !== undefined) {
    stats.push({
      label: 'Verified Purchases',
      value: verifiedPurchases.toLocaleString(),
    });
  }

  if (helpfulVotes !== undefined) {
    stats.push({
      label: 'Helpful Votes',
      value: helpfulVotes.toLocaleString(),
    });
  }

  const sizeClasses = {
    sm: {
      container: 'gap-4',
      value: 'text-lg',
      label: 'text-xs',
    },
    md: {
      container: 'gap-6',
      value: 'text-2xl',
      label: 'text-sm',
    },
    lg: {
      container: 'gap-8',
      value: 'text-3xl',
      label: 'text-base',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn('flex flex-wrap', sizes.container, className)}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className={cn('font-bold text-neutral-900 dark:text-neutral-100', sizes.value)}>
            {stat.value}
            {stat.suffix && (
              <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                {stat.suffix}
              </span>
            )}
          </div>
          <div className={cn('text-neutral-600 dark:text-neutral-400', sizes.label)}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};