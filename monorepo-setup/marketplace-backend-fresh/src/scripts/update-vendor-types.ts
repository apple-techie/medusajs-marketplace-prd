import { MedusaContainer } from "@medusajs/framework/types"
import { VendorType } from "../modules/marketplace/models/vendor"

export default async function updateVendorTypes({ container }: { container: MedusaContainer }) {
  console.log("🔧 Updating vendor types...")
  
  const marketplaceService = container.resolve("marketplace")
  
  try {
    const vendors = await marketplaceService.listVendors()
    console.log(`📦 Found ${vendors.length} vendors to update`)
    
    for (const vendor of vendors) {
      let vendorType: VendorType | null = null
      
      // Determine type based on name
      if (vendor.name.includes('Shop') || vendor.name.includes('E-Cig City')) {
        vendorType = VendorType.SHOP
      } else if (vendor.name.includes('Brand') || vendor.name.includes('Electronics') || vendor.name.includes('Gardens')) {
        vendorType = VendorType.BRAND
      } else if (vendor.name.includes('Ship') || vendor.name.includes('Logistics')) {
        vendorType = VendorType.DISTRIBUTOR
      }
      
      if (vendorType && vendor.type !== vendorType && vendor.id) {
        console.log(`   Updating ${vendor.name} (${vendor.id}) from ${vendor.type || 'null'} to ${vendorType}`)
        try {
          await marketplaceService.updateVendor(vendor.id, { type: vendorType })
          console.log(`   ✅ Updated successfully`)
        } catch (error) {
          console.error(`   ❌ Failed to update: ${error.message}`)
        }
      } else if (!vendor.id) {
        console.error(`   ❌ Skipping ${vendor.name}: No ID found`)
      }
    }
    
    // Verify the updates
    console.log("\n📊 Verification:")
    const updatedVendors = await marketplaceService.listVendors()
    updatedVendors.forEach(v => {
      console.log(`   ${v.name}: ${v.type || 'NOT SET'}`)
    })
    
    console.log("\n✅ Vendor types update completed!")
  } catch (error) {
    console.error("❌ Error updating vendor types:", error.message)
  }
}