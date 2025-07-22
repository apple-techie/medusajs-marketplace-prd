import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import { ProductCard } from '../../molecules/ProductCard/ProductCard';
import { FilterButton } from '../../atoms/FilterButton/FilterButton';
import { Tabs } from '../../molecules/Tabs/Tabs';
import { ShopHeader } from '../../molecules/ShopHeader/ShopHeader';
import { ReviewCard } from '../../molecules/ReviewCard/ReviewCard';
import { ShopStats } from '../../molecules/ShopStats/ShopStats';

export interface ShopDetailPageProps {
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
    stats?: Array<{
      label: string;
      value: string | number;
      icon?: string;
    }>;
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating?: number;
    reviewCount?: number;
    isNew?: boolean;
    freeShipping?: boolean;
  }>;
  reviews: Array<{
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
  }>;
  onFollowClick?: () => void;
  onMessageClick?: () => void;
  onProductClick?: (productId: string) => void;
  onFilterChange?: (filters: string[]) => void;
  onReviewHelpful?: (reviewId: string) => void;
  onReviewReport?: (reviewId: string) => void;
  onReviewImageClick?: (imageUrl: string) => void;
  loading?: boolean;
  className?: string;
}

export const ShopDetailPage: React.FC<ShopDetailPageProps> = ({
  shop,
  products,
  reviews,
  onFollowClick,
  onMessageClick,
  onProductClick,
  onFilterChange,
  onReviewHelpful,
  onReviewReport,
  onReviewImageClick,
  loading = false,
  className,
}) => {
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [activeTab, setActiveTab] = useState('products');

  const handleFilterToggle = (filter: string) => {
    if (filter === 'all') {
      setActiveFilters(['all']);
    } else {
      const newFilters = activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters.filter(f => f !== 'all'), filter];
      
      setActiveFilters(newFilters.length === 0 ? ['all'] : newFilters);
    }
    
    if (onFilterChange) {
      onFilterChange(activeFilters);
    }
  };

  return (
    <div className={cn('min-h-screen bg-white dark:bg-neutral-900', className)}>
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">ShopMart</h1>
            <div className="flex items-center gap-4">
              <button className="p-2">
                <Icon icon="search" className="w-5 h-5" />
              </button>
              <button className="p-2">
                <Icon icon="heart" className="w-5 h-5" />
              </button>
              <button className="p-2 relative">
                <Icon icon="shopping-cart" className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Shop Info Section */}
      <section className="bg-neutral-50 dark:bg-neutral-800/50">
        <div className="container mx-auto px-4 py-8">
          <ShopHeader
            shop={shop}
            onFollowClick={onFollowClick}
            onMessageClick={onMessageClick}
            loading={loading}
          />
          
          {/* Shop Stats */}
          {shop.stats && shop.stats.length > 0 && (
            <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
              <ShopStats
                stats={shop.stats}
                variant="default"
                columns={shop.stats.length as 2 | 3 | 4}
              />
            </div>
          )}
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white dark:bg-neutral-900 z-10">
        <div className="container mx-auto px-4">
          <Tabs
            tabs={[
              { id: 'products', label: 'Products' },
              { id: 'reviews', label: 'Shop Reviews' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'products' && (
          <>
            {/* Filters */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              <FilterButton
                active={activeFilters.includes('all')}
                onClick={() => handleFilterToggle('all')}
                count={products.length}
              >
                All products
              </FilterButton>
              <FilterButton
                active={activeFilters.includes('new')}
                onClick={() => handleFilterToggle('new')}
                count={products.filter(p => p.isNew).length}
              >
                New Arrival
              </FilterButton>
              <FilterButton
                active={activeFilters.includes('sale')}
                onClick={() => handleFilterToggle('sale')}
                count={products.filter(p => p.originalPrice).length}
              >
                On Sale
              </FilterButton>
              <FilterButton
                active={activeFilters.includes('shipping')}
                onClick={() => handleFilterToggle('shipping')}
                count={products.filter(p => p.freeShipping).length}
              >
                Free Shipping
              </FilterButton>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  {product.isNew && (
                    <Badge 
                      className="absolute top-2 left-2 z-10 bg-neutral-900 text-white"
                      size="sm"
                    >
                      New Arrival
                    </Badge>
                  )}
                  <ProductCard
                    {...product}
                    layout="grid"
                    imageAspectRatio="1:1"
                    onClick={() => onProductClick?.(product.id)}
                    showVendor={false}
                    showRating={!!product.rating}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold mb-6">Ratings & Reviews</h3>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-neutral-200 dark:border-neutral-800 pb-6 last:border-0">
                  <ReviewCard
                    review={review}
                    onHelpful={onReviewHelpful}
                    onReport={onReviewReport}
                    onProductClick={onProductClick}
                    onImageClick={onReviewImageClick}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Shop Smarter with Our App</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Get exclusive deals, faster checkout, and order tracking all in one place.
              </p>
              <div className="flex gap-2">
                <img src="/app-store.png" alt="App Store" className="h-10" />
                <img src="/google-play.png" alt="Google Play" className="h-10" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">SUPPORT</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#" className="hover:text-primary-500">Become a Seller</a></li>
                <li><a href="#" className="hover:text-primary-500">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-500">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary-500">Shipping & Delivery</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">COMPANY</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#" className="hover:text-primary-500">About Us</a></li>
                <li><a href="#" className="hover:text-primary-500">Careers</a></li>
                <li><a href="#" className="hover:text-primary-500">Press</a></li>
                <li><a href="#" className="hover:text-primary-500">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">LEGAL</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#" className="hover:text-primary-500">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-primary-500">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary-500">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

ShopDetailPage.displayName = 'ShopDetailPage';