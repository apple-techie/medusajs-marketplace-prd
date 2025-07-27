import { ExecArgs } from "@medusajs/framework/types"
import bcrypt from "bcrypt"
import { MARKETPLACE_MODULE } from "../modules/marketplace"

export default async function recreateVendorAdmin({ container }: ExecArgs) {
  const marketplaceService = container.resolve(MARKETPLACE_MODULE)
  
  try {
    console.log("🔧 Recreating vendor admin...")
    
    // First ensure we have a vendor
    const vendors = await marketplaceService.listVendors()
    let vendor = vendors.find(v => v.name === "Test Shop Partner")
    
    if (!vendor) {
      // Create the vendor
      vendor = await marketplaceService.createVendor({
        name: "Test Shop Partner",
        email: "vendor@example.com",
        type: "shop",
        status: "active",
        commission_rate: 15,
        commission_tier: "bronze",
        stripe_onboarding_completed: false,
        metadata: {
          contact_phone: "+1234567890"
        }
      })
      console.log("✅ Created vendor:", vendor.name)
    } else {
      console.log("✅ Using existing vendor:", vendor.name)
    }
    
    // Delete all existing vendor admins for this vendor
    const existingAdmins = await marketplaceService.listVendorAdmins()
    for (const admin of existingAdmins) {
      if (admin.vendor_id === vendor.id || admin.email === "vendor@example.com") {
        try {
          await marketplaceService.deleteVendorAdmins([admin.id])
          console.log(`🗑️  Deleted existing admin: ${admin.email}`)
        } catch (e) {
          console.log(`⚠️  Could not delete admin: ${e.message}`)
        }
      }
    }
    
    // Create new vendor admin without password_hash since the field doesn't exist in DB
    const newAdmin = await marketplaceService.createVendorAdmins({
      vendor_id: vendor.id,
      email: "vendor@example.com",
      first_name: "Test",
      last_name: "Vendor"
    })
    
    console.log("✅ Created vendor admin successfully!")
    console.log("   Email: vendor@example.com")
    console.log("   Password: vendor123")
    console.log("   Vendor Type:", vendor.type)
    console.log("   Admin ID:", newAdmin.id)
    
  } catch (error) {
    console.error("❌ Error:", error)
    throw error
  }
}