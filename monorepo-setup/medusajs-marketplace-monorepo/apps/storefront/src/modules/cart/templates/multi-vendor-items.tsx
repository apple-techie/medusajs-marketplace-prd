'use client'

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { useVendorCart } from "@lib/hooks/use-vendor-cart"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type MultiVendorItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const MultiVendorItemsTemplate = ({ cart }: MultiVendorItemsTemplateProps) => {
  const { data: vendorData, isLoading } = useVendorCart(cart || null)
  const items = cart?.items

  // Group items by vendor
  const itemsByVendor = new Map<string, {
    vendor: any
    items: typeof items
  }>()

  if (vendorData && items) {
    vendorData.vendor_summary.vendors.forEach(vendor => {
      const vendorItems = items.filter(item => 
        item.product?.metadata?.vendor_id === vendor.vendor_id
      )
      if (vendorItems.length > 0) {
        itemsByVendor.set(vendor.vendor_id, {
          vendor,
          items: vendorItems
        })
      }
    })
  }

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">Shopping Cart</Heading>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {repeat(3).map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                {repeat(2).map((j) => (
                  <SkeletonLineItem key={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(itemsByVendor.entries()).map(([vendorId, { vendor, items: vendorItems }]) => (
            <div key={vendorId} className="border rounded-lg p-6 bg-white shadow-sm">
              {/* Vendor Header */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{vendor.vendor_name}</h3>
                    <p className="text-sm text-gray-600">
                      {vendor.vendor_type === 'shop' && 'Shop Partner'}
                      {vendor.vendor_type === 'brand' && 'Brand Partner'}
                      {vendor.vendor_type === 'distributor' && 'Distributor Partner'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {vendor.item_count} {vendor.item_count === 1 ? 'item' : 'items'}
                    </p>
                    <p className="font-semibold">
                      Subtotal: {cart?.currency_code?.toUpperCase()} {(vendor.subtotal / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vendor Items */}
              <div className="space-y-4">
                {vendorItems
                  ?.sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code || "usd"}
                    />
                  ))}
              </div>
            </div>
          ))}

          {/* Vendor Summary */}
          {vendorData && vendorData.vendor_summary.vendor_count > 1 && (
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <div className="flex items-center justify-between">
                <Text className="text-sm text-gray-600">
                  Shopping from {vendorData.vendor_summary.vendor_count} different vendors
                </Text>
                <Text className="text-sm text-gray-600">
                  Total items: {items?.length || 0}
                </Text>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MultiVendorItemsTemplate