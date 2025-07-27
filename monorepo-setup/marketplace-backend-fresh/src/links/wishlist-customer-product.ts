import WishlistModule from "../modules/wishlist"
import CustomerModule from "@medusajs/medusa/customer"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

// Link wishlist items to customers
export const wishlistCustomerLink = defineLink(
  WishlistModule.linkable.wishlistItem,
  CustomerModule.linkable.customer
)

// Link wishlist items to products
export const wishlistProductLink = defineLink(
  WishlistModule.linkable.wishlistItem,
  ProductModule.linkable.product
)