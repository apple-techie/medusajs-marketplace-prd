// Example of how to add search tracking middleware to your product search route

import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { trackSearch } from "../../middleware/segment"

// Apply the middleware to your search route
export const middlewares = [trackSearch]

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const productService = req.scope.resolve("product")
  
  // Your search implementation
  const query = req.query.q as string
  const products = await productService.list({
    // Add your search filters
  })
  
  res.json({ products })
}