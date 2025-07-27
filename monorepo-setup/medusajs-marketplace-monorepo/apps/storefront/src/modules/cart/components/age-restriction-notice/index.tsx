'use client'

import { HttpTypes } from '@medusajs/types'
import { Text } from '@medusajs/ui'
import { useCartAgeRestriction } from '@lib/hooks/use-age-verification'

type AgeRestrictionNoticeProps = {
  cart: HttpTypes.StoreCart
}

const AgeRestrictionNotice = ({ cart }: AgeRestrictionNoticeProps) => {
  const productIds = cart.items?.map(item => item.product_id || '') || []
  const { data: restrictions, isLoading } = useCartAgeRestriction(productIds)

  if (isLoading || !restrictions?.restricted) {
    return null
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-amber-600 mt-0.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <div className="flex-1">
          <Text className="text-sm font-semibold text-amber-900 mb-1">
            Age-Restricted Items in Cart
          </Text>
          <Text className="text-sm text-amber-800">
            Your cart contains items that require age verification. 
            You must be at least {restrictions.minimum_age} years old to purchase these items. 
            Age verification will be required at checkout.
          </Text>
          {restrictions.requires_id_check && (
            <Text className="text-sm text-amber-800 mt-2">
              <strong>Note:</strong> Photo ID verification may be required for these items.
            </Text>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgeRestrictionNotice