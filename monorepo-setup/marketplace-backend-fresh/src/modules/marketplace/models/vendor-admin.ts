import { model } from "@medusajs/framework/utils"

const VendorAdmin = model.define("vendor_admin", {
  id: model.id().primaryKey(),
  first_name: model.text(),
  last_name: model.text(),
  email: model.text().unique(),
  vendor_id: model.text(),
})

export default VendorAdmin