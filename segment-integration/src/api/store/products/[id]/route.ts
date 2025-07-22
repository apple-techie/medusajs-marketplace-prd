// Example of how to add the product view tracking middleware to your product routes

import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { trackProductView } from "../../../middleware/segment"

// Apply the middleware to your product detail route
export const middlewares = [trackProductView]

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const productService = req.scope.resolve("product")
  const product = await productService.retrieve(req.params.id)
  
  res.json({ product })
}