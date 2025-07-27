import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { limit = 20, offset = 0, status } = req.query
  
  try {
    const filters: any = {}
    if (status) {
      filters.status = status
    }

    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "images.*",
        "categories.*",
        "tags.*"
      ],
      filters,
      pagination: {
        take: Number(limit),
        skip: Number(offset)
      }
    })

    res.json({ 
      products,
      count: products.length,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message })
  }
}