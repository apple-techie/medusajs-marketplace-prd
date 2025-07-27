import { HttpTypes } from "@medusajs/types"
import { Container, Badge } from "@medusajs/ui"
import { BuildingStorefront, SquareTwoStack } from "@medusajs/icons"
import Divider from "@modules/common/components/divider"
import Item from "@modules/order/components/item"
import { convertToLocale } from "@lib/util/money"

type ItemsByVendorProps = {
  order: HttpTypes.StoreOrder
}

// Group items by vendor
const groupItemsByVendor = (items: HttpTypes.StoreOrder['items']) => {
  const vendorGroups: Record<string, {
    vendor_name: string
    vendor_id: string
    items: NonNullable<HttpTypes.StoreOrder['items']>
    subtotal: number
  }> = {}

  items?.forEach(item => {
    // Get vendor info from item metadata or product metadata
    const vendorId = (item.metadata?.vendor_id || item.product?.metadata?.vendor_id || 'default') as string
    const vendorName = (item.metadata?.vendor_name || item.product?.metadata?.vendor_name || 'Main Store') as string
    
    if (!vendorGroups[vendorId]) {
      vendorGroups[vendorId] = {
        vendor_name: vendorName,
        vendor_id: vendorId,
        items: [],
        subtotal: 0
      }
    }
    
    vendorGroups[vendorId].items.push(item)
    vendorGroups[vendorId].subtotal += item.subtotal || 0
  })

  return Object.values(vendorGroups)
}

const ItemsByVendor = ({ order }: ItemsByVendorProps) => {
  const vendorGroups = groupItemsByVendor(order.items || [])
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <SquareTwoStack />
        <h2 className="text-large-semi">Order Items by Vendor</h2>
      </div>
      
      {vendorGroups.map((group, index) => (
        <Container key={group.vendor_id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BuildingStorefront className="text-ui-fg-subtle" />
              <h3 className="text-base-semi">{group.vendor_name}</h3>
              <Badge color="grey" size="small">
                {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
              </Badge>
            </div>
            <div className="text-small-semi text-ui-fg-subtle">
              Subtotal: {convertToLocale({
                amount: group.subtotal,
                currency_code: order.currency_code
              })}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {group.items.map((item) => (
              <div key={item.id} className="border-b border-ui-border-base last:border-none pb-2 last:pb-0">
                <Item
                  item={item}
                  currencyCode={order.currency_code}
                />
              </div>
            ))}
          </div>
          
          {/* Fulfillment status for this vendor */}
          {order.fulfillments && order.fulfillments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-ui-border-base">
              <div className="flex items-center gap-2 text-small-regular">
                <span className="text-ui-fg-subtle">Fulfillment Status:</span>
                <Badge color="green" size="small">
                  {order.fulfillment_status || 'Processing'}
                </Badge>
              </div>
            </div>
          )}
        </Container>
      ))}
      
      {vendorGroups.length > 1 && (
        <div className="mt-4 p-4 bg-ui-bg-subtle rounded-lg">
          <p className="text-small-regular text-ui-fg-subtle">
            <strong>Note:</strong> This order contains items from {vendorGroups.length} different vendors. 
            Each vendor will fulfill and ship their items separately. You may receive multiple packages.
          </p>
        </div>
      )}
    </div>
  )
}

export default ItemsByVendor