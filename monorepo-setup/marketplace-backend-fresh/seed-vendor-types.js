import seedVendorTypes from "./dist/scripts/seed-vendor-types.js"
import { getContainer } from "@medusajs/framework"

const container = await getContainer()

await seedVendorTypes({ container })
  .then(() => {
    console.log("✅ Vendor type seeding completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Error seeding vendor types:", error)
    process.exit(1)
  })