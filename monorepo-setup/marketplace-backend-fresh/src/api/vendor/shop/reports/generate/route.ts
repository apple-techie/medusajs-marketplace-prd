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

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  try {
    const decoded = validateVendorToken(req)
    const vendorId = decoded.app_metadata?.vendor_id
    
    if (!vendorId) {
      return res.status(401).json({ error: "Vendor ID not found in token" })
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    const { report_type_id } = req.body as any
    
    if (!report_type_id) {
      return res.status(400).json({ error: "Report type ID is required" })
    }
    
    // Get vendor details
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Verify it's a shop partner
    if (vendor.type !== 'shop_partner') {
      return res.status(403).json({ error: "This endpoint is only for shop partners" })
    }
    
    // In a real system, this would trigger a background job to generate the report
    // For now, we'll just return a success response with a mock report ID
    const reportId = `report_${Date.now()}`
    
    // Map report type to name
    const reportTypeNames = {
      'commission_summary': 'Commission Summary Report',
      'referral_performance': 'Referral Performance Report',
      'customer_insights': 'Customer Insights Report',
      'payout_history': 'Payout History Report',
      'conversion_funnel': 'Conversion Funnel Analysis',
      'tax_summary': 'Tax Summary Report',
      'product_performance': 'Product Performance Report',
      'campaign_roi': 'Campaign ROI Report'
    }
    
    const reportName = reportTypeNames[report_type_id] || 'Custom Report'
    
    res.json({
      report_id: reportId,
      report_name: reportName,
      status: 'processing',
      message: 'Report generation has been initiated. You will be notified when it is ready.'
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to generate report",
      message: error.message 
    })
  }
}