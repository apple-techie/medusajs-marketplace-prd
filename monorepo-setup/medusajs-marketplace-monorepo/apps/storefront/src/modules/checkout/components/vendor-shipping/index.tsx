'use client'

import { HttpTypes } from "@medusajs/types"
import { RadioGroup, Text } from "@medusajs/ui"
import { formatAmount } from "@lib/util/prices"
import { useVendorCart } from "@lib/hooks/use-vendor-cart"

type VendorShippingProps = {
  cart: HttpTypes.StoreCart
  shippingOptions: HttpTypes.StoreCartShippingOption[]
  selectedOptions: Record<string, string>
  onSelectOption: (vendorId: string, optionId: string) => void
}

const VendorShipping = ({ 
  cart, 
  shippingOptions, 
  selectedOptions, 
  onSelectOption 
}: VendorShippingProps) => {
  const { data: vendorData, isLoading } = useVendorCart(cart)

  if (isLoading || !vendorData) {
    return <div>Loading vendor shipping options...</div>
  }

  const { vendor_summary } = vendorData

  if (vendor_summary.vendor_count <= 1) {
    // Single vendor - use standard shipping component
    return null
  }

  // Group shipping options by vendor
  const optionsByVendor = new Map<string, HttpTypes.StoreCartShippingOption[]>()
  
  // For now, we'll show the same options for each vendor
  // In a real implementation, each vendor would have their own shipping options
  vendor_summary.vendors.forEach(vendor => {
    optionsByVendor.set(vendor.vendor_id, shippingOptions)
  })

  return (
    <div className="space-y-6">
      <Text className="text-lg font-semibold">Shipping Options by Vendor</Text>
      
      {vendor_summary.vendors.map((vendor) => (
        <div key={vendor.vendor_id} className="border rounded-lg p-4">
          <div className="mb-3">
            <Text className="font-semibold">{vendor.vendor_name}</Text>
            <Text className="text-sm text-gray-600">
              {vendor.item_count} {vendor.item_count === 1 ? 'item' : 'items'}
            </Text>
          </div>
          
          <RadioGroup
            value={selectedOptions[vendor.vendor_id]}
            onValueChange={(value) => onSelectOption(vendor.vendor_id, value)}
          >
            {(optionsByVendor.get(vendor.vendor_id) || []).map((option) => (
              <RadioGroup.Item
                key={option.id}
                value={option.id}
                className="flex items-center justify-between text-small-regular cursor-pointer py-3 border-b last:border-b-0"
              >
                <div className="flex items-center gap-x-4">
                  <RadioGroup.Item value={option.id} />
                  <div>
                    <Text className="text-base-regular">
                      {option.name}
                    </Text>
                    {(option as any).metadata?.description && (
                      <Text className="text-ui-fg-subtle text-sm">
                        {(option as any).metadata.description as string}
                      </Text>
                    )}
                  </div>
                </div>
                <Text className="text-base-semi">
                  {formatAmount({
                    amount: option.amount!,
                    region: cart.region!,
                  })}
                </Text>
              </RadioGroup.Item>
            ))}
          </RadioGroup>
        </div>
      ))}
      
      <div className="bg-gray-50 rounded-lg p-4">
        <Text className="text-sm text-gray-600">
          Each vendor ships separately. You&apos;ll receive {vendor_summary.vendor_count} separate deliveries.
        </Text>
      </div>
    </div>
  )
}

export default VendorShipping