import { Modules } from "@medusajs/framework/utils"

export default async function seedTestOrder({ container }) {
  console.log("🛒 Creating test order...")
  
  const regionService = container.resolve(Modules.REGION)
  const customerService = container.resolve(Modules.CUSTOMER)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const orderService = container.resolve(Modules.ORDER)
  const productService = container.resolve(Modules.PRODUCT)
  const storeService = container.resolve(Modules.STORE)
  
  try {
    // Get or create store
    let store = await storeService.listStores()
    if (!store.length) {
      store = await storeService.createStores([{
        name: "Marketplace Store",
        supported_currencies: ["usd"]
      }])
    }
    
    // Get or create region
    let regions = await regionService.listRegions()
    let region = regions[0]
    
    if (!region) {
      region = await regionService.createRegions({
        name: "United States",
        currency_code: "usd",
        countries: ["us"]
      })
      console.log("✅ Created region:", region.name)
    }
    
    // Get or create sales channel
    let salesChannels = await salesChannelService.listSalesChannels()
    let salesChannel = salesChannels[0]
    
    if (!salesChannel) {
      salesChannel = await salesChannelService.createSalesChannels({
        name: "Webshop"
      })
      console.log("✅ Created sales channel:", salesChannel.name)
    }
    
    // Get or create customer
    let customers = await customerService.listCustomers()
    let customer = customers[0]
    
    if (!customer) {
      customer = await customerService.createCustomers({
        email: "test@example.com",
        first_name: "Test",
        last_name: "Customer"
      })
      console.log("✅ Created customer:", customer.email)
    }
    
    // Get or create product
    let products = await productService.listProducts()
    let product = products[0]
    
    if (!product) {
      product = await productService.createProducts({
        title: "Test Product",
        handle: "test-product",
        status: "published",
        variants: [
          {
            title: "Default Variant",
            sku: "TEST-001",
            manage_inventory: false,
            prices: [
              {
                amount: 2000,
                currency_code: "usd"
              }
            ]
          }
        ]
      })
      console.log("✅ Created product:", product.title)
    }
    
    // Create shipping and billing addresses
    const addressData = {
      first_name: "Test",
      last_name: "Customer",
      address_1: "123 Test Street",
      city: "New York",
      province: "NY",
      postal_code: "10001",
      country_code: "us",
      phone: "555-0123"
    }
    
    // Get the product variant
    const variant = product.variants?.[0] || (await productService.listProductVariants({ product_id: product.id }))[0]
    
    if (!variant) {
      throw new Error("No product variant found")
    }
    
    // Create order using the simpler approach
    const order = await orderService.createOrders({
      region_id: region.id,
      customer_id: customer.id,
      sales_channel_id: salesChannel.id,
      email: customer.email,
      currency_code: "usd",
      shipping_address: addressData,
      billing_address: addressData,
      items: [
        {
          title: variant.title || product.title,
          variant_id: variant.id,
          quantity: 1,
          unit_price: 2000
        }
      ],
      shipping_methods: [
        {
          name: "Standard Shipping",
          amount: 500
        }
      ]
    })
    
    console.log("✅ Created test order:", order.display_id)
    console.log("   Status:", order.status)
    console.log("   Total:", order.total)
    console.log("   Customer:", order.email)
    
  } catch (error) {
    console.error("❌ Error creating test order:", error.message)
    console.error(error)
  }
}