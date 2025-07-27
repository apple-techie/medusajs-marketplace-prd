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
    
    // Mock generated reports history - in a real system, these would come from a reports history table
    const generatedReports = [
      {
        id: 'report_1',
        report_name: 'Commission Summary - December 2024',
        report_type: 'Commission Summary',
        generated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        file_size: '1.2 MB',
        download_url: 'https://example.com/reports/commission-summary-dec-2024.pdf',
        status: 'completed' as const
      },
      {
        id: 'report_2',
        report_name: 'Referral Performance - Week 52',
        report_type: 'Referral Performance',
        generated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        file_size: '850 KB',
        download_url: 'https://example.com/reports/referral-performance-week-52.pdf',
        status: 'completed' as const
      },
      {
        id: 'report_3',
        report_name: 'Product Performance - Week 51',
        report_type: 'Product Performance',
        generated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        file_size: '650 KB',
        download_url: 'https://example.com/reports/product-performance-week-51.pdf',
        status: 'completed' as const
      },
      {
        id: 'report_4',
        report_name: 'Tax Summary - Q4 2024',
        report_type: 'Tax Summary',
        generated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        file_size: '-',
        download_url: '',
        status: 'processing' as const
      },
      {
        id: 'report_5',
        report_name: 'Commission Summary - November 2024',
        report_type: 'Commission Summary',
        generated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        file_size: '1.1 MB',
        download_url: 'https://example.com/reports/commission-summary-nov-2024.pdf',
        status: 'completed' as const
      },
      {
        id: 'report_6',
        report_name: 'Payout History - 2024',
        report_type: 'Payout History',
        generated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        file_size: '2.3 MB',
        download_url: 'https://example.com/reports/payout-history-2024.pdf',
        status: 'completed' as const
      }
    ]
    
    res.json({
      reports: generatedReports
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch report history",
      message: error.message 
    })
  }
}