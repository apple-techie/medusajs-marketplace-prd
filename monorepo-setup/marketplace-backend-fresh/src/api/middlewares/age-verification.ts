import { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework"
import { AgeVerificationHelper } from "../../services/age-verification-helper"

export async function checkAgeVerification(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  // Only check for checkout-related endpoints
  const checkoutPaths = [
    "/store/carts/complete",
    "/store/payment-sessions",
    "/store/checkout",
  ]
  
  const shouldCheck = checkoutPaths.some(path => req.path.includes(path))
  
  if (!shouldCheck) {
    return next()
  }
  
  // Get cart ID from request
  const cartId = req.params.id || (req.body as any)?.cart_id
  
  if (!cartId) {
    return next()
  }
  
  try {
    // Use age verification helper service
    const ageVerificationHelper = new AgeVerificationHelper(req.scope)
    const result = await ageVerificationHelper.verifyCartAge({
      cart_id: cartId,
      customer_id: req.session?.customer_id,
      session_token: req.headers["x-age-verification-token"] as string,
    })
    
    if (result.requires_verification) {
      return res.status(403).json({
        message: "Age verification required",
        error: "AGE_VERIFICATION_REQUIRED",
        minimum_age: result.minimum_age,
        requires_id_check: result.requires_id_check,
        restricted_products: result.restricted_products,
      })
    }
    
    // Add verification status to request for downstream use
    (req as any).ageVerified = result.verified
    
    next()
  } catch (error) {
    console.error("Age verification check failed:", error)
    // Allow checkout to proceed if verification system fails
    next()
  }
}

// Export middleware configuration
export const config = {
  routes: [
    {
      matcher: "/store/carts/:id/complete",
      middlewares: [checkAgeVerification],
    },
    {
      matcher: "/store/payment-sessions",
      middlewares: [checkAgeVerification],
    },
  ],
}