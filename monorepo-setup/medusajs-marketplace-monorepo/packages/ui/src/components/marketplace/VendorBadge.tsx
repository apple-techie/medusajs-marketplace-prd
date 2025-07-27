import React from 'react'
import { cn, formatVendorType, getCommissionTierLabel } from '../../utils'
import type { Vendor } from '@marketplace/types'

export interface VendorBadgeProps {
  vendor: Pick<Vendor, 'type' | 'name' | 'commission_tier'>
  showRating?: boolean
  showFulfillmentLocation?: boolean
  className?: string
}

export function VendorBadge({ 
  vendor, 
  showRating = false,
  showFulfillmentLocation = false,
  className 
}: VendorBadgeProps) {
  const vendorTypeColors = {
    shop: 'bg-blue-100 text-blue-800 border-blue-200',
    brand: 'bg-purple-100 text-purple-800 border-purple-200',
    distributor: 'bg-green-100 text-green-800 border-green-200'
  }

  const tierColors = {
    1: 'bg-orange-100 text-orange-800', // Bronze
    2: 'bg-gray-100 text-gray-800',     // Silver
    3: 'bg-yellow-100 text-yellow-800', // Gold
    4: 'bg-yellow-100 text-yellow-900'  // Gold+
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span 
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          vendorTypeColors[vendor.type]
        )}
      >
        {formatVendorType(vendor.type)}
      </span>
      
      {vendor.type === 'shop' && (
        <span 
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
            tierColors[vendor.commission_tier]
          )}
        >
          {getCommissionTierLabel(vendor.commission_tier)}
        </span>
      )}
      
      <span className="text-sm text-gray-600">
        {vendor.name}
      </span>
      
      {showRating && (
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          <span className="text-sm text-gray-600">4.8</span>
        </div>
      )}
      
      {showFulfillmentLocation && (
        <span className="text-sm text-gray-500">
          📍 Downtown Hub
        </span>
      )}
    </div>
  )
}