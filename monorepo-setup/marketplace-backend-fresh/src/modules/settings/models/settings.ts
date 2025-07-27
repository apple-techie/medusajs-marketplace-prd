import { model } from "@medusajs/framework/utils"

export const Settings = model.define("settings", {
  id: model.id().primaryKey(),
  key: model.text().unique(),
  value: model.json(),
})