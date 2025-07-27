import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

// OAuth provider authentication
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { provider } = req.params
  const authService = req.scope.resolve("auth")

  try {
    const result = await authService.authenticate(provider, {
      body: {},
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
    })

    if (!result.success && result.location) {
      // Redirect to OAuth provider
      return res.redirect(result.location)
    }

    if (result.success) {
      // OAuth successful, redirect to vendor portal with token
      const redirectUrl = new URL(process.env.VENDOR_PORTAL_URL || "http://localhost:3001")
      redirectUrl.pathname = "/auth/callback"
      redirectUrl.searchParams.set("token", (result as any).token)
      redirectUrl.searchParams.set("provider", provider)
      
      return res.redirect(redirectUrl.toString())
    }

    res.status(400).json({ 
      message: "Authentication failed",
      error: result.error 
    })
  } catch (error) {
    res.status(500).json({ 
      message: `${provider} authentication failed`,
      error: error.message 
    })
  }
}