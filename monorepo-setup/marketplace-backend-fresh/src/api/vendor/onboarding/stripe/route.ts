import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { authenticate } from "../../../../utils/vendor-auth"

// GET /vendor/onboarding/stripe - Get Stripe Connect onboarding link
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorAuth = await authenticate(req, res)
  if (!vendorAuth) return
  
  const marketplaceService = req.scope.resolve("marketplace")
  
  try {
    const onboardingLink = await marketplaceService.getStripeOnboardingLink(
      vendorAuth.vendor.id
    )
    
    res.json({
      stripe_onboarding_url: onboardingLink,
      vendor_id: vendorAuth.vendor.id
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to get Stripe onboarding link",
      error: error.message
    })
  }
}