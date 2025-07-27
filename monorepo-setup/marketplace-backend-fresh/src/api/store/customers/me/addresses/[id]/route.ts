import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/utils"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

// PUT /store/customers/me/addresses/[id] - Update address
export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const customerId = req.session?.customer_id
    const { id: addressId } = req.params

    if (!customerId) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "Customer not authenticated"
      )
    }

    if (!addressId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Address ID is required"
      )
    }

    const addressData = req.body as any
    const customerService = req.scope.resolve(Modules.CUSTOMER)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Update the address
    await customerService.updateCustomerAddresses(addressId, addressData)

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
    console.error("Error updating customer address:", error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error updating customer address",
      error: error.message
    })
  }
}

// DELETE /store/customers/me/addresses/[id] - Delete address
export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const customerId = req.session?.customer_id
    const { id: addressId } = req.params

    if (!customerId) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "Customer not authenticated"
      )
    }

    if (!addressId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Address ID is required"
      )
    }

    const customerService = req.scope.resolve(Modules.CUSTOMER)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Delete the address
    await customerService.deleteCustomerAddresses(addressId)

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
    console.error("Error deleting customer address:", error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Error deleting customer address",
      error: error.message
    })
  }
}
