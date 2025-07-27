import { MedusaContainer } from "@medusajs/framework/types"

export default async function fixVendorTypesSQL({ container }: { container: MedusaContainer }) {
  console.log("🔧 Fixing vendor types using direct SQL...")
  
  const knex = container.resolve("__pg_connection__")
  
  try {
    // First, let's see the current vendor data
    const vendors = await knex.raw(`
      SELECT id, name, type FROM vendor WHERE deleted_at IS NULL
    `)
    
    console.log(`📦 Found ${vendors.rows.length} vendors:`)
    vendors.rows.forEach(v => {
      console.log(`   ${v.name}: ${v.type || 'NULL'}`)
    })
    
    // Update Green Gardens to brand
    console.log("\n🔄 Updating vendor types...")
    
    const updates = [
      { name: 'Green Gardens', type: 'brand' },
      { name: 'TechBrand Electronics', type: 'brand' },
      { name: 'QuickShip Logistics', type: 'distributor' },
      { name: 'Urban Style Shop', type: 'shop' },
      { name: 'E-Cig City Upland', type: 'shop' }
    ]
    
    for (const update of updates) {
      const result = await knex.raw(`
        UPDATE vendor 
        SET type = ?::vendor_type, updated_at = NOW()
        WHERE name = ? AND deleted_at IS NULL
        RETURNING id, name, type
      `, [update.type, update.name])
      
      if (result.rows.length > 0) {
        console.log(`   ✅ Updated ${update.name} to ${update.type}`)
      } else {
        console.log(`   ⚠️  ${update.name} not found`)
      }
    }
    
    // Verify the updates
    console.log("\n📊 Verification:")
    const updatedVendors = await knex.raw(`
      SELECT id, name, type FROM vendor WHERE deleted_at IS NULL ORDER BY name
    `)
    
    updatedVendors.rows.forEach(v => {
      console.log(`   ${v.name}: ${v.type}`)
    })
    
    console.log("\n✅ Vendor types fixed successfully!")
  } catch (error) {
    console.error("❌ Error fixing vendor types:", error.message)
    console.error(error)
  }
}