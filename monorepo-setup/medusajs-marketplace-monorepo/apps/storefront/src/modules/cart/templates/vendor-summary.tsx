'use client'

import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { useVendorCart } from "@lib/hooks/use-vendor-cart"

type VendorSummaryProps = {
  cart: HttpTypes.StoreCart
}

const VendorSummary = ({ cart }: VendorSummaryProps) => {
  const { data: vendorData, isLoading } = useVendorCart(cart)

  if (isLoading || !vendorData) {
    return null
  }

  const { vendor_summary } = vendorData

  if (vendor_summary.vendor_count <= 1) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Divider />
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <Text className="text-ui-fg-base font-semibold">Vendor Breakdown</Text>
        </div>
        
        <div className="flex flex-col gap-y-2">
          {vendor_summary.vendors.map((vendor) => (
            <div key={vendor.vendor_id} className="flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <Text className="text-ui-fg-base">{vendor.vendor_name}</Text>
                <Text className="text-ui-fg-subtle text-xs">
                  {vendor.item_count} {vendor.item_count === 1 ? 'item' : 'items'}
                </Text>
              </div>
              <Text className="text-ui-fg-base">
                {cart.currency_code?.toUpperCase()} {(vendor.subtotal / 100).toFixed(2)}
              </Text>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Text className="text-ui-fg-subtle text-sm">
            Total from {vendor_summary.vendor_count} vendors
          </Text>
          <Text className="text-ui-fg-base font-semibold">
            {cart.currency_code?.toUpperCase()} {(vendor_summary.total_amount / 100).toFixed(2)}
          </Text>
        </div>
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full border-t border-gray-200 my-4" />
}

export default VendorSummary