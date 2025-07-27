import { ExecArgs } from "@medusajs/framework/types"
import bcrypt from "bcrypt"
import { MARKETPLACE_MODULE } from "../modules/marketplace"

export default async function testVendorLogin({ container }: ExecArgs) {
  const marketplaceService = container.resolve(MARKETPLACE_MODULE)
  
  try {
    console.log("🔍 Testing vendor login credentials...")
    
    // List all vendor admins
    const vendorAdmins = await marketplaceService.listVendorAdmins()
    console.log(`\n📋 Found ${vendorAdmins.length} vendor admin(s):\n`)
    
    for (const admin of vendorAdmins) {
      console.log(`Email: ${admin.email}`)
      console.log(`Vendor ID: ${admin.vendor_id}`)
      console.log(`Active: ${admin.is_active}`)
      
      // Test password
      const testPassword = "vendor123"
      if (admin.password_hash) {
        const isValid = await bcrypt.compare(testPassword, admin.password_hash)
        console.log(`Password "vendor123" valid: ${isValid}`)
      } else {
        console.log("No password hash found!")
      }
      
      // Get vendor info
      try {
        const vendor = await marketplaceService.retrieveVendor(admin.vendor_id)
        console.log(`Vendor Name: ${vendor.name}`)
        console.log(`Vendor Type: ${vendor.type}`)
        console.log(`Vendor Email: ${vendor.email}`)
      } catch (e) {
        console.log(`Could not retrieve vendor: ${e.message}`)
      }
      
      console.log("---")
    }
    
  } catch (error) {
    console.error("❌ Error:", error)
    throw error
  }
}