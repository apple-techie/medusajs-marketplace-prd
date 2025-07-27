import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { authenticate } from "../../../utils/vendor-auth"

// GET /vendor/stripe-dashboard - Get Stripe Express Dashboard link
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorAuth = await authenticate(req, res)
  if (!vendorAuth) return
  
  const marketplaceService = req.scope.resolve("marketplace")
  
  try {
    // Check if vendor has completed Stripe onboarding
    if (!vendorAuth.vendor.stripe_onboarding_completed) {
      return res.status(400).json({
        message: "Stripe onboarding not completed",
        onboarding_required: true
      })
    }
    
    const loginLink = await marketplaceService.getVendorStripeDashboard(
      vendorAuth.vendor.id
    )
    
    res.json({
      stripe_dashboard_url: loginLink.url,
      created: loginLink.created,
      expires_at: new Date(loginLink.created * 1000 + 15 * 60 * 1000) // Link expires in 15 minutes
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to get Stripe dashboard link",
      error: error.message
    })
  }
}