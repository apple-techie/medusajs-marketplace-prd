import { MedusaContainer } from "@medusajs/framework/types"

export type VerifyCartAgeResult = {
  requires_verification: boolean
  verified: boolean
  message: string
  minimum_age?: number
  requires_id_check?: boolean
  restricted_products?: any[]
}

export class AgeVerificationHelper {
  constructor(private container: MedusaContainer) {}

  async verifyCartAge(input: {
    cart_id: string
    customer_id?: string
    session_token?: string
  }): Promise<VerifyCartAgeResult> {
    const query = this.container.resolve("query")
    const ageVerificationService = this.container.resolve("age_verification")
    
    // Get cart with items
    const { data: carts } = await query.graph({
      entity: "cart",
      fields: ["id", "items.*", "items.product_id"],
      filters: { id: input.cart_id }
    })
    
    const cart = carts[0]
    
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        requires_verification: false,
        verified: true,
        message: "No age-restricted products in cart",
      }
    }
    
    // Check if any products are age-restricted
    const productIds = cart.items
      .filter((item: any) => item && item.product_id)
      .map((item: any) => item.product_id as string)
    
    const ageRestriction = await ageVerificationService.checkProductsAgeRestriction(productIds)
    
    if (!ageRestriction.restricted) {
      return {
        requires_verification: false,
        verified: true,
        message: "No age-restricted products in cart",
      }
    }
    
    // Check if customer is already verified
    if (input.customer_id) {
      const isVerified = await ageVerificationService.isCustomerVerified(
        input.customer_id, 
        ageRestriction.minimum_age || 21
      )
      
      if (isVerified) {
        return {
          requires_verification: false,
          verified: true,
          message: "Customer already age verified",
        }
      }
    }
    
    // Check session verification
    if (input.session_token) {
      try {
        const session = await ageVerificationService.retrieveSessionByToken(input.session_token)
        
        if (session.status === "verified" && 
            session.verified_age !== null && 
            session.verified_age >= (ageRestriction.minimum_age || 21)) {
          return {
            requires_verification: false,
            verified: true,
            message: "Session age verified",
          }
        }
      } catch (error) {
        // Session not found or expired
      }
    }
    
    // Customer needs age verification
    return {
      requires_verification: true,
      verified: false,
      message: `Age verification required (${ageRestriction.minimum_age}+)`,
      minimum_age: ageRestriction.minimum_age || undefined,
      requires_id_check: ageRestriction.requires_id_check,
      restricted_products: ageRestriction.products,
    }
  }
}