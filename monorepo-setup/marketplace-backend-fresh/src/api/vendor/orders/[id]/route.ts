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

// GET /vendor/orders/:id - Get a specific order for the vendor
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
    
    const { id } = req.params
    const marketplaceService = req.scope.resolve("marketplace")
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    // Get the order with full details
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "*",
        "customer.*",
        "shipping_address.*",
        "billing_address.*",
        "items.*",
        "items.variant.*",
        "items.variant.product.*",
        "items.variant.product.vendor_products.*",
        "shipping_methods.*",
        "payments.*",
        "fulfillments.*",
        "fulfillments.items.*"
      ],
      filters: {
        id: id
      }
    })
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "Order not found" })
    }
    
    const order = orders[0]
    
    // Check if vendor has access to this order
    const vendorItems = order.items ? order.items.filter((item: any) => 
      item?.variant?.product?.vendor_products?.some((vp: any) => vp.vendor_id === vendorId)
    ) : []
    
    if (vendorItems.length === 0) {
      return res.status(403).json({ error: "You don't have access to this order" })
    }
    
    // Calculate vendor's portion
    const vendorSubtotal = vendorItems.reduce((sum: number, item: any) => sum + ((item?.unit_price || 0) * (item?.quantity || 0)), 0)
    const vendorTotal = vendorSubtotal // Simplified - in reality would include vendor's portion of shipping/tax
    
    // Get vendor-specific fulfillment status
    let vendorFulfillmentStatus = 'not_fulfilled'
    if (order.fulfillments && Array.isArray(order.fulfillments) && order.fulfillments.length > 0) {
      const vendorFulfillments = order.fulfillments.filter((f: any) => 
        f?.items?.some((fi: any) => vendorItems.some((vi: any) => vi?.id === fi?.line_item_id))
      )
      if (vendorFulfillments.length > 0) {
        vendorFulfillmentStatus = 'fulfilled'
      }
    }
    
    res.json({
      order: {
        ...order,
        items: vendorItems,
        vendor_subtotal: vendorSubtotal,
        vendor_total: vendorTotal,
        original_total: order.total,
        fulfillment_status: vendorFulfillmentStatus,
        payment_status: (order as any).payment_status || 'not_paid'
      }
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message
    })
  }
}

// PUT /vendor/orders/:id/fulfill - Mark vendor's items as fulfilled
export const PUT = async (
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
    
    const { id } = req.params
    const { item_ids, tracking_number, tracking_url } = req.body as {
      item_ids?: string[]
      tracking_number?: string
      tracking_url?: string
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    
    // Create fulfillment for vendor's items
    const fulfillment = await marketplaceService.createVendorFulfillment({
      order_id: id,
      vendor_id: vendorId,
      item_ids: item_ids,
      tracking_number,
      tracking_url
    })
    
    res.json({ fulfillment })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({
      message: "Failed to create fulfillment",
      error: error.message
    })
  }
}