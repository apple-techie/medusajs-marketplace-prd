import { 
  MedusaContainer,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function seedOrders({ container }: { container: MedusaContainer }) {
  const productService = container.resolve(Modules.PRODUCT)
  const customerService = container.resolve(Modules.CUSTOMER)
  const cartService = container.resolve(Modules.CART)
  const regionService = container.resolve(Modules.REGION)
  const orderService = container.resolve(Modules.ORDER)
  const query = container.resolve("query")

  console.log("🛍️ Seeding orders...")

  try {
    // Get region
    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["*", "payment_providers.*", "countries.*"],
    })
    
    const region = regions[0]
    if (!region) {
      console.error("No region found. Please run medusa seed first.")
      return
    }

    // Get customers
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["*"],
    })
    
    if (customers.length === 0) {
      console.error("No customers found. Please run marketplace seed first.")
      return
    }

    // Get products with variants
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["*", "variants.*", "variants.prices.*"],
      filters: {
        status: "published"
      }
    })
    
    if (products.length === 0) {
      console.error("No products found. Please run marketplace seed first.")
      return
    }

    // Create orders for each customer
    for (const customer of customers.slice(0, 3)) { // First 3 customers
      try {
        // Create a cart
        const cart = await cartService.createCarts({
          currency_code: region.currency_code,
          email: customer.email || undefined,
          customer_id: customer.id,
        })

        // Add random products to cart
        const numProducts = Math.floor(Math.random() * 3) + 1 // 1-3 products
        const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, numProducts)
        
        for (const product of selectedProducts) {
          const variant = product.variants[0]
          if (variant) {
            await cartService.addLineItems([
              {
                cart_id: cart.id,
                variant_id: variant.id,
                quantity: Math.floor(Math.random() * 3) + 1, // 1-3 quantity
                title: variant.title || product.title,
                unit_price: (variant as any).prices?.[0]?.amount || 1000
              }
            ])
          }
        }

        // Complete the cart to create an order
        const { data: updatedCart } = await query.graph({
          entity: "cart",
          fields: ["*", "items.*", "shipping_address.*"],
          filters: { id: cart.id }
        })

        if (updatedCart[0]?.items?.length > 0) {
          // Add shipping address
          await cartService.updateCarts([{
            id: cart.id,
            shipping_address: {
              first_name: customer.first_name || "John",
              last_name: customer.last_name || "Doe",
              address_1: "123 Main St",
              city: "New York",
              country_code: "US",
              postal_code: "10001",
              phone: "+1234567890",
            },
            billing_address: {
              first_name: customer.first_name || "John",
              last_name: customer.last_name || "Doe",
              address_1: "123 Main St",
              city: "New York",
              country_code: "US",
              postal_code: "10001",
              phone: "+1234567890",
            }
          }])

          // Create an order from the cart
          try {
            const order = await orderService.createOrders({
              currency_code: region.currency_code,
              email: customer.email || undefined,
              customer_id: customer.id,
              items: updatedCart[0].items.map((item: any) => ({
                variant_id: item.variant_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                title: item.title
              })),
              shipping_address: {
                first_name: "Test",
                last_name: "Customer",
                address_1: updatedCart[0].shipping_address?.address_1 || "123 Main St",
                city: updatedCart[0].shipping_address?.city || "Los Angeles",
                province: updatedCart[0].shipping_address?.province || "CA",
                postal_code: updatedCart[0].shipping_address?.postal_code || "90001",
                country_code: updatedCart[0].shipping_address?.country_code || "us",
                phone: updatedCart[0].shipping_address?.phone || "+1234567890"
              },
              // Add some mock order data
              metadata: {
                source: "seed_script",
                vendor_orders: selectedProducts.map((p: any) => ({
                  vendor_id: p.metadata?.vendor_id,
                  vendor_name: p.metadata?.vendor_name,
                }))
              }
            })

            console.log(`✅ Created order for customer: ${customer.email}`)
          } catch (orderError) {
            console.log(`Could not create order for ${customer.email}:`, orderError.message)
          }
        }
      } catch (error) {
        console.log(`Error creating order for ${customer.email}:`, error.message)
      }
    }

    console.log("✨ Order seeding completed!")
  } catch (error) {
    console.error("Error seeding orders:", error)
  }
}

// Run the seed function if called directly
if (require.main === module) {
  const { getContainer } = require("../lib/medusa-app")
  seedOrders({ container: getContainer() })
      .then(() => process.exit(0))
      .catch((err) => {
        console.error("Seeding failed:", err)
        process.exit(1)
      })
}