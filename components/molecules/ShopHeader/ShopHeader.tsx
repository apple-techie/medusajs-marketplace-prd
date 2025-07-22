import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { StarRating } from '../../atoms/StarRating/StarRating';

export interface ShopHeaderProps {
  shop: {
    id: string;
    name: string;
    logo?: string;
    location?: {
      city: string;
      area?: string;
    };
    followersCount: number;
    rating?: number;
    reviewCount?: number;
    description?: string;
    isFollowing?: boolean;
    verified?: boolean;
  };
  onFollowClick?: () => void;
  onMessageClick?: () => void;
  loading?: boolean;
  compact?: boolean;
  className?: string;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  shop,
  onFollowClick,
  onMessageClick,
  loading = false,
  compact = false,
  className,
}) => {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-neutral-200 dark:bg-neutral-700 rounded-full mb-4" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-48 mb-2" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32 mb-4" />
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-24 mb-6" />
          <div className="flex gap-3">
            <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-28" />
            <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-28" />
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <Avatar
          src={shop.logo}
          alt={shop.name}
          size="lg"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold">{shop.name}</h2>
            {shop.verified && (
              <Icon icon="badge-check" className="w-5 h-5 text-primary-500" />
            )}
          </div>
          {shop.location && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {shop.location.city}{shop.location.area && `, ${shop.location.area}`}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant={shop.isFollowing ? 'outline' : 'default'}
            size="sm"
            onClick={onFollowClick}
          >
            {shop.isFollowing ? 'Following' : 'Follow'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMessageClick}
          >
            <Icon icon="message-circle" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('text-center', className)}>
      {/* Avatar */}
      <div className="relative inline-block mb-4">
        <Avatar
          src={shop.logo}
          alt={shop.name}
          size="xl"
          className="w-24 h-24"
        />
        {shop.verified && (
          <div className="absolute bottom-0 right-0 bg-white dark:bg-neutral-900 rounded-full p-1">
            <Icon icon="badge-check" className="w-6 h-6 text-primary-500" />
          </div>
        )}
      </div>

      {/* Shop Name */}
      <h1 className="text-2xl font-bold mb-2">{shop.name}</h1>

      {/* Location */}
      {shop.location && (
        <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400 mb-4">
          <Icon icon="map-pin" className="w-4 h-4" />
          <span className="text-sm">
            {shop.location.city}
            {shop.location.area && `, ${shop.location.area}`}
          </span>
        </div>
      )}

      {/* Followers */}
      <div className="mb-4">
        <span className="text-2xl font-semibold">{formatFollowers(shop.followersCount)}</span>
        <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-1">
          follower{shop.followersCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Rating */}
      {shop.rating !== undefined && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <StarRating rating={shop.rating} size="sm" showValue />
          {shop.reviewCount !== undefined && (
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              ({shop.reviewCount} Review{shop.reviewCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      )}

      {/* Description */}
      {shop.description && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
          {shop.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button
          variant={shop.isFollowing ? 'outline' : 'default'}
          onClick={onFollowClick}
          className="min-w-[120px]"
        >
          <Icon icon={shop.isFollowing ? 'check' : 'plus'} className="w-4 h-4 mr-2" />
          {shop.isFollowing ? 'Following' : 'Follow'}
        </Button>
        <Button
          variant="outline"
          onClick={onMessageClick}
        >
          <Icon icon="message-circle" className="w-4 h-4 mr-2" />
          Message
        </Button>
      </div>
    </div>
  );
};

ShopHeader.displayName = 'ShopHeader';