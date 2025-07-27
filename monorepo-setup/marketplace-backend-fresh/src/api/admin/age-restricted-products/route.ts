import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

// Simple validation function
type ValidationError = { field: string; message: string }

function validateAgeRestrictedProduct(data: any): { data: any; errors: ValidationError[] } {
  const errors: ValidationError[] = []
  
  if (!data.product_id || typeof data.product_id !== 'string') {
    errors.push({ field: 'product_id', message: 'Product ID is required and must be a string' })
  }
  
  if (data.minimum_age !== undefined) {
    const age = Number(data.minimum_age)
    if (isNaN(age) || age < 18 || age > 21) {
      errors.push({ field: 'minimum_age', message: 'Minimum age must be between 18 and 21' })
    }
    data.minimum_age = age
  } else {
    data.minimum_age = 21
  }
  
  if (data.requires_id_check !== undefined) {
    data.requires_id_check = Boolean(data.requires_id_check)
  }
  
  if (data.restricted_states !== undefined && !Array.isArray(data.restricted_states)) {
    errors.push({ field: 'restricted_states', message: 'Restricted states must be an array' })
  }
  
  return { data, errors }
}

// GET /admin/age-restricted-products - List all age-restricted products
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const ageVerificationService = req.scope.resolve("age_verification")
  
  try {
    const products = await ageVerificationService.listAgeRestrictedProducts({
      filters: req.query.is_active !== undefined 
        ? { is_active: req.query.is_active === 'true' }
        : {}
    })
    
    res.json({ 
      age_restricted_products: products,
      count: products.length,
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch age-restricted products",
      error: error.message 
    })
  }
}

// POST /admin/age-restricted-products - Create age restriction for product
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const ageVerificationService = req.scope.resolve("age_verification")
  
  try {
    const { data: validatedData, errors } = validateAgeRestrictedProduct(req.body)
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: "Invalid request data",
        errors 
      })
    }
    
    const product = await ageVerificationService.createAgeRestrictedProduct(validatedData)
    
    res.json({ 
      age_restricted_product: product[0],
      message: "Product age restriction created successfully"
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to create age restriction",
      error: error.message 
    })
  }
}