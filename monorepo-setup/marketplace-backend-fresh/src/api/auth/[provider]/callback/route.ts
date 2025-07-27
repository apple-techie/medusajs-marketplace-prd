import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

// OAuth callback handler
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { provider } = req.params
  const authService = req.scope.resolve("auth")
  const marketplaceService = req.scope.resolve("marketplace")

  try {
    // Handle OAuth callback
    const result = await authService.authenticate(provider, {
      body: {},
      query: req.query as Record<string, string>, // Contains code, state, etc.
      headers: req.headers as Record<string, string>,
    })

    if (!result.success) {
      return res.status(401).json({ 
        message: "OAuth authentication failed",
        error: result.error 
      })
    }

    // Get or create vendor from OAuth data
    const email = (result.authIdentity as any)?.email
    let vendor = await marketplaceService.retrieveVendorByEmail(email).catch(() => null)

    if (!vendor) {
      // Create vendor profile for OAuth user
      vendor = await marketplaceService.createVendor({
        email,
        name: (result.authIdentity as any)?.name || email.split("@")[0],
        type: "shop", // Default type
        commission_rate: 15, // Default commission
        is_active: false, // Requires admin approval
        metadata: {
          auth_provider: provider,
          auth_identity_id: result.authIdentity?.id,
        }
      })
    }

    // Redirect to vendor portal with token
    const redirectUrl = new URL(process.env.VENDOR_PORTAL_URL || "http://localhost:3001")
    redirectUrl.pathname = "/auth/callback"
    redirectUrl.searchParams.set("token", (result as any).token)
    redirectUrl.searchParams.set("provider", provider)
    redirectUrl.searchParams.set("vendor_id", vendor.id)
    
    return res.redirect(redirectUrl.toString())
  } catch (error) {
    // Redirect to vendor portal with error
    const redirectUrl = new URL(process.env.VENDOR_PORTAL_URL || "http://localhost:3001")
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("error", "oauth_failed")
    redirectUrl.searchParams.set("provider", provider)
    
    return res.redirect(redirectUrl.toString())
  }
}