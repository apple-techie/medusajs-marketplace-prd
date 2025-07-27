import { MedusaService } from "@medusajs/framework/utils"
import { WishlistItem } from "./models/wishlist-item"

export class WishlistModuleService extends MedusaService({
  WishlistItem,
}) {
  async getCustomerWishlist(customerId: string) {
    const wishlistItems = await this.listWishlistItems({
      customer_id: customerId,
    } as any)
    
    return wishlistItems
  }

  async addToWishlist(customerId: string, productId: string) {
    // Check if already exists
    const existing = await this.listWishlistItems({
      customer_id: customerId,
      product_id: productId,
    } as any)

    if (existing.length > 0) {
      return existing[0]
    }

    return await this.createWishlistItems({
      customer_id: customerId,
      product_id: productId,
    })
  }

  async removeFromWishlist(customerId: string, productId: string) {
    const items = await this.listWishlistItems({
      customer_id: customerId,
      product_id: productId,
    } as any)

    if (items.length > 0) {
      await this.deleteWishlistItems(items[0].id)
    }
  }
}