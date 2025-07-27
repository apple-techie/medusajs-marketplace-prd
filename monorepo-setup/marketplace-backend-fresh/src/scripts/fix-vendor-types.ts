export default async function fixVendorTypes({ container }) {
  console.log("🔧 Fixing vendor types...")
  
  const query = container.resolve("query")
  
  try {
    // Get all vendors
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: ["*"]
    })
    
    console.log(`📦 Found ${vendors.length} vendors to update`)
    
    // Assign types based on vendor names/emails
    for (const vendor of vendors) {
      let vendorType: string | null = null
      
      // Determine type based on name or email patterns
      if (vendor.name.toLowerCase().includes('shop') || 
          vendor.name.toLowerCase().includes('style') ||
          vendor.name.toLowerCase().includes('e-cig city')) {
        vendorType = 'shop_partner'
      } else if (vendor.name.toLowerCase().includes('brand') || 
                 vendor.name.toLowerCase().includes('electronics') ||
                 vendor.name.toLowerCase().includes('wellness')) {
        vendorType = 'brand_partner'
      } else if (vendor.name.toLowerCase().includes('ship') || 
                 vendor.name.toLowerCase().includes('logistics') ||
                 vendor.name.toLowerCase().includes('distributor')) {
        vendorType = 'distributor_partner'
      } else if (vendor.name.toLowerCase().includes('garden')) {
        vendorType = 'brand_partner'
      }
      
      if (vendorType && vendor.vendor_type !== vendorType) {
        console.log(`   Updating ${vendor.name} to ${vendorType}`)
        
        // Update vendor type
        await query.graph({
          entity: "vendor",
          filters: { id: vendor.id },
          data: { vendor_type: vendorType }
        }, { 
          method: "update"
        })
      }
    }
    
    console.log("✅ Vendor types fixed successfully!")
  } catch (error) {
    console.error("❌ Error fixing vendor types:", error.message)
  }
}