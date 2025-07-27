import { MedusaService } from "@medusajs/framework/utils"
import { AgeVerificationSession, AgeRestrictedProduct } from "./models"
import { VerificationStatus, VerificationMethod } from "./models/age-verification-session"
import crypto from "crypto"

class AgeVerificationModuleService extends MedusaService({
  AgeVerificationSession,
  AgeRestrictedProduct,
}) {
  /**
   * Create a new age verification session
   */
  async createVerificationSession(data: {
    customer_id?: string
    ip_address: string
    user_agent?: string
    method: VerificationMethod
    age_threshold?: number
  }) {
    const sessionToken = this.generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour expiry
    
    const session = await this.createAgeVerificationSessions([{
      ...data,
      session_token: sessionToken,
      expires_at: expiresAt,
      status: VerificationStatus.PENDING,
    }])
    
    return session[0]
  }
  
  /**
   * Retrieve a verification session by token
   */
  async retrieveSessionByToken(token: string) {
    const sessions = await this.listAgeVerificationSessions({
      filters: { session_token: token }
    })
    
    if (!sessions || sessions.length === 0) {
      throw new Error("Verification session not found")
    }
    
    const session = sessions[0]
    
    // Check if session is expired
    if (new Date() > new Date(session.expires_at)) {
      await this.updateAgeVerificationSessions([{
        id: session.id,
        status: VerificationStatus.EXPIRED
      }])
      throw new Error("Verification session expired")
    }
    
    return session
  }
  
  /**
   * Verify age using session-based verification
   */
  async verifyAgeBySession(sessionToken: string, birthDate: Date) {
    const session = await this.retrieveSessionByToken(sessionToken)
    
    if (session.status !== VerificationStatus.PENDING) {
      throw new Error("Session already processed")
    }
    
    const age = this.calculateAge(birthDate)
    const isVerified = age >= session.age_threshold
    
    const [updatedSession] = await this.updateAgeVerificationSessions([{
      id: session.id,
      birth_date: birthDate,
      verified_age: age,
      status: isVerified ? VerificationStatus.VERIFIED : VerificationStatus.FAILED,
      verified_at: new Date(),
      verification_data: {
        method: "birth_date_input",
        age_calculated: age,
        threshold: session.age_threshold,
      }
    }])
    
    return {
      verified: isVerified,
      session: updatedSession[0],
    }
  }
  
  /**
   * Check if a customer is age verified
   */
  async isCustomerVerified(customerId: string, ageThreshold = 21) {
    const sessions = await this.listAgeVerificationSessions({
      filters: {
        customer_id: customerId,
        status: VerificationStatus.VERIFIED,
        age_threshold: { $gte: ageThreshold }
      },
      order: { verified_at: "DESC" },
      limit: 1,
    })
    
    if (!sessions || sessions.length === 0) {
      return false
    }
    
    const session = sessions[0]
    
    // Check if session is still valid (not expired)
    return new Date() < new Date(session.expires_at)
  }
  
  /**
   * Create or update age-restricted product
   */
  async createAgeRestrictedProduct(data: {
    product_id: string
    minimum_age?: number
    restriction_reason?: string
    requires_id_check?: boolean
    restricted_states?: string[]
    compliance_category?: string
  }) {
    // Check if product already has age restriction
    const existing = await this.listAgeRestrictedProducts({
      filters: { product_id: data.product_id }
    })
    
    if (existing && existing.length > 0) {
      // Update existing
      const processedUpdateData = {
        ...data,
        restricted_states: data.restricted_states as any
      }
      const [updated] = await this.updateAgeRestrictedProducts([{ id: existing[0].id, ...processedUpdateData }])
      return updated
    }
    
    // Create new
    const processedData = {
      ...data,
      restricted_states: data.restricted_states as any
    }
    const [created] = await this.createAgeRestrictedProducts([processedData])
    return created
  }
  
  /**
   * Check if products require age verification
   */
  async checkProductsAgeRestriction(productIds: string[]) {
    const restrictions = await this.listAgeRestrictedProducts({
      filters: { 
        product_id: { $in: productIds },
        is_active: true
      }
    })
    
    if (!restrictions || restrictions.length === 0) {
      return {
        restricted: false,
        products: [],
        minimum_age: null,
      }
    }
    
    // Find the highest age requirement
    const minimumAge = Math.max(...restrictions.map(r => r.minimum_age))
    const requiresIdCheck = restrictions.some(r => r.requires_id_check)
    
    return {
      restricted: true,
      products: restrictions,
      minimum_age: minimumAge,
      requires_id_check: requiresIdCheck,
    }
  }
  
  /**
   * Check if cart requires age verification
   */
  async checkCartAgeRestriction(cart: { items: { product_id: string }[] }) {
    const productIds = cart.items.map(item => item.product_id)
    return await this.checkProductsAgeRestriction(productIds)
  }
  
  /**
   * Helper: Calculate age from birth date
   */
  private calculateAge(birthDate: Date): number {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }
  
  /**
   * Helper: Generate secure session token
   */
  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }
  
  /**
   * Get age verification statistics
   */
  async getVerificationStats(startDate?: Date, endDate?: Date) {
    const filters: any = {}
    
    if (startDate || endDate) {
      filters.created_at = {}
      if (startDate) filters.created_at.$gte = startDate.toISOString()
      if (endDate) filters.created_at.$lte = endDate.toISOString()
    }
    
    const sessions = await this.listAgeVerificationSessions({ filters })
    
    const stats = {
      total: sessions.length,
      verified: sessions.filter(s => s.status === VerificationStatus.VERIFIED).length,
      failed: sessions.filter(s => s.status === VerificationStatus.FAILED).length,
      pending: sessions.filter(s => s.status === VerificationStatus.PENDING).length,
      expired: sessions.filter(s => s.status === VerificationStatus.EXPIRED).length,
      by_method: {} as Record<string, number>,
      average_age: 0,
    }
    
    // Count by method
    sessions.forEach(session => {
      const method = session.method
      stats.by_method[method] = (stats.by_method[method] || 0) + 1
    })
    
    // Calculate average age of verified users
    const verifiedWithAge = sessions.filter(s => 
      s.status === VerificationStatus.VERIFIED && s.verified_age
    )
    
    if (verifiedWithAge.length > 0) {
      const totalAge = verifiedWithAge.reduce((sum, s) => sum + (s.verified_age || 0), 0)
      stats.average_age = Math.round(totalAge / verifiedWithAge.length)
    }
    
    return stats
  }
}

export default AgeVerificationModuleService