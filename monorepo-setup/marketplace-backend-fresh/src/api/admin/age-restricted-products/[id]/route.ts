import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

// GET /admin/age-restricted-products/:id - Get age restriction by ID
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const ageVerificationService = req.scope.resolve("age_verification")
  const { id } = req.params
  
  try {
    const product = await ageVerificationService.retrieveAgeRestrictedProduct(id)
    
    res.json({ age_restricted_product: product })
  } catch (error) {
    res.status(404).json({ 
      message: "Age-restricted product not found",
      error: error.message 
    })
  }
}

// POST /admin/age-restricted-products/:id - Update age restriction
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const ageVerificationService = req.scope.resolve("age_verification")
  const { id } = req.params
  
  try {
    const updateData = { id, ...(req.body as Record<string, any>) }
    const updated = await ageVerificationService.updateAgeRestrictedProducts([updateData])
    
    res.json({ 
      age_restricted_product: updated[0],
      message: "Age restriction updated successfully"
    })
  } catch (error) {
    res.status(400).json({ 
      message: "Failed to update age restriction",
      error: error.message 
    })
  }
}

// DELETE /admin/age-restricted-products/:id - Remove age restriction
export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const ageVerificationService = req.scope.resolve("age_verification")
  const { id } = req.params
  
  try {
    // Soft delete by setting is_active to false
    await ageVerificationService.updateAgeRestrictedProducts([{ id, is_active: false }])
    
    res.json({ 
      message: "Age restriction removed successfully"
    })
  } catch (error) {
    res.status(400).json({ 
      message: "Failed to remove age restriction",
      error: error.message 
    })
  }
}