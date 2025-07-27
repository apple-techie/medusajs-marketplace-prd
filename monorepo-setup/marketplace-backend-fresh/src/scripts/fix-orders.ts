import { Modules } from "@medusajs/framework/utils"

export default async function fixOrders({ container }) {
  console.log("🔧 Fixing existing orders...")
  
  const orderService = container.resolve(Modules.ORDER)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  
  try {
    // Get default sales channel
    const salesChannels = await salesChannelService.listSalesChannels()
    const defaultChannel = salesChannels[0]
    
    if (!defaultChannel) {
      console.error("❌ No sales channel found")
      return
    }
    
    console.log(`✅ Found sales channel: ${defaultChannel.name}`)
    
    // Get all orders
    const orders = await orderService.listOrders({})
    console.log(`📦 Found ${orders.length} orders to update`)
    
    // Update orders without sales channel
    for (const order of orders) {
      if (!order.sales_channel_id) {
        console.log(`   Updating order ${order.id}...`)
        await orderService.updateOrders(order.id, {
          sales_channel_id: defaultChannel.id
        })
      }
    }
    
    console.log("✅ Orders fixed successfully!")
  } catch (error) {
    console.error("❌ Error fixing orders:", error.message)
  }
}