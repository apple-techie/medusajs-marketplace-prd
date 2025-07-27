import { 
  MedusaContainer,
} from "@medusajs/framework/types"

export default async function seedVendorTypes({ container }: { container: MedusaContainer }) {
  const marketplaceService = container.resolve("marketplace")

  console.log("🌱 Seeding vendor types for testing...")

  // Create vendors of each type
  const vendors = [
    // Shop Partners
    {
      email: "premium.smoke@example.com",
      name: "Premium Smoke Shop",
      type: "shop",
      description: "Premium smoking accessories and lifestyle products",
      commission_rate: 15, // Bronze tier
      is_active: true,
      website: "https://premiumsmoke.example.com",
      stripe_account_id: null,
      metadata: {
        business_address: "123 Smoke St, Denver, CO 80202",
        phone: "+1-555-0111",
        store_hours: "Mon-Sat 10AM-8PM, Sun 12PM-6PM",
        tier: "bronze"
      }
    },
    {
      email: "cloud9.vapes@example.com",
      name: "Cloud 9 Vapes & More",
      type: "shop",
      description: "Vaping products and accessories",
      commission_rate: 20, // Silver tier
      is_active: true,
      website: "https://cloud9vapes.example.com",
      stripe_account_id: null,
      metadata: {
        business_address: "456 Vape Ave, Los Angeles, CA 90028",
        phone: "+1-555-0222",
        store_hours: "Daily 9AM-10PM",
        tier: "silver"
      }
    },
    {
      email: "green.leaf@example.com",
      name: "Green Leaf Emporium",
      type: "shop",
      description: "Organic and natural smoking products",
      commission_rate: 25, // Gold tier
      is_active: true,
      website: "https://greenleaf.example.com",
      stripe_account_id: null,
      metadata: {
        business_address: "789 Leaf Blvd, Portland, OR 97201",
        phone: "+1-555-0333",
        store_hours: "Mon-Sun 10AM-9PM",
        tier: "gold"
      }
    },
    
    // Brand Partners
    {
      email: "glassart@example.com",
      name: "GlassArt Creations",
      type: "brand",
      description: "Premium handcrafted glass products",
      commission_rate: 10, // Fixed brand rate
      is_active: true,
      website: "https://glassart.example.com",
      stripe_account_id: null,
      metadata: {
        business_address: "321 Artist Way, Seattle, WA 98101",
        phone: "+1-555-0444",
        established: "2015",
        product_categories: ["glass", "accessories", "art"]
      }
    },
    {
      email: "vapetek@example.com",
      name: "VapeTek Industries",
      type: "brand",
      description: "Innovative vaping technology and devices",
      commission_rate: 10, // Fixed brand rate
      is_active: true,
      website: "https://vapetek.example.com",
      stripe_account_id: null,
      metadata: {
        business_address: "654 Tech Plaza, San Francisco, CA 94105",
        phone: "+1-555-0555",
        established: "2018",
        product_categories: ["vaporizers", "electronics", "accessories"]
      }
    },
    {
      email: "organic.papers@example.com",
      name: "Organic Papers Co.",
      type: "brand",
      description: "Eco-friendly rolling papers and accessories",
      commission_rate: 10, // Fixed brand rate
      is_active: true,
      website: "https://organicpapers.example.com",
      stripe_account_id: null,
      metadata: {
        business_address: "987 Eco Drive, Boulder, CO 80301",
        phone: "+1-555-0666",
        established: "2020",
        product_categories: ["papers", "filters", "accessories"]
      }
    },
    
    // Distributor Partners
    {
      email: "express.fulfillment@example.com",
      name: "Express Fulfillment Services",
      type: "distributor",
      description: "Fast same-day delivery and fulfillment",
      commission_rate: 5, // Fixed distributor rate
      is_active: true,
      website: "https://expressfulfillment.example.com",
      stripe_account_id: null,
      metadata: {
        business_address: "111 Warehouse Way, Chicago, IL 60601",
        phone: "+1-555-0777",
        warehouse_locations: ["Chicago", "Milwaukee", "Detroit"],
        delivery_radius: "50 miles",
        fleet_size: "25 vehicles"
      }
    },
    {
      email: "west.coast.logistics@example.com",
      name: "West Coast Logistics",
      type: "distributor",
      description: "Regional distribution across the West Coast",
      commission_rate: 5, // Fixed distributor rate
      is_active: true,
      website: "https://westcoastlogistics.example.com",
      stripe_account_id: null,
      metadata: {
        business_address: "222 Distribution Dr, Los Angeles, CA 90040",
        phone: "+1-555-0888",
        warehouse_locations: ["Los Angeles", "San Diego", "Las Vegas"],
        delivery_radius: "100 miles",
        fleet_size: "50 vehicles"
      }
    },
    {
      email: "nationwide.delivery@example.com",
      name: "Nationwide Delivery Network",
      type: "distributor",
      description: "Cross-country shipping and fulfillment",
      commission_rate: 5, // Fixed distributor rate
      is_active: true,
      website: "https://nationwidedelivery.example.com",
      stripe_account_id: null,
      metadata: {
        business_address: "333 Logistics Ln, Dallas, TX 75201",
        phone: "+1-555-0999",
        warehouse_locations: ["Dallas", "Atlanta", "Phoenix", "Denver"],
        delivery_radius: "Nationwide",
        fleet_size: "100+ vehicles"
      }
    }
  ]

  const createdVendors: any[] = []
  for (const vendorData of vendors) {
    try {
      const vendor = await marketplaceService.createVendor(vendorData)
      createdVendors.push(vendor)
      console.log(`✅ Created vendor: ${vendor.name} (${vendor.type})`)
      
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
        console.log(`   Email: ${vendorData.email}`)
        console.log(`   Password: medusa123 (default)`)
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

  // Create fulfillment locations for distributor partners
  console.log("\n📍 Creating fulfillment locations for distributors...")
  
  const distributorVendors = createdVendors.filter(v => v.type === 'distributor')
  
  for (const distributor of distributorVendors) {
    const warehouseLocations = distributor.metadata?.warehouse_locations || []
    
    for (const location of warehouseLocations) {
      try {
        const fulfillmentLocation = await marketplaceService.createFulfillmentLocation({
          vendor_id: distributor.id,
          name: `${distributor.name} - ${location}`,
          address: {
            city: location,
            country_code: "US"
          },
          is_active: true,
          metadata: {
            type: "warehouse",
            capacity: "high"
          }
        })
        console.log(`✅ Created fulfillment location: ${fulfillmentLocation.name}`)
      } catch (error) {
        console.log(`Fulfillment location for ${distributor.name} - ${location} already exists`)
      }
    }
  }

  console.log("\n🎉 Vendor type seeding complete!")
  console.log("\n📝 Test Credentials:")
  console.log("All vendor accounts use password: medusa123")
  console.log("\nShop Partners:")
  console.log("- premium.smoke@example.com (Bronze tier - 15% commission)")
  console.log("- cloud9.vapes@example.com (Silver tier - 20% commission)")
  console.log("- green.leaf@example.com (Gold tier - 25% commission)")
  console.log("\nBrand Partners:")
  console.log("- glassart@example.com (Fixed 10% commission)")
  console.log("- vapetek@example.com (Fixed 10% commission)")
  console.log("- organic.papers@example.com (Fixed 10% commission)")
  console.log("\nDistributor Partners:")
  console.log("- express.fulfillment@example.com (Fixed 5% commission)")
  console.log("- west.coast.logistics@example.com (Fixed 5% commission)")
  console.log("- nationwide.delivery@example.com (Fixed 5% commission)")
  
  return createdVendors
}