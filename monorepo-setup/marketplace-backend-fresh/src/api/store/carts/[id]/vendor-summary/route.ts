import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

// GET /store/carts/:id/vendor-summary - Get vendor breakdown for a cart
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cartId = req.params.id
  const cartService = req.scope.resolve(Modules.CART)
  const marketplaceService = req.scope.resolve("marketplace")
  
  try {
    // Retrieve the cart
    const cart = await cartService.retrieveCart(cartId, {
      relations: ["items", "items.product"]
    })
    
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      })
    }
    
    // Process the multi-vendor cart
    const multiVendorCart = await marketplaceService.processMultiVendorCart(cart)
    
    res.json({
      cart_id: multiVendorCart.cart_id,
      vendor_summary: {
        vendor_count: multiVendorCart.vendor_carts.length,
        vendors: multiVendorCart.vendor_carts.map(vc => ({
          vendor_id: vc.vendor_id,
          vendor_name: vc.vendor_name,
          vendor_type: vc.vendor_type,
          item_count: vc.items.length,
          subtotal: vc.subtotal,
          commission: vc.commission,
          vendor_payout: vc.vendor_total
        })),
        total_amount: multiVendorCart.total_amount,
        total_commission: multiVendorCart.total_commission,
        total_vendor_payout: multiVendorCart.total_vendor_payout
      }
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to process multi-vendor cart",
      error: error.message
    })
  }
}