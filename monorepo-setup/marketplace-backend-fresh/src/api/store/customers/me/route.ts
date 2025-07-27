import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/utils"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const customerId = req.session?.customer_id

    if (!customerId) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "Customer not authenticated"
      )
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: customers } = await query.graph({
      entity: "customer",
      fields: [
        "id",
        "email",
        "first_name", 
        "last_name",
        "phone",
        "created_at",
        "updated_at",
        "addresses.*"
      ],
      filters: { id: customerId }
    })

    const customer = customers[0]

    if (!customer) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Customer not found"
      )
    }

    res.json({ customer })
  } catch (error) {
    console.error("Error retrieving customer:", error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error retrieving customer",
      error: error.message
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const customerId = req.session?.customer_id

    if (!customerId) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "Customer not authenticated"
      )
    }

    const updateData = req.body as any
    const customerService = req.scope.resolve(Modules.CUSTOMER)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Update customer data
    await customerService.updateCustomers(customerId, updateData)

    // Retrieve updated customer
    const { data: customers } = await query.graph({
      entity: "customer", 
      fields: [
        "id",
        "email",
        "first_name",
        "last_name", 
        "phone",
        "created_at",
        "updated_at",
        "addresses.*"
      ],
      filters: { id: customerId }
    })

    res.json({ customer: customers[0] })
  } catch (error) {
    console.error("Error updating customer:", error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error updating customer",
      error: error.message
    })
  }
}
