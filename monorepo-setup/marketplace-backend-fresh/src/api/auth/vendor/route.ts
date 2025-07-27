import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import jwt from "jsonwebtoken"
import MarketplaceModuleService from "../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../modules/marketplace"

/**
 * POST /auth/vendor
 * Vendor authentication endpoint
 */
export const POST = async (
  req: MedusaRequest<{
    email: string
    password: string
  }>,
  res: MedusaResponse
) => {
  // Set CORS headers for vendor portal
  const origin = req.headers.origin
  const allowedOrigins = ["http://localhost:3001", "http://localhost:3002"]
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }
  
  const { email, password } = req.body
  
  if (!email || !password) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Email and password are required"
    )
  }
  
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  
  try {
    // Find vendor admin by email
    const vendorAdmins = await marketplaceService.listVendorAdmins()
    const vendorAdmin = vendorAdmins.find(admin => admin.email === email)
    
    if (!vendorAdmin) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "Invalid email or password"
      )
    }
    
    // For testing, accept "vendor123" as the password
    if (password !== "vendor123") {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "Invalid email or password"
      )
    }
    
    // Get vendor information
    const vendor = await marketplaceService.retrieveVendor(vendorAdmin.vendor_id)
    
    if (!vendor) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Vendor account not found"
      )
    }
    
    // Generate JWT token using MedusaJS structure
    const token = jwt.sign(
      {
        actor_id: vendor.id,
        actor_type: "vendor", 
        auth_identity_id: `authid_${vendorAdmin.id}`,
        app_metadata: {
          vendor_admin_id: vendorAdmin.id,
          vendor_id: vendor.id,
          email: vendorAdmin.email,
          vendor_type: vendor.type
        }
      },
      process.env.JWT_SECRET || "marketplace_jwt_secret_2025_production_key",
      {
        expiresIn: "24h"
      }
    )
    
    res.json({
      token,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendorAdmin.email,
        type: vendor.type,
        status: vendor.status,
        is_active: vendor.is_active !== false,
        stripe_onboarding_completed: vendor.stripe_onboarding_completed
      }
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Authentication failed",
      details: error.message
    })
  }
}