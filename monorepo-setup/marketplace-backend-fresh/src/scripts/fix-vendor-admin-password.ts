import { ExecArgs } from "@medusajs/framework/types"
import bcrypt from "bcrypt"
import { MARKETPLACE_MODULE } from "../modules/marketplace"

export default async function fixVendorAdminPassword({ container }: ExecArgs) {
  const marketplaceService = container.resolve(MARKETPLACE_MODULE)
  
  try {
    console.log("🔧 Fixing vendor admin password...")
    
    // Find the vendor admin
    const vendorAdmins = await marketplaceService.listVendorAdmins()
    const vendorAdmin = vendorAdmins.find(admin => admin.email === "vendor@example.com")
    
    if (!vendorAdmin) {
      console.log("❌ No vendor admin found with email vendor@example.com")
      return
    }
    
    console.log(`✅ Found vendor admin: ${vendorAdmin.email}`)
    console.log(`   ID: ${vendorAdmin.id}`)
    
    if (!vendorAdmin.id) {
      console.log("❌ Vendor admin has no ID. Need to recreate it.")
      
      // Delete the existing one
      await marketplaceService.deleteVendorAdmins(vendorAdmin.id || vendorAdmin.email)
      
      // Create a new one with password
      const hashedPassword = await bcrypt.hash("vendor123", 10)
      const newAdmin = await marketplaceService.createVendorAdmins({
        vendor_id: vendorAdmin.vendor_id,
        email: "vendor@example.com",
        password_hash: hashedPassword,
        first_name: "Test",
        last_name: "Vendor",
        is_active: true,
        role: "admin"
      })
      
      console.log("✅ Created new vendor admin with password!")
      return
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash("vendor123", 10)
    
    // Update the vendor admin with password hash
    await marketplaceService.updateVendorAdmins(vendorAdmin.id, {
      password_hash: hashedPassword,
      is_active: true,
      role: "admin"
    })
    
    console.log("✅ Password updated successfully!")
    console.log("   Email: vendor@example.com")
    console.log("   Password: vendor123")
    
  } catch (error) {
    console.error("❌ Error:", error)
    throw error
  }
}