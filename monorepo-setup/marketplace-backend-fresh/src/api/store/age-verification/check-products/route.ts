import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

// POST /store/age-verification/check-products - Check if products require age verification
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const ageVerificationService = req.scope.resolve("age_verification")
  
  const { product_ids } = req.body as { product_ids?: string[] }
  
  if (!product_ids || !Array.isArray(product_ids)) {
    return res.status(400).json({ 
      message: "Product IDs array is required" 
    })
  }
  
  try {
    const result = await ageVerificationService.checkProductsAgeRestriction(product_ids)
    
    res.json({
      restricted: result.restricted,
      minimum_age: result.minimum_age,
      requires_id_check: result.requires_id_check,
      restricted_products: result.products.map(p => ({
        product_id: p.product_id,
        minimum_age: p.minimum_age,
        restriction_reason: p.restriction_reason,
        compliance_category: p.compliance_category,
      }))
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to check product restrictions",
      error: error.message 
    })
  }
}