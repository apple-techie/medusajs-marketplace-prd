import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '../../atoms/Card/Card';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { Price } from '../../atoms/Price/Price';
import { Spinner } from '../../atoms/Spinner/Spinner';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string | Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  total: number;
  currency?: string;
  trackingNumber?: string;
  estimatedDelivery?: string | Date;
  shippingAddress?: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface OrderListProps {
  orders: Order[];
  
  // Display options
  layout?: 'default' | 'compact';
  showImages?: boolean;
  showShipping?: boolean;
  imageSize?: 'sm' | 'md' | 'lg';
  
  // Loading & empty states
  loading?: boolean;
  loadingCount?: number;
  emptyMessage?: string;
  emptyIcon?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  
  // Pagination
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  loadMoreLabel?: string;
  
  // Actions
  onViewOrder?: (orderId: string) => void;
  onTrackOrder?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  
  // Action visibility
  showViewButton?: boolean;
  showTrackButton?: boolean;
  showReorderButton?: boolean;
  showCancelButton?: boolean;
  
  // Labels
  viewLabel?: string;
  trackLabel?: string;
  reorderLabel?: string;
  cancelLabel?: string;
  
  // Styling
  className?: string;
  orderClassName?: string;
  
  'aria-label'?: string;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  layout = 'default',
  showImages = true,
  showShipping = true,
  imageSize = 'md',
  loading = false,
  loadingCount = 3,
  emptyMessage = 'No orders found',
  emptyIcon = 'package',
  emptyAction,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  loadMoreLabel = 'Load more orders',
  onViewOrder,
  onTrackOrder,
  onReorder,
  onCancelOrder,
  showViewButton = true,
  showTrackButton = true,
  showReorderButton = true,
  showCancelButton = true,
  viewLabel = 'View details',
  trackLabel = 'Track',
  reorderLabel = 'Buy again',
  cancelLabel = 'Cancel',
  className,
  orderClassName,
  'aria-label': ariaLabel,
}) => {
  // Status config
  const statusConfig = {
    pending: { label: 'Pending', variant: 'secondary' as const, icon: 'clock' },
    processing: { label: 'Processing', variant: 'secondary' as const, icon: 'loader' },
    shipped: { label: 'Shipped', variant: 'default' as const, icon: 'truck' },
    delivered: { label: 'Delivered', variant: 'success' as const, icon: 'check-circle' },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: 'x-circle' },
    refunded: { label: 'Refunded', variant: 'outline' as const, icon: 'rotate-ccw' },
  };
  
  // Image size styles
  const imageSizeStyles = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };
  
  // Format date
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj);
  };
  
  // Loading skeleton
  const LoadingSkeleton = () => (
    <Card className="p-4 sm:p-6">
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24" />
          </div>
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-20" />
        </div>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-9 bg-neutral-200 dark:bg-neutral-700 rounded w-24" />
          <div className="h-9 bg-neutral-200 dark:bg-neutral-700 rounded w-24" />
        </div>
      </div>
    </Card>
  );
  
  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div
        className={cn('space-y-4', className)}
        aria-label={ariaLabel || 'Loading orders'}
        aria-busy="true"
      >
        {Array.from({ length: loadingCount }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  // Empty state
  if (!loading && orders.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          className
        )}
        aria-label={ariaLabel || 'No orders'}
      >
        <Icon 
          icon={emptyIcon} 
          className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mb-4" 
        />
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
          {emptyMessage}
        </p>
        {emptyAction && (
          <Button onClick={emptyAction.onClick} variant="outline">
            {emptyAction.label}
          </Button>
        )}
      </div>
    );
  }
  
  const canCancel = (status: Order['status']) => {
    return status === 'pending' || status === 'processing';
  };
  
  const canTrack = (status: Order['status']) => {
    return status === 'shipped' || status === 'delivered';
  };
  
  return (
    <div className={cn('relative', className)}>
      <div
        className="space-y-4"
        aria-label={ariaLabel || 'Order list'}
      >
        {orders.map((order) => {
          const status = statusConfig[order.status];
          const showCancel = showCancelButton && canCancel(order.status) && onCancelOrder;
          const showTrack = showTrackButton && canTrack(order.status) && onTrackOrder;
          
          return (
            <Card
              key={order.id}
              className={cn('p-4 sm:p-6', orderClassName)}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                    <Badge variant={status.variant} size="sm">
                      <Icon icon={status.icon} className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {formatDate(order.date)}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Total</p>
                  <Price
                    amount={order.total}
                    currency={order.currency}
                    className="text-lg font-semibold"
                  />
                </div>
              </div>
              
              {/* Order items */}
              <div className={cn(
                'space-y-3',
                layout === 'compact' ? 'mb-3' : 'mb-4'
              )}>
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {showImages && item.image && (
                      <div className={cn(
                        'flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden',
                        imageSizeStyles[imageSize]
                      )}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      {item.variant && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {item.variant}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <Price amount={item.price} currency={order.currency} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {order.items.length > 3 && layout === 'compact' && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    +{order.items.length - 3} more items
                  </p>
                )}
              </div>
              
              {/* Shipping info */}
              {showShipping && (order.trackingNumber || order.estimatedDelivery) && (
                <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icon icon="truck" className="w-5 h-5 text-neutral-600 dark:text-neutral-400 mt-0.5" />
                    <div className="text-sm">
                      {order.trackingNumber && (
                        <p>
                          <span className="text-neutral-600 dark:text-neutral-400">Tracking:</span>{' '}
                          <span className="font-medium">{order.trackingNumber}</span>
                        </p>
                      )}
                      {order.estimatedDelivery && (
                        <p>
                          <span className="text-neutral-600 dark:text-neutral-400">Est. delivery:</span>{' '}
                          <span className="font-medium">{formatDate(order.estimatedDelivery)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {showViewButton && onViewOrder && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewOrder(order.id)}
                  >
                    <Icon icon="eye" className="w-4 h-4 mr-1.5" />
                    {viewLabel}
                  </Button>
                )}
                
                {showTrack && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTrackOrder(order.id)}
                  >
                    <Icon icon="map-pin" className="w-4 h-4 mr-1.5" />
                    {trackLabel}
                  </Button>
                )}
                
                {showReorderButton && onReorder && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReorder(order.id)}
                  >
                    <Icon icon="refresh-cw" className="w-4 h-4 mr-1.5" />
                    {reorderLabel}
                  </Button>
                )}
                
                {showCancel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCancelOrder(order.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Icon icon="x" className="w-4 h-4 mr-1.5" />
                    {cancelLabel}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Load more */}
      {hasMore && onLoadMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={loadingMore}
            loading={loadingMore}
            className="min-w-[200px]"
          >
            {!loadingMore && (
              <>
                <Icon icon="plus" className="w-5 h-5 mr-2" />
                {loadMoreLabel}
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Loading overlay for load more */}
      {loadingMore && (
        <div className="absolute inset-0 bg-white/50 dark:bg-neutral-900/50 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
};

OrderList.displayName = 'OrderList';