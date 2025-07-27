// Commission calculation system for marketplace
import type { Vendor, CommissionTier, VendorType } from '@marketplace/types'

// Commission tiers based on PRD specifications
export const COMMISSION_TIERS = {
  shop: {
    1: { rate: 0.15, threshold: 0 },        // Bronze: 15%
    2: { rate: 0.18, threshold: 15000 },    // Silver: 18% 
    3: { rate: 0.22, threshold: 50000 },    // Gold: 22%
    4: { rate: 0.25, threshold: 50000 }     // Gold+: 25%
  },
  brand: {
    platform_fee: {
      starter: 0.10,     // $0 - $100k
      growth: 0.15,      // $100k - $500k
      enterprise: 0.20   // $500k+
    }
  },
  distributor: {
    pioneer: 0.03,       // First 6 months in region
    standard: 0.10,      // Base rate
    volume: {            // Volume discounts
      100000: 0.10,
      250000: 0.07,
      500000: 0.05,
      1000000: 0.03
    }
  }
} as const

export class CommissionCalculator {
  /**
   * Calculate commission for a shop vendor
   */
  calculateShopCommission(amount: number, tier: CommissionTier): number {
    const rate = COMMISSION_TIERS.shop[tier].rate
    return Math.round(amount * rate) // Return in cents
  }

  /**
   * Calculate platform fee for a brand vendor
   */
  calculateBrandFee(amount: number, monthlyVolume: number): number {
    let rate: number
    
    if (monthlyVolume >= 500000) {
      rate = COMMISSION_TIERS.brand.platform_fee.enterprise
    } else if (monthlyVolume >= 100000) {
      rate = COMMISSION_TIERS.brand.platform_fee.growth
    } else {
      rate = COMMISSION_TIERS.brand.platform_fee.starter
    }
    
    return Math.round(amount * rate)
  }

  /**
   * Calculate platform fee for a distributor
   */
  calculateDistributorFee(
    amount: number, 
    monthlyVolume: number,
    isPioneer: boolean = false
  ): number {
    if (isPioneer) {
      return Math.round(amount * COMMISSION_TIERS.distributor.pioneer)
    }

    // Find applicable volume discount
    let rate: number = COMMISSION_TIERS.distributor.standard
    const volumeTiers = Object.entries(COMMISSION_TIERS.distributor.volume)
      .sort(([a], [b]) => Number(b) - Number(a))

    for (const [threshold, discountRate] of volumeTiers) {
      if (monthlyVolume >= Number(threshold)) {
        rate = discountRate
        break
      }
    }

    return Math.round(amount * rate)
  }

  /**
   * Calculate commission for any vendor type
   */
  calculateCommission(
    vendor: Vendor,
    orderAmount: number,
    monthlyVolume: number = 0,
    isPioneer: boolean = false
  ): {
    commission: number
    rate: number
    tier?: string
  } {
    let commission: number
    let rate: number
    let tier: string | undefined

    switch (vendor.type) {
      case 'shop':
        rate = COMMISSION_TIERS.shop[vendor.commission_tier].rate
        commission = this.calculateShopCommission(orderAmount, vendor.commission_tier)
        tier = this.getShopTierName(vendor.commission_tier)
        break

      case 'brand':
        commission = this.calculateBrandFee(orderAmount, monthlyVolume)
        rate = commission / orderAmount
        tier = this.getBrandTierName(monthlyVolume)
        break

      case 'distributor':
        commission = this.calculateDistributorFee(orderAmount, monthlyVolume, isPioneer)
        rate = commission / orderAmount
        tier = isPioneer ? 'Pioneer' : this.getDistributorTierName(monthlyVolume)
        break

      default:
        throw new Error(`Unknown vendor type: ${vendor.type}`)
    }

    return {
      commission,
      rate: Math.round(rate * 10000) / 100, // Convert to percentage with 2 decimals
      tier
    }
  }

  /**
   * Determine shop tier based on monthly sales
   */
  determineShopTier(monthlySales: number): CommissionTier {
    if (monthlySales >= 50000) return 4 // Gold+
    if (monthlySales >= 50000) return 3 // Gold (same threshold as Gold+)
    if (monthlySales >= 15000) return 2 // Silver
    return 1 // Bronze
  }

  /**
   * Get tier name for shop
   */
  private getShopTierName(tier: CommissionTier): string {
    const names = {
      1: 'Bronze',
      2: 'Silver',
      3: 'Gold',
      4: 'Gold+'
    }
    return names[tier]
  }

  /**
   * Get tier name for brand
   */
  private getBrandTierName(monthlyVolume: number): string {
    if (monthlyVolume >= 500000) return 'Enterprise'
    if (monthlyVolume >= 100000) return 'Growth'
    return 'Starter'
  }

  /**
   * Get tier name for distributor
   */
  private getDistributorTierName(monthlyVolume: number): string {
    if (monthlyVolume >= 1000000) return 'Volume 1M+'
    if (monthlyVolume >= 500000) return 'Volume 500K+'
    if (monthlyVolume >= 250000) return 'Volume 250K+'
    if (monthlyVolume >= 100000) return 'Volume 100K+'
    return 'Standard'
  }

  /**
   * Calculate payout after commission
   */
  calculatePayout(orderAmount: number, commission: number): number {
    return orderAmount - commission
  }

  /**
   * Check if vendor qualifies for tier upgrade
   */
  checkTierUpgrade(vendor: Vendor, monthlySales: number): {
    canUpgrade: boolean
    nextTier?: CommissionTier
    salesNeeded?: number
  } {
    if (vendor.type !== 'shop') {
      return { canUpgrade: false }
    }

    const currentTier = vendor.commission_tier
    const recommendedTier = this.determineShopTier(monthlySales)

    if (recommendedTier > currentTier) {
      return {
        canUpgrade: true,
        nextTier: recommendedTier,
        salesNeeded: 0
      }
    }

    // Calculate sales needed for next tier
    const nextTier = (currentTier + 1) as CommissionTier
    if (nextTier <= 4) {
      const threshold = COMMISSION_TIERS.shop[nextTier].threshold
      return {
        canUpgrade: false,
        nextTier,
        salesNeeded: threshold - monthlySales
      }
    }

    return { canUpgrade: false }
  }
}

// Export singleton instance
export const commissionCalculator = new CommissionCalculator()
