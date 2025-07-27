import { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework"

export function vendorCors(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const origin = req.headers.origin
  const allowedOrigins = (process.env.VENDOR_CORS || "http://localhost:3001,http://localhost:3002").split(",")
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }
  
  next()
}

// Export middleware configuration
export const config = {
  routes: [
    {
      matcher: "/vendor/**",
      middlewares: [vendorCors],
    },
  ],
}