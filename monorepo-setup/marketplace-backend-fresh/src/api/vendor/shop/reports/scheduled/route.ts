import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules, MedusaError } from "@medusajs/framework/utils"
import * as jwt from "jsonwebtoken"

// Set CORS headers helper
const setCorsHeaders = (req: MedusaRequest, res: MedusaResponse) => {
  const origin = req.headers.origin
  const allowedOrigins = ["http://localhost:3001", "http://localhost:3002"]
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }
}

// Helper to validate vendor JWT
const validateVendorToken = (req: MedusaRequest) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "No authorization token provided")
  }
  
  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "marketplace_jwt_secret_2025_production_key") as any
    return decoded
  } catch (error) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Invalid or expired token")
  }
}

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  res.status(200).end()
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  try {
    const decoded = validateVendorToken(req)
    const vendorId = decoded.app_metadata?.vendor_id
    
    if (!vendorId) {
      return res.status(401).json({ error: "Vendor ID not found in token" })
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    
    // Get vendor details
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Verify it's a shop partner
    if (vendor.type !== 'shop_partner') {
      return res.status(403).json({ error: "This endpoint is only for shop partners" })
    }
    
    // Mock scheduled reports - in a real system, these would come from a scheduled reports table
    const scheduledReports = [
      {
        id: 'sched_1',
        report_type_id: 'commission_summary',
        report_name: 'Commission Summary Report',
        frequency: 'monthly',
        next_run: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        email: vendor.email || 'vendor@example.com',
        is_active: true
      },
      {
        id: 'sched_2',
        report_type_id: 'referral_performance',
        report_name: 'Referral Performance Report',
        frequency: 'weekly',
        next_run: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        email: vendor.email || 'vendor@example.com',
        is_active: true
      },
      {
        id: 'sched_3',
        report_type_id: 'tax_summary',
        report_name: 'Tax Summary Report',
        frequency: 'quarterly',
        next_run: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        email: vendor.email || 'vendor@example.com',
        is_active: false
      }
    ]
    
    res.json({
      scheduled_reports: scheduledReports
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch scheduled reports",
      message: error.message 
    })
  }
}