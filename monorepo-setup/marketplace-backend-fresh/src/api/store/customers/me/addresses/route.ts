import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/utils"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

// POST /store/customers/me/addresses - Create new address
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

    const addressData = req.body as any
    const customerService = req.scope.resolve(Modules.CUSTOMER)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Create the address
    const address = await customerService.createCustomerAddresses({
      customer_id: customerId,
      ...addressData
    })

    // Retrieve updated customer with addresses
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
    console.error("Error creating customer address:", error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error creating customer address",
      error: error.message
    })
  }
}
