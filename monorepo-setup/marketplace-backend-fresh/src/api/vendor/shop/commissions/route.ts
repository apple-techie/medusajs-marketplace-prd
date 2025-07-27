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
    const period = req.query.period as string || 'last_30_days'
    
    // Get vendor details
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Verify it's a shop partner
    if (vendor.type !== 'shop_partner') {
      return res.status(403).json({ error: "This endpoint is only for shop partners" })
    }
    
    // Mock commission data - in a real system, these would come from order/commission tracking
    const mockCommissions = [
      {
        id: `comm_${Date.now()}_1`,
        order_id: 'order_1',
        order_display_id: '10234',
        customer_name: 'John Smith',
        product_name: 'Premium THC Vape Pen',
        order_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        order_total: 18500,
        commission_rate: 15,
        commission_amount: 2775,
        status: 'paid' as const,
        paid_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        referral_code: 'INSTA123',
        payout_id: 'payout_001'
      },
      {
        id: `comm_${Date.now()}_2`,
        order_id: 'order_2',
        order_display_id: '10235',
        customer_name: 'Sarah Johnson',
        product_name: 'Organic CBD Tincture 1000mg',
        order_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        order_total: 8900,
        commission_rate: 15,
        commission_amount: 1335,
        status: 'approved' as const,
        referral_code: 'BLOG456'
      },
      {
        id: `comm_${Date.now()}_3`,
        order_id: 'order_3',
        order_display_id: '10236',
        customer_name: 'Mike Wilson',
        product_name: 'Delta-8 Gummies Pack',
        order_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        order_total: 12500,
        commission_rate: 15,
        commission_amount: 1875,
        status: 'pending' as const,
        referral_code: 'INSTA123'
      },
      {
        id: `comm_${Date.now()}_4`,
        order_id: 'order_4',
        order_display_id: '10237',
        customer_name: 'Emily Davis',
        product_name: 'Live Resin Cartridge',
        order_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        order_total: 15600,
        commission_rate: 15,
        commission_amount: 2340,
        status: 'paid' as const,
        paid_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        referral_code: 'EMAIL789',
        payout_id: 'payout_002'
      },
      {
        id: `comm_${Date.now()}_5`,
        order_id: 'order_5',
        order_display_id: '10238',
        customer_name: 'Robert Brown',
        product_name: 'Full Spectrum CBD Oil',
        order_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        order_total: 7800,
        commission_rate: 15,
        commission_amount: 1170,
        status: 'cancelled' as const,
        referral_code: 'YT2024'
      }
    ]
    
    // Filter by period
    let filteredCommissions = mockCommissions
    const now = new Date()
    
    switch (period) {
      case 'last_7_days':
        filteredCommissions = mockCommissions.filter(c => {
          const orderDate = new Date(c.order_date)
          return orderDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        })
        break
      case 'last_30_days':
        filteredCommissions = mockCommissions.filter(c => {
          const orderDate = new Date(c.order_date)
          return orderDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        })
        break
      case 'last_90_days':
        filteredCommissions = mockCommissions
        break
      case 'this_month':
        filteredCommissions = mockCommissions.filter(c => {
          const orderDate = new Date(c.order_date)
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
        })
        break
      case 'last_month':
        filteredCommissions = mockCommissions.filter(c => {
          const orderDate = new Date(c.order_date)
          const lastMonth = now.getMonth() - 1
          const lastMonthYear = lastMonth < 0 ? now.getFullYear() - 1 : now.getFullYear()
          return orderDate.getMonth() === (lastMonth < 0 ? 11 : lastMonth) && orderDate.getFullYear() === lastMonthYear
        })
        break
    }
    
    res.json({
      commissions: filteredCommissions,
      count: filteredCommissions.length,
      period
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch commissions",
      message: error.message 
    })
  }
}