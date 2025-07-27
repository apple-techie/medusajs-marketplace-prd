import MarketplaceModule from "../modules/marketplace"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: MarketplaceModule.linkable.vendor,
    isList: true,
  },
  ProductModule.linkable.product
)