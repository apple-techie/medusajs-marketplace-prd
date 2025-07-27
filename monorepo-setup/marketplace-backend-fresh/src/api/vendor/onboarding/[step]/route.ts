import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { authenticate } from "../../../../utils/vendor-auth"

// POST /vendor/onboarding/:step - Complete a specific onboarding step
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorAuth = await authenticate(req, res)
  if (!vendorAuth) return
  
  const marketplaceService = req.scope.resolve("marketplace")
  const step = req.params.step
  
  try {
    const onboardingStatus = await marketplaceService.completeOnboardingStep(
      vendorAuth.vendor.id,
      step,
      req.body
    )
    
    res.json({
      onboarding: onboardingStatus,
      message: `Step '${step}' completed successfully`
    })
  } catch (error) {
    res.status(500).json({
      message: `Failed to complete step '${step}'`,
      error: error.message
    })
  }
}