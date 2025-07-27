import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: ["*"],
      filters: { id },
    })

    if (!vendors?.length) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    res.json({ vendor: vendors[0] })
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendor", error: error.message })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  console.log("Update vendor request - ID:", id, "Body:", req.body)
  const marketplaceService = req.scope.resolve("marketplace")
  
  try {
    const vendor = await marketplaceService.updateVendor(id, req.body)
    res.json({ vendor })
  } catch (error) {
    console.error("Error updating vendor:", error)
    res.status(500).json({ message: "Error updating vendor", error: error.message })
  }
}