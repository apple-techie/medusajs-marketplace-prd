import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { authenticate } from "../../../../../utils/vendor-auth"

// POST /vendor/onboarding/stripe/return - Handle return from Stripe Connect
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorAuth = await authenticate(req, res)
  if (!vendorAuth) return
  
  const marketplaceService = req.scope.resolve("marketplace")
  
  try {
    const onboardingStatus = await marketplaceService.handleStripeReturn(
      vendorAuth.vendor.id
    )
    
    res.json({
      onboarding: onboardingStatus,
      message: "Stripe Connect status updated",
      vendor_active: onboardingStatus.overall_status === "completed"
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to handle Stripe return",
      error: error.message
    })
  }
}