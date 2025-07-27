import { 
  MedusaContainer
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  createProductTypesWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedMarketplace({ container }: { container: MedusaContainer }) {
  const marketplaceService = container.resolve("marketplace")
  const productService = container.resolve(Modules.PRODUCT)
  const regionService = container.resolve(Modules.REGION)
  const storeService = container.resolve(Modules.STORE)
  const customerService = container.resolve(Modules.CUSTOMER)
  const query = container.resolve("query")

  console.log("🌱 Seeding marketplace data...")

  // Get default region
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["*"],
  })
  
  const region = regions[0]
  if (!region) {
    console.error("No region found. Please run medusa seed first.")
    return
  }

  // Create product types
  console.log("📦 Creating product types...")
  
  const productTypeData = [
    { value: "Clothing" },
    { value: "Electronics" },
    { value: "Home & Garden" },
    { value: "Accessories" },
    { value: "Food & Beverage" },
    { value: "Health & Beauty" },
    { value: "Sports & Outdoors" },
    { value: "Books & Media" },
    { value: "Toys & Games" },
    { value: "Office Supplies" }
  ]
  
  const productTypes: any[] = []
  for (const typeData of productTypeData) {
    try {
      const created = await productService.createProductTypes([typeData])
      productTypes.push(created[0])
    } catch (error) {
      console.log(`Product type ${typeData.value} already exists, skipping...`)
      // Try to get existing type
      const [existing] = await productService.listProductTypes({ value: typeData.value })
      if (existing) {
        productTypes.push(existing)
      }
    }
  }
  console.log(`✅ Created/found ${productTypes.length} product types`)

  // Create collections
  console.log("📚 Creating collections...")
  
  const collectionData = [
    {
      title: "Summer Collection",
      handle: "summer-collection"
    },
    {
      title: "Winter Collection",
      handle: "winter-collection"
    },
    {
      title: "New Arrivals",
      handle: "new-arrivals"
    },
    {
      title: "Best Sellers",
      handle: "best-sellers"
    },
    {
      title: "Sale",
      handle: "sale"
    },
    {
      title: "Featured Products",
      handle: "featured-products"
    }
  ]
  
  const collections: any[] = []
  for (const collection of collectionData) {
    try {
      const created = await productService.createProductCollections([collection])
      collections.push(created[0])
    } catch (error) {
      console.log(`Collection ${collection.handle} already exists, skipping...`)
      // Try to get existing collection
      const [existing] = await productService.listProductCollections({ handle: collection.handle })
      if (existing) {
        collections.push(existing)
      }
    }
  }
  console.log(`✅ Created/found ${collections.length} collections`)

  // Get existing categories from base seed
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  console.log(`📋 Found ${categories.length} existing categories`)

  // Create vendors
  const vendors = [
    {
      email: "urbanstyle@example.com",
      name: "Urban Style Shop",
      type: "shop",
      description: "Trendy fashion and lifestyle products",
      commission_rate: 20, // Silver tier
      is_active: true,
      website: "https://urbanstyle.example.com",
      metadata: {
        business_address: "123 Fashion St, New York, NY 10001",
        phone: "+1-555-0123",
      }
    },
    {
      email: "techbrand@example.com",
      name: "TechBrand Electronics",
      type: "brand",
      description: "Premium electronics and gadgets",
      commission_rate: 10, // Brand rate
      is_active: true,
      website: "https://techbrand.example.com",
      metadata: {
        business_address: "456 Tech Ave, San Francisco, CA 94105",
        phone: "+1-555-0456",
      }
    },
    {
      email: "quickship@example.com",
      name: "QuickShip Logistics",
      type: "distributor",
      description: "Fast and reliable fulfillment services",
      commission_rate: 5, // Distributor rate
      is_active: true,
      website: "https://quickship.example.com",
      metadata: {
        business_address: "789 Warehouse Blvd, Chicago, IL 60601",
        phone: "+1-555-0789",
        warehouse_locations: ["Chicago", "Los Angeles", "Miami"],
      }
    },
    {
      email: "greengardens@example.com",
      name: "Green Gardens",
      type: "shop",
      description: "Organic home and garden products",
      commission_rate: 15, // Bronze tier
      is_active: true,
      website: "https://greengardens.example.com",
      metadata: {
        business_address: "321 Garden Way, Portland, OR 97201",
        phone: "+1-555-0321",
      }
    }
  ]

  const createdVendors: any[] = []
  for (const vendorData of vendors) {
    try {
      const vendor = await marketplaceService.createVendor(vendorData)
      createdVendors.push(vendor)
      console.log(`✅ Created vendor: ${vendor.name}`)
      
      // Create vendor admin
      try {
        await marketplaceService.createVendorAdmin({
          vendor_id: vendor.id,
          email: vendorData.email,
          first_name: vendorData.name.split(' ')[0],
          last_name: vendorData.name.split(' ').slice(1).join(' ') || 'Admin',
          is_active: true
        })
        console.log(`✅ Created vendor admin for: ${vendor.name}`)
      } catch (adminError) {
        console.log(`Vendor admin for ${vendorData.email} already exists`)
      }
    } catch (error) {
      console.log(`Vendor ${vendorData.email} already exists, skipping...`)
      // Get existing vendor
      try {
        const [existing] = await marketplaceService.listVendors({ email: vendorData.email })
        if (existing) {
          createdVendors.push(existing)
        }
      } catch (e) {
        console.log(`Could not retrieve vendor ${vendorData.email}`)
      }
    }
  }

  // Create sample products for each vendor
  const productTemplates = [
    // Urban Style Shop products
    {
      vendor_index: 0,
      products: [
        {
          title: "Premium Cotton T-Shirt",
          description: "Comfortable 100% organic cotton t-shirt",
          handle: "premium-cotton-tshirt",
          status: "published" as any,
          type_id: productTypes.find((t: any) => t.value === "Clothing")?.id,
          collection_id: collections.find((c: any) => c.handle === "summer-collection")?.id,
          category_ids: categories.filter((c: any) => c.name === "Shirts").map((c: any) => c.id),
          variants: [
            { title: "Small", sku: "TSHIRT-S", prices: [{ amount: 2999, currency_code: "usd" }], inventory_quantity: 50 },
            { title: "Medium", sku: "TSHIRT-M", prices: [{ amount: 2999, currency_code: "usd" }], inventory_quantity: 75 },
            { title: "Large", sku: "TSHIRT-L", prices: [{ amount: 2999, currency_code: "usd" }], inventory_quantity: 60 },
          ]
        },
        {
          title: "Designer Denim Jeans",
          description: "Classic fit denim jeans with modern styling",
          handle: "designer-denim-jeans",
          status: "published" as any,
          type_id: productTypes.find((t: any) => t.value === "Clothing")?.id,
          collection_id: collections.find((c: any) => c.handle === "new-arrivals")?.id,
          category_ids: categories.filter((c: any) => c.name === "Pants").map((c: any) => c.id),
          variants: [
            { title: "30x32", sku: "JEANS-30-32", prices: [{ amount: 8999, currency_code: "usd" }], inventory_quantity: 30 },
            { title: "32x32", sku: "JEANS-32-32", prices: [{ amount: 8999, currency_code: "usd" }], inventory_quantity: 40 },
            { title: "34x32", sku: "JEANS-34-32", prices: [{ amount: 8999, currency_code: "usd" }], inventory_quantity: 35 },
          ]
        }
      ]
    },
    // TechBrand Electronics products
    {
      vendor_index: 1,
      products: [
        {
          title: "Wireless Noise-Canceling Headphones",
          description: "Premium audio experience with active noise cancellation",
          handle: "wireless-nc-headphones",
          status: "published" as any,
          type_id: productTypes.find((t: any) => t.value === "Electronics")?.id,
          collection_id: collections.find((c: any) => c.handle === "best-sellers")?.id,
          variants: [
            { title: "Black", sku: "WH-NC-BLK", prices: [{ amount: 34999, currency_code: "usd" }], inventory_quantity: 100 },
            { title: "Silver", sku: "WH-NC-SLV", prices: [{ amount: 34999, currency_code: "usd" }], inventory_quantity: 80 },
          ]
        },
        {
          title: "4K Webcam Pro",
          description: "Professional 4K webcam for streaming and video calls",
          handle: "4k-webcam-pro",
          status: "published" as any,
          type_id: productTypes.find((t: any) => t.value === "Electronics")?.id,
          collection_id: collections.find((c: any) => c.handle === "featured-products")?.id,
          variants: [
            { title: "Standard", sku: "WEBCAM-4K", prices: [{ amount: 19999, currency_code: "usd" }], inventory_quantity: 150 },
          ]
        },
        {
          title: "Smart Fitness Watch",
          description: "Track your health and fitness with style",
          handle: "smart-fitness-watch",
          status: "published" as any,
          type_id: productTypes.find((t: any) => t.value === "Electronics")?.id,
          collection_id: collections.find((c: any) => c.handle === "new-arrivals")?.id,
          category_ids: categories.filter((c: any) => c.name === "Merch").map((c: any) => c.id),
          variants: [
            { title: "Black", sku: "WATCH-FIT-BLK", prices: [{ amount: 29999, currency_code: "usd" }], inventory_quantity: 120 },
            { title: "Rose Gold", sku: "WATCH-FIT-RG", prices: [{ amount: 32999, currency_code: "usd" }], inventory_quantity: 60 },
          ]
        }
      ]
    },
    // Green Gardens products
    {
      vendor_index: 3,
      products: [
        {
          title: "Organic Herb Garden Kit",
          description: "Start your own herb garden with this complete kit",
          handle: "organic-herb-garden-kit",
          status: "published" as any,
          type_id: productTypes.find((t: any) => t.value === "Home & Garden")?.id,
          collection_id: collections.find((c: any) => c.handle === "featured-products")?.id,
          variants: [
            { title: "Basic Kit", sku: "HERB-KIT-BASIC", prices: [{ amount: 3999, currency_code: "usd" }], inventory_quantity: 200 },
            { title: "Deluxe Kit", sku: "HERB-KIT-DLX", prices: [{ amount: 5999, currency_code: "usd" }], inventory_quantity: 100 },
          ]
        },
        {
          title: "Bamboo Plant Stakes Set",
          description: "Eco-friendly bamboo stakes for plant support",
          handle: "bamboo-plant-stakes",
          status: "published" as any,
          type_id: productTypes.find((t: any) => t.value === "Home & Garden")?.id,
          collection_id: collections.find((c: any) => c.handle === "sale")?.id,
          variants: [
            { title: "Pack of 25", sku: "STAKES-25", prices: [{ amount: 1999, currency_code: "usd" }], inventory_quantity: 300 },
            { title: "Pack of 50", sku: "STAKES-50", prices: [{ amount: 3499, currency_code: "usd" }], inventory_quantity: 150 },
          ]
        }
      ]
    }
  ]

  // Create products
  for (const template of productTemplates) {
    const vendor = createdVendors[template.vendor_index]
    
    for (const productData of template.products) {
      try {
        // Create product with vendor metadata
        const [product] = await productService.createProducts([{
          ...productData,
          metadata: {
            vendor_id: vendor.id,
            vendor_name: vendor.name,
            vendor_type: vendor.type,
          }
        }])
        
        // Create vendor product link
        try {
          await marketplaceService.createVendorProduct({
            vendor_id: vendor.id,
            product_id: product.id,
            commission_rate: vendor.commission_rate,
            is_active: true
          })
          console.log(`✅ Created product: ${product.title} for ${vendor.name}`)
        } catch (linkError) {
          console.log(`Failed to link product ${product.title} to vendor: ${linkError.message}`)
        }
      } catch (error) {
        console.log(`Product ${productData.handle} already exists, skipping...`)
      }
    }
  }

  // Create sample customers
  const customers = [
    {
      email: "john.doe@example.com",
      first_name: "John",
      last_name: "Doe",
      has_account: true,
    },
    {
      email: "jane.smith@example.com",
      first_name: "Jane",
      last_name: "Smith",
      has_account: true,
    },
    {
      email: "bob.wilson@example.com",
      first_name: "Bob",
      last_name: "Wilson",
      has_account: true,
    }
  ]

  const createdCustomers: any[] = []
  for (const customerData of customers) {
    try {
      const [customer] = await customerService.createCustomers([customerData])
      createdCustomers.push(customer)
      console.log(`✅ Created customer: ${customer.email}`)
    } catch (error) {
      console.log(`Customer ${customerData.email} already exists, skipping...`)
      // Try to retrieve existing customer
      try {
        const { data: existingCustomers } = await query.graph({
          entity: "customer",
          fields: ["*"],
          filters: { email: customerData.email }
        })
        if (existingCustomers.length > 0) {
          createdCustomers.push(existingCustomers[0])
        }
      } catch (e) {
        console.log(`Could not retrieve customer ${customerData.email}`)
      }
    }
  }
  
  // Create sample orders
  console.log("📦 Creating sample orders...")
  
  const orderService = container.resolve(Modules.ORDER)
  const cartService = container.resolve(Modules.CART)
  
  // Create orders for customers
  for (let i = 0; i < Math.min(createdCustomers.length, 2); i++) {
    const customer = createdCustomers[i]
    try {
      // Create a simple order
      const orderId = `order_${Date.now()}_${i}`
      const orderData = {
        id: orderId,
        status: i === 0 ? "pending" : "completed",
        email: customer.email,
        customer_id: customer.id,
        region_id: region.id,
        currency_code: region.currency_code,
        sales_channel_id: (await query.graph({
          entity: "sales_channel",
          fields: ["id"],
          filters: { name: "Default Sales Channel" }
        })).data[0]?.id,
        metadata: {
          source: "marketplace_seed",
          vendor_orders: createdVendors.slice(0, 2).map(v => ({
            vendor_id: v.id,
            vendor_name: v.name
          }))
        }
      }
      
      await orderService.createOrders(orderData)
      console.log(`✅ Created order for: ${customer.email}`)
    } catch (error) {
      console.log(`Could not create order for ${customer.email}: ${error.message}`)
    }
  }

  // Create age-restricted products
  const ageVerificationService = container.resolve("age_verification")
  
  const ageRestrictedProducts = [
    {
      product_id: "prod_01JFKA8Y3RJ3XQZGFKPJ5H5XGH", // This would be a real product ID
      minimum_age: 21,
      restriction_reason: "alcohol",
      compliance_category: "alcohol",
      age_gate_message: "This product contains alcohol and requires age verification (21+)",
      restricted_states: ["UT", "PA"], // Some states have special rules
    },
    {
      product_id: "prod_01JFKA8Y3RJ3XQZGFKPJ5H5XGI", // Another product ID
      minimum_age: 18,
      restriction_reason: "tobacco",
      compliance_category: "tobacco",
      age_gate_message: "This product contains tobacco and requires age verification (18+)",
      requires_id_check: true,
    }
  ]
  
  for (const restrictedProduct of ageRestrictedProducts) {
    try {
      await ageVerificationService.createAgeRestrictedProduct(restrictedProduct)
      console.log(`✅ Created age restriction for product: ${restrictedProduct.product_id}`)
    } catch (error) {
      console.log(`Age restriction for ${restrictedProduct.product_id} already exists or product not found`)
    }
  }

  console.log("✨ Marketplace seeding completed!")
}