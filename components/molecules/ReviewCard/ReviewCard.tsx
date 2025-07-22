import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { StarRating } from '../../atoms/StarRating/StarRating';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';

export interface ReviewCardProps {
  review: {
    id: string;
    author: {
      name: string;
      avatar?: string;
      verified?: boolean;
    };
    date: string | Date;
    rating: number;
    comment: string;
    helpful?: number;
    images?: string[];
    product?: {
      id: string;
      name: string;
      image?: string;
    };
    shopResponse?: {
      date: string | Date;
      comment: string;
    };
  };
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  onProductClick?: (productId: string) => void;
  onImageClick?: (imageUrl: string) => void;
  showProduct?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpful,
  onReport,
  onProductClick,
  onImageClick,
  showProduct = true,
  variant = 'default',
  className,
}) => {
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(dateObj);
  };

  const formatRelativeTime = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? 's' : ''} ago`;
    return formatDate(date);
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex gap-3', className)}>
        <Avatar
          src={review.author.avatar}
          alt={review.author.name}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{review.author.name}</span>
            <StarRating rating={review.rating} size="xs" />
            <span className="text-xs text-neutral-500">
              {formatRelativeTime(review.date)}
            </span>
          </div>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
            {review.comment}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('', className)}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar
          src={review.author.avatar}
          alt={review.author.name}
          size="md"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.author.name}</span>
              {review.author.verified && (
                <Icon icon="badge-check" className="w-4 h-4 text-primary-500" />
              )}
            </div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatDate(review.date)}
            </span>
          </div>
          <StarRating rating={review.rating} size="sm" className="mb-2" />
        </div>
      </div>

      {/* Comment */}
      <p className="text-neutral-700 dark:text-neutral-300 mb-3 leading-relaxed">
        {review.comment}
      </p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {review.images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageClick?.(image)}
              className="flex-shrink-0 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
            >
              <img
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-20 h-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Product Reference */}
      {showProduct && review.product && (
        <button
          onClick={() => review.product && onProductClick?.(review.product.id)}
          className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg mb-3 w-full text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        >
          {review.product.image && (
            <img
              src={review.product.image}
              alt={review.product.name}
              className="w-12 h-12 rounded object-cover"
            />
          )}
          <span className="text-sm font-medium flex-1">{review.product.name}</span>
          <Icon icon="chevron-right" className="w-4 h-4 text-neutral-400" />
        </button>
      )}

      {/* Shop Response */}
      {review.shopResponse && (
        <div className="ml-12 mt-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <div className="flex items-center gap-2 mb-2">
            <Icon icon="store" className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
              Shop Response
            </span>
            <span className="text-xs text-primary-600 dark:text-primary-400">
              {formatRelativeTime(review.shopResponse.date)}
            </span>
          </div>
          <p className="text-sm text-primary-800 dark:text-primary-200">
            {review.shopResponse.comment}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 mt-3">
        {review.helpful !== undefined && (
          <button
            onClick={() => onHelpful?.(review.id)}
            className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <Icon icon="thumbs-up" className="w-4 h-4" />
            <span>Helpful ({review.helpful})</span>
          </button>
        )}
        {onReport && (
          <button
            onClick={() => onReport(review.id)}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Report
          </button>
        )}
      </div>
    </div>
  );
};

ReviewCard.displayName = 'ReviewCard';