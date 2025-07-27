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
    
    // Mock report types - in a real system, these would come from a configuration table
    const reportTypes = [
      {
        id: 'commission_summary',
        name: 'Commission Summary Report',
        description: 'Detailed breakdown of commissions earned by referral code and product',
        category: 'financial',
        frequency: 'monthly',
        last_generated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'referral_performance',
        name: 'Referral Performance Report',
        description: 'Analytics on referral link performance, conversion rates, and traffic sources',
        category: 'performance',
        frequency: 'weekly',
        last_generated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'customer_insights',
        name: 'Customer Insights Report',
        description: 'Demographics and behavior patterns of referred customers',
        category: 'customer',
        frequency: 'monthly'
      },
      {
        id: 'payout_history',
        name: 'Payout History Report',
        description: 'Complete history of commission payouts with transaction details',
        category: 'financial',
        frequency: 'on-demand',
        last_generated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'conversion_funnel',
        name: 'Conversion Funnel Analysis',
        description: 'Detailed funnel analysis from clicks to purchases',
        category: 'performance',
        frequency: 'monthly'
      },
      {
        id: 'tax_summary',
        name: 'Tax Summary Report',
        description: 'Annual commission earnings summary for tax purposes',
        category: 'financial',
        frequency: 'quarterly',
        last_generated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'product_performance',
        name: 'Product Performance Report',
        description: 'Which products generate the most referrals and commissions',
        category: 'performance',
        frequency: 'weekly',
        last_generated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'campaign_roi',
        name: 'Campaign ROI Report',
        description: 'Return on investment for different marketing campaigns',
        category: 'operational',
        frequency: 'monthly'
      }
    ]
    
    res.json({
      report_types: reportTypes
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch report types",
      message: error.message 
    })
  }
}