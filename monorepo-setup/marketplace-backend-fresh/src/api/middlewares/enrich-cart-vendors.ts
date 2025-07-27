import { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

/**
 * Middleware to enrich cart responses with vendor information
 */
export async function enrichCartWithVendors(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  // Store the original json method
  const originalJson = res.json.bind(res)
  
  // Override the json method
  res.json = function(data: any): MedusaResponse {
    // Check if the response contains a cart
    if (data && data.cart && data.cart.items && data.cart.items.length > 0) {
      const marketplaceService = req.scope.resolve("marketplace")
      
      // Enrich the cart with vendor data
      marketplaceService.enrichCartWithVendorData(data.cart)
        .then(enrichedCart => {
          data.cart = enrichedCart
          originalJson(data)
        })
        .catch(error => {
          console.error("Failed to enrich cart with vendor data:", error)
          // If enrichment fails, return the original cart
          originalJson(data)
        })
    } else {
      // If no cart in response, return as is
      originalJson(data)
    }
    return res
  }
  
  next()
}