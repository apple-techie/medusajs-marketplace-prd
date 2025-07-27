import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { authenticate } from "../../../utils/vendor-auth"

// GET /vendor/onboarding - Get onboarding status
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorAuth = await authenticate(req, res)
  if (!vendorAuth) return
  
  const marketplaceService = req.scope.resolve("marketplace")
  
  try {
    const onboardingStatus = await marketplaceService.getVendorOnboardingStatus(
      vendorAuth.vendor.id
    )
    
    res.json({
      onboarding: onboardingStatus
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to get onboarding status",
      error: error.message
    })
  }
}

// POST /vendor/onboarding - Start onboarding
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorAuth = await authenticate(req, res)
  if (!vendorAuth) return
  
  const marketplaceService = req.scope.resolve("marketplace")
  
  try {
    const onboardingStatus = await marketplaceService.startVendorOnboarding(
      vendorAuth.vendor.id
    )
    
    res.json({
      onboarding: onboardingStatus,
      message: "Onboarding started successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to start onboarding",
      error: error.message
    })
  }
}