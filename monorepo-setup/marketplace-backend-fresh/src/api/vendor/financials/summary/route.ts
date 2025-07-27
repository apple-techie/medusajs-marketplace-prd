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
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    // Get vendor details
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Calculate financial summary
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    
    // Get vendor orders for calculations
    const vendorOrders = await marketplaceService.getVendorOrders(vendorId, {})
    
    // Calculate totals
    let totalSales = 0
    let totalCommission = 0
    let currentMonthSales = 0
    let currentMonthCommission = 0
    let lastMonthSales = 0
    let lastMonthCommission = 0
    let pendingPayouts = 0
    let completedPayouts = 0
    
    vendorOrders.forEach(vo => {
      const orderDate = new Date(vo.order.created_at)
      const vendorTotal = vo.vendor_total || 0
      const commission = vendorTotal * (vendor.commission_rate / 100)
      
      totalSales += vendorTotal
      totalCommission += commission
      
      if (orderDate >= currentMonthStart) {
        currentMonthSales += vendorTotal
        currentMonthCommission += commission
      } else if (orderDate >= lastMonthStart && orderDate <= lastMonthEnd) {
        lastMonthSales += vendorTotal
        lastMonthCommission += commission
      }
      
      // Calculate pending vs completed
      if (vo.order.payment_status === 'captured' && vo.fulfillment_status === 'delivered') {
        completedPayouts += commission
      } else {
        pendingPayouts += commission
      }
    })
    
    // Determine current tier
    let currentTier = 'Bronze'
    if (currentMonthSales >= 50000) {
      currentTier = 'Gold'
    } else if (currentMonthSales >= 10000) {
      currentTier = 'Silver'
    }
    
    // Calculate next tier threshold
    let nextTierThreshold: number | null = null
    if (currentTier === 'Bronze') {
      nextTierThreshold = 10000
    } else if (currentTier === 'Silver') {
      nextTierThreshold = 50000
    }
    
    res.json({
      summary: {
        total_sales: Math.round(totalSales),
        total_commission: Math.round(totalCommission),
        pending_payouts: Math.round(pendingPayouts),
        completed_payouts: Math.round(completedPayouts),
        current_month_sales: Math.round(currentMonthSales),
        current_month_commission: Math.round(currentMonthCommission),
        last_month_sales: Math.round(lastMonthSales),
        last_month_commission: Math.round(lastMonthCommission),
        commission_rate: vendor.commission_rate,
        current_tier: currentTier,
        next_tier_threshold: nextTierThreshold,
        currency_code: 'usd'
      }
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch financial summary",
      message: error.message 
    })
  }
}