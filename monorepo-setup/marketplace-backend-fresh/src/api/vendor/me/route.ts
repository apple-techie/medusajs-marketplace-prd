import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import jwt from "jsonwebtoken"
import MarketplaceModuleService from "../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../modules/marketplace"

/**
 * GET /vendor/me
 * Get current vendor information
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    // Set CORS headers
    const origin = req.headers.origin
    const allowedOrigins = ["http://localhost:3001", "http://localhost:3002"]
    
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin)
      res.setHeader("Access-Control-Allow-Credentials", "true")
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    }
    
    // Manual JWT validation
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "No authorization token provided"
      )
    }
    
    const token = authHeader.substring(7)
    
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "marketplace_jwt_secret_2025_production_key")
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "Invalid or expired token"
      )
    }
    
    const vendorId = decoded.actor_id
    
    if (!vendorId) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "Not authenticated"
      )
    }
    
    const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
    
    try {
      const vendor = await marketplaceService.retrieveVendor(vendorId)
      
      if (!vendor) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          "Vendor not found"
        )
      }
      
      // Get vendor admin info
      const vendorAdmins = await marketplaceService.listVendorAdmins()
      const vendorAdmin = vendorAdmins.find(admin => admin.vendor_id === vendorId)
      
      res.json({
        vendor: {
          id: vendor.id,
          name: vendor.name,
          email: vendorAdmin?.email,
          type: vendor.type,
          status: vendor.status,
          is_active: vendor.is_active !== false,
          commission_rate: vendor.commission_rate,
          commission_tier: vendor.commission_tier,
          total_revenue: (vendor as any).total_revenue || 0,
          total_commission: (vendor as any).total_commission || 0,
          stripe_account_id: vendor.stripe_account_id,
          stripe_onboarding_completed: vendor.stripe_onboarding_completed,
          stripe_charges_enabled: vendor.stripe_charges_enabled,
          stripe_payouts_enabled: vendor.stripe_payouts_enabled,
          created_at: vendor.created_at,
          updated_at: vendor.updated_at
        }
      })
    } catch (error) {
      if (error instanceof MedusaError) {
        throw error
      }
      
      res.status(500).json({
        error: "Failed to fetch vendor information",
        details: error.message
      })
    }
}

/**
 * OPTIONS /vendor/me
 * Handle CORS preflight requests
 */
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
    const origin = req.headers.origin
    const allowedOrigins = ["http://localhost:3001", "http://localhost:3002"]
    
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin)
      res.setHeader("Access-Control-Allow-Credentials", "true")
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    }
    
    res.status(200).end()
}