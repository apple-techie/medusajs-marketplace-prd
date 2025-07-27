'use client'

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { useVendorCart } from "@lib/hooks/use-vendor-cart"
import { formatAmount } from "@lib/util/prices"

type CommissionPreviewProps = {
  cart: HttpTypes.StoreCart
}

const CommissionPreview = ({ cart }: CommissionPreviewProps) => {
  const { data: vendorData, isLoading } = useVendorCart(cart)

  if (isLoading || !vendorData || vendorData.vendor_summary.vendor_count <= 1) {
    return null
  }

  const { vendor_summary } = vendorData

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-4">
      <Text className="text-sm font-semibold text-blue-900 mb-2">
        Multi-Vendor Order Summary
      </Text>
      
      <div className="space-y-2">
        {vendor_summary.vendors.map((vendor) => (
          <div key={vendor.vendor_id} className="flex justify-between text-sm text-blue-800">
            <span>{vendor.vendor_name}</span>
            <span>
              {formatAmount({
                amount: vendor.subtotal,
                region: cart.region!,
                includeTaxes: false,
              })}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-blue-200">
        <div className="flex justify-between text-sm">
          <Text className="text-blue-800">Marketplace Fee</Text>
          <Text className="text-blue-800">
            {formatAmount({
              amount: vendor_summary.total_commission,
              region: cart.region!,
              includeTaxes: false,
            })}
          </Text>
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <Text className="text-blue-900">Vendor Payouts</Text>
          <Text className="text-blue-900">
            {formatAmount({
              amount: vendor_summary.total_vendor_payout,
              region: cart.region!,
              includeTaxes: false,
            })}
          </Text>
        </div>
      </div>
      
      <Text className="text-xs text-blue-700 mt-3">
        You are ordering from {vendor_summary.vendor_count} different vendors. 
        Each vendor will process and ship their items separately.
      </Text>
    </div>
  )
}

export default CommissionPreview