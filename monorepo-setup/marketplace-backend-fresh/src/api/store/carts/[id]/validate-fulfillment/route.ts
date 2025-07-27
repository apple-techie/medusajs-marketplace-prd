import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

// POST /store/carts/:id/validate-fulfillment - Validate that cart can be fulfilled
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cartId = req.params.id
  const cartService = req.scope.resolve(Modules.CART)
  const marketplaceService = req.scope.resolve("marketplace")
  
  try {
    // Retrieve the cart
    const cart = await cartService.retrieveCart(cartId, {
      relations: ["items", "items.product", "items.variant"]
    })
    
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      })
    }
    
    // Validate fulfillment
    const isValid = await marketplaceService.validateCartFulfillment(cart)
    
    res.json({
      cart_id: cartId,
      fulfillment_valid: isValid,
      message: isValid ? "All items can be fulfilled" : "Some items cannot be fulfilled"
    })
  } catch (error) {
    res.status(400).json({
      cart_id: cartId,
      fulfillment_valid: false,
      message: error.message
    })
  }
}