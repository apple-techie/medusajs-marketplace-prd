import { Modules } from "@medusajs/framework/utils"
import { ExecArgs } from "@medusajs/framework/types"

export default async function testMultiVendorCart({ container }: ExecArgs) {

  const cartService = container.resolve(Modules.CART)
  const productService = container.resolve(Modules.PRODUCT)
  const query = container.resolve("query")
  const marketplaceService = container.resolve("marketplace")

  try {
    console.log("🧪 Testing Multi-Vendor Cart Functionality...\n")

    // Get products from different vendors
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["*", "metadata.*"]
    })

    console.log(`Found ${products.length} products with vendor metadata`)

    // Group products by vendor
    const productsByVendor = new Map()
    products.forEach(product => {
      const vendorId = product.metadata?.vendor_id
      if (vendorId) {
        if (!productsByVendor.has(vendorId)) {
          productsByVendor.set(vendorId, [])
        }
        productsByVendor.get(vendorId).push(product)
      }
    })

    console.log(`Found products from ${productsByVendor.size} vendors`)

    // Create a test cart
    const [cart] = await cartService.createCarts([{
      region_id: "reg_01JDPFBEAZQHHB6B2F6V9Y7H4N", // Default region from seed
      sales_channel_id: "sc_01JDPFBDC7TZ9WTDBEJ7DJDZ1M", // Default sales channel
      currency_code: "usd"
    }])

    console.log(`\n✅ Created test cart: ${cart.id}`)

    // Add items from different vendors
    let itemsAdded = 0
    for (const [vendorId, vendorProducts] of productsByVendor) {
      if (itemsAdded >= 3) break // Add up to 3 vendors
      
      const product = vendorProducts[0]
      const variant = product.variants?.[0]
      
      if (variant) {
        await cartService.addLineItems({
          cart_id: cart.id,
          title: product.title,
          quantity: 2,
          variant_id: variant.id,
          unit_price: 1000 // $10 default price
        })
        
        console.log(`Added ${product.title} from vendor ${product.metadata?.vendor_name || vendorId}`)
        itemsAdded++
      }
    }

    // Retrieve cart with items
    const updatedCart = await cartService.retrieveCart(cart.id, {
      relations: ["items"]
    })

    console.log(`\n📦 Cart now has ${updatedCart.items?.length || 0} items`)

    // Process multi-vendor cart
    const multiVendorCart = await marketplaceService.processMultiVendorCart(updatedCart)

    console.log("\n🛍️ Multi-Vendor Cart Summary:")
    console.log(`- Total Vendors: ${multiVendorCart.vendor_carts.length}`)
    console.log(`- Total Amount: $${(multiVendorCart.total_amount / 100).toFixed(2)}`)
    console.log(`- Total Commission: $${(multiVendorCart.total_commission / 100).toFixed(2)}`)
    console.log(`- Total Vendor Payout: $${(multiVendorCart.total_vendor_payout / 100).toFixed(2)}`)

    console.log("\n📊 Vendor Breakdown:")
    for (const vendorCart of multiVendorCart.vendor_carts) {
      console.log(`\n${vendorCart.vendor_name} (${vendorCart.vendor_type})`)
      console.log(`  - Items: ${vendorCart.items.length}`)
      console.log(`  - Subtotal: $${(vendorCart.subtotal / 100).toFixed(2)}`)
      console.log(`  - Commission: $${(vendorCart.commission / 100).toFixed(2)}`)
      console.log(`  - Vendor Payout: $${(vendorCart.vendor_total / 100).toFixed(2)}`)
    }

    // Test cart validation
    console.log("\n🔍 Validating cart fulfillment...")
    const isValid = await marketplaceService.validateCartFulfillment(updatedCart)
    console.log(`Cart fulfillment validation: ${isValid ? "✅ Passed" : "❌ Failed"}`)

    // Test order splitting
    console.log("\n📋 Testing order splitting...")
    const vendorOrders = await marketplaceService.splitCartIntoVendorOrders(updatedCart)
    console.log(`Split into ${vendorOrders.length} vendor orders`)

    // Clean up
    await cartService.deleteCarts([cart.id])
    console.log("\n🧹 Cleaned up test cart")

    console.log("\n✨ Multi-vendor cart test completed successfully!")

  } catch (error) {
    console.error("❌ Test failed:", error)
  }
}