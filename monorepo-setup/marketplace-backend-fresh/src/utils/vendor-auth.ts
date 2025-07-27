import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import jwt from "jsonwebtoken"

export async function authenticate(req: MedusaRequest, res: MedusaResponse) {
  const token = req.headers.authorization?.replace("Bearer ", "")
  
  if (!token) {
    res.status(401).json({
      error: "Unauthorized",
      message: "No authentication token provided"
    })
    return null
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      vendor_id: string
      email: string
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    const vendor = await marketplaceService.retrieveVendor(decoded.vendor_id)
    
    if (!vendor) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid vendor"
      })
      return null
    }
    
    return {
      vendor,
      token: decoded
    }
  } catch (error) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token"
    })
    return null
  }
}