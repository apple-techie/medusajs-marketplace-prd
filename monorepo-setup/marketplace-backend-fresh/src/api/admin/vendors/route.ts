import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: vendors } = await query.graph({
    entity: "vendor",
    fields: ["*"],
  })

  res.json({ vendors })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const marketplaceService = req.scope.resolve("marketplace")
  
  const vendor = await marketplaceService.createVendor(req.body)

  res.json({ vendor })
}