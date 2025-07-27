import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

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

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  res.status(200).end()
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    // Get product types using query
    const { data: types } = await query.graph({
      entity: "product_type",
      fields: ["id", "value"],
      filters: {}
    })
    
    const count = types.length
    
    res.json({
      product_types: types,
      count,
      offset: 0,
      limit: 100
    })
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to fetch product types",
      message: error.message 
    })
  }
}