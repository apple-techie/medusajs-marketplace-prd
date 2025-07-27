import { ExecArgs } from "@medusajs/framework/types"
import bcrypt from "bcrypt"
import { MARKETPLACE_MODULE } from "../modules/marketplace"

export default async function createVendorAdmin({ container }: ExecArgs) {
  const marketplaceService = container.resolve(MARKETPLACE_MODULE)
  
  try {
    // First create a test vendor if it doesn't exist
    let vendor
    const vendors = await marketplaceService.listVendors()
    
    // Look for existing test vendor
    const existingVendor = vendors.find(v => v.name === "Test Shop Partner")
    
    if (!existingVendor) {
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
      console.log("✅ Created test vendor:", vendor.name)
    } else {
      vendor = existingVendor
      console.log("✅ Using existing vendor:", vendor.name)
    }
    
    // Check if vendor admin already exists
    const existingAdmins = await marketplaceService.listVendorAdmins()
    const existingAdmin = existingAdmins.find(admin => 
      admin.email === "vendor@example.com" && admin.vendor_id === vendor.id
    )
    
    if (existingAdmin) {
      console.log("✅ Vendor admin already exists with email: vendor@example.com")
      console.log("   Password: vendor123")
      return
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash("vendor123", 10)
    
    // Create vendor admin
    const vendorAdmin = await marketplaceService.createVendorAdmins({
      vendor_id: vendor.id,
      email: "vendor@example.com",
      password_hash: hashedPassword,
      first_name: "Test",
      last_name: "Vendor",
      is_active: true,
      role: "admin"
    })
    
    console.log("✅ Created vendor admin:")
    console.log("   Email: vendor@example.com")
    console.log("   Password: vendor123")
    console.log("   Vendor Type:", vendor.type)
    console.log("   Vendor ID:", vendor.id)
    
  } catch (error) {
    console.error("❌ Error creating vendor admin:", error)
    throw error
  }
}