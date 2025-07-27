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
    const vendorAdminId = decoded.app_metadata?.vendor_admin_id
    
    if (!vendorId || !vendorAdminId) {
      return res.status(401).json({ error: "Vendor ID not found in token" })
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    
    // Get vendor and admin details
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    const vendorAdmin = await marketplaceService.retrieveVendorAdmin(vendorAdminId)
    
    // Mock notification settings - in real implementation, this would come from database
    const notifications = {
      new_order: true,
      order_fulfilled: true,
      payout_completed: true,
      product_low_stock: true
    }
    
    res.json({
      settings: {
        vendor: {
          id: vendor.id,
          name: vendor.name,
          email: vendor.email,
          description: vendor.description,
          website: vendor.website,
          type: vendor.type,
          commission_rate: vendor.commission_rate,
          is_active: vendor.is_active,
          stripe_account_id: vendor.stripe_account_id,
          stripe_onboarding_completed: vendor.stripe_onboarding_completed,
          metadata: vendor.metadata
        },
        admin: {
          id: vendorAdmin.id,
          email: vendorAdmin.email,
          first_name: vendorAdmin.first_name,
          last_name: vendorAdmin.last_name
        },
        notifications
      }
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch settings",
      message: error.message 
    })
  }
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  try {
    const decoded = validateVendorToken(req)
    const vendorId = decoded.app_metadata?.vendor_id
    const vendorAdminId = decoded.app_metadata?.vendor_admin_id
    
    if (!vendorId || !vendorAdminId) {
      return res.status(401).json({ error: "Vendor ID not found in token" })
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    const reqBody = req.body as any
    const { vendor: vendorData, admin: adminData, notifications } = reqBody
    
    // Update vendor
    if (vendorData) {
      await marketplaceService.updateVendor(vendorId, {
        name: vendorData.name,
        description: vendorData.description,
        website: vendorData.website,
        metadata: vendorData.metadata
      })
    }
    
    // Update vendor admin
    if (adminData) {
      await marketplaceService.updateVendorAdmin(vendorAdminId, {
        first_name: adminData.first_name,
        last_name: adminData.last_name,
        email: adminData.email
      })
    }
    
    // In real implementation, notification settings would be saved to database
    
    res.json({
      success: true,
      message: "Settings updated successfully"
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to update settings",
      message: error.message 
    })
  }
}