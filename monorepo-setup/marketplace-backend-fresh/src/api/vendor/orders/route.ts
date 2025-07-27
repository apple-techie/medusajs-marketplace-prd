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

// GET /vendor/orders - Get orders for the authenticated vendor
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  setCorsHeaders(req, res)
  
  try {
    const decoded = validateVendorToken(req)
    const vendorId = decoded.app_metadata?.vendor_id
    
    if (!vendorId) {
      return res.status(401).json({ error: "Vendor ID not found in token" })
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    
    // Get query parameters
    const status = req.query.status as string
    const limit = parseInt(req.query.limit as string) || 20
    const offset = parseInt(req.query.offset as string) || 0
    
    // Build filters
    const filters: any = {}
    if (status) {
      filters.status = status
    }
    
    // Get vendor orders
    const vendorOrders = await marketplaceService.getVendorOrders(
      vendorId,
      filters
    )
    
    // Transform orders to match expected format
    const transformedOrders = vendorOrders.map(vo => ({
      id: vo.order.id,
      display_id: vo.order.display_id,
      status: vo.order.status,
      fulfillment_status: vo.fulfillment_status || 'not_fulfilled',
      payment_status: vo.order.payment_status || 'not_paid',
      customer: vo.order.customer,
      shipping_address: vo.order.shipping_address,
      items: vo.items,
      total: vo.vendor_total,
      subtotal: vo.vendor_subtotal,
      shipping_total: 0, // Would need to calculate vendor portion
      tax_total: 0, // Would need to calculate vendor portion
      currency_code: vo.order.currency_code,
      created_at: vo.order.created_at
    }))
    
    // Paginate results
    const paginatedOrders = transformedOrders.slice(offset, offset + limit)
    
    res.json({
      orders: paginatedOrders,
      count: paginatedOrders.length,
      total: transformedOrders.length,
      offset,
      limit
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({
      message: "Failed to fetch vendor orders",
      error: error.message
    })
  }
}