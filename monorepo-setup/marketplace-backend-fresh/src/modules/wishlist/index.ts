import { Module } from "@medusajs/framework/utils"
import { WishlistModuleService } from "./service"
import { WishlistItem } from "./models/wishlist-item"

export const WISHLIST_MODULE = "wishlist"

const WishlistModule = Module(WISHLIST_MODULE, {
  service: WishlistModuleService,
})

export default WishlistModule

export const linkable = {
  wishlistItem: WishlistItem
}