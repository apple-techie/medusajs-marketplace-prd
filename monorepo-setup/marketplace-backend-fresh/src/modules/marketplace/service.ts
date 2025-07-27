import { MedusaService } from "@medusajs/framework/utils"
import { 
  Vendor, 
  VendorAdmin, 
  VendorOrder, 
  FulfillmentLocation, 
  RoutingRule,
  CommissionRecord,
  VendorPlatformFee,
  VendorMonthlyVolume,
  Payout,
  PayoutAdjustment
} from "./models"
import { VendorType } from "./models/vendor"
import { MultiVendorCartService } from "./services/multi-vendor-cart"
import { VendorOnboardingService } from "./services/vendor-onboarding"
import { StripeConnectService } from "./services/stripe-connect"
import { FulfillmentRoutingService } from "./services/fulfillment-routing"
import { CommissionTrackingService } from "./services/commission-tracking"
import { VendorPayoutService } from "./services/vendor-payout"

// Commission tiers for Shop partners
const SHOP_COMMISSION_TIERS = {
  bronze: { min: 0, max: 50000, rate: 15 },
  silver: { min: 50000, max: 200000, rate: 20 },
  gold: { min: 200000, max: Infinity, rate: 25 }
}

// Fixed commission rates for other vendor types
const VENDOR_TYPE_COMMISSION = {
  [VendorType.BRAND]: 10,
  [VendorType.DISTRIBUTOR]: 5
}

class MarketplaceModuleService extends MedusaService({
  Vendor,
  VendorAdmin,
  VendorOrder,
  FulfillmentLocation,
  RoutingRule,
  CommissionRecord,
  VendorPlatformFee,
  VendorMonthlyVolume,
  Payout,
  PayoutAdjustment,
}) {
  multiVendorCartService: MultiVendorCartService
  vendorOnboardingService: VendorOnboardingService
  stripeConnectService: StripeConnectService
  fulfillmentRoutingService: FulfillmentRoutingService
  commissionTrackingService: CommissionTrackingService
  vendorPayoutService: VendorPayoutService
  
  constructor(...args: any[]) {
    // @ts-ignore
    super(...args)
    this.multiVendorCartService = new MultiVendorCartService(this)
    this.vendorOnboardingService = new VendorOnboardingService(this)
    this.stripeConnectService = new StripeConnectService()
    this.fulfillmentRoutingService = new FulfillmentRoutingService(this, null)
    this.commissionTrackingService = new CommissionTrackingService(this)
    this.vendorPayoutService = new VendorPayoutService(this)
  }
  async createVendor(data: any) {
    // Set default commission rate based on vendor type
    if (!data.commission_rate) {
      if (data.type === VendorType.SHOP) {
        data.commission_rate = SHOP_COMMISSION_TIERS.bronze.rate
        data.commission_tier = "bronze"
      } else {
        data.commission_rate = VENDOR_TYPE_COMMISSION[data.type] || 10
      }
    }
    
    // Generate unique handle if not provided
    if (!data.handle) {
      data.handle = data.name.toLowerCase().replace(/\s+/g, '-')
    }
    
    return await this.createVendors([data]).then(vendors => vendors[0])
  }

  // MedusaService provides retrieveVendor method automatically

  async retrieveVendorByEmail(email: string) {
    const vendors = await this.listVendors({
      filters: { email }
    })
    
    if (!vendors || vendors.length === 0) {
      throw new Error("Vendor not found")
    }
    
    return vendors[0]
  }

  async updateVendor(id: string, data: any) {
    if (!id) {
      throw new Error("Vendor ID is required for update")
    }
    
    // Use the parent class method correctly
    const updatedVendors = await this.updateVendors([{
      id,
      ...data
    }])
    
    return updatedVendors[0]
  }
  
  /**
   * Calculate commission for a vendor based on their type and revenue
   */
  async calculateCommission(vendorId: string, amount: number) {
    const vendor = await this.retrieveVendor(vendorId)
    
    if (!vendor) {
      throw new Error("Vendor not found")
    }
    
    const commissionRate = vendor.commission_rate / 100
    const commission = amount * commissionRate
    const netAmount = amount - commission
    
    return {
      gross_amount: amount,
      commission_rate: vendor.commission_rate,
      commission_amount: Math.round(commission * 100) / 100,
      net_amount: Math.round(netAmount * 100) / 100,
      vendor_type: vendor.type,
      commission_tier: vendor.commission_tier
    }
  }
  
  /**
   * Update vendor commission tier based on monthly revenue (for Shop partners)
   */
  async updateCommissionTier(vendorId: string, monthlyRevenue: number) {
    const vendor = await this.retrieveVendor(vendorId)
    
    if (!vendor || vendor.type !== VendorType.SHOP) {
      return vendor // Only Shop partners have tiered commissions
    }
    
    let newTier = "bronze"
    let newRate = SHOP_COMMISSION_TIERS.bronze.rate
    
    if (monthlyRevenue >= SHOP_COMMISSION_TIERS.gold.min) {
      newTier = "gold"
      newRate = SHOP_COMMISSION_TIERS.gold.rate
    } else if (monthlyRevenue >= SHOP_COMMISSION_TIERS.silver.min) {
      newTier = "silver"
      newRate = SHOP_COMMISSION_TIERS.silver.rate
    }
    
    if (vendor.commission_tier !== newTier) {
      return await this.updateVendor(vendorId, {
        commission_tier: newTier,
        commission_rate: newRate
      })
    }
    
    return vendor
  }
  
  /**
   * Get vendors by type
   */
  async getVendorsByType(type: VendorType) {
    return await this.listVendors({
      filters: { type, is_active: true }
    })
  }
  
  /**
   * Get active vendors for operations dashboard
   */
  async getActiveVendors() {
    return await this.listVendors({
      filters: { is_active: true }
    })
  }
  
  /**
   * Process multi-vendor cart
   */
  async processMultiVendorCart(cart: any) {
    return await this.multiVendorCartService.processMultiVendorCart(cart)
  }
  
  /**
   * Validate cart fulfillment
   */
  async validateCartFulfillment(cart: any) {
    return await this.multiVendorCartService.validateCartFulfillment(cart)
  }
  
  /**
   * Split cart into vendor orders
   */
  async splitCartIntoVendorOrders(cart: any) {
    return await this.multiVendorCartService.splitCartIntoVendorOrders(cart)
  }
  
  /**
   * Enrich cart with vendor data
   */
  async enrichCartWithVendorData(cart: any) {
    return await this.multiVendorCartService.enrichCartWithVendorData(cart)
  }
  
  /**
   * Create vendor orders from a main order
   */
  async createVendorOrdersForOrder(orderId: string, vendorOrdersData: any[]) {
    const vendorOrders: any[] = []
    
    for (const vendorOrderData of vendorOrdersData) {
      const vendorOrder = await this.createVendorOrders([{
        order_id: orderId,
        vendor_id: vendorOrderData.vendor_id,
        vendor_name: vendorOrderData.vendor_name,
        vendor_type: vendorOrderData.vendor_type,
        status: vendorOrderData.status || "pending",
        subtotal: vendorOrderData.subtotal,
        commission_rate: vendorOrderData.commission_rate || 0,
        commission_amount: vendorOrderData.commission_amount,
        vendor_payout: vendorOrderData.vendor_payout,
        items: vendorOrderData.items,
        metadata: vendorOrderData.metadata
      }]).then(orders => orders[0])
      
      vendorOrders.push(vendorOrder)
    }
    
    return vendorOrders
  }
  
  /**
   * Get vendor orders for a specific vendor
   */
  async getVendorOrders(vendorId: string, filters?: any) {
    return await this.listVendorOrders({
      filters: {
        vendor_id: vendorId,
        ...filters
      }
    })
  }
  
  /**
   * Update vendor order status
   */
  async updateVendorOrderStatus(vendorOrderId: string, status: string) {
    const updateData: any = { status }
    
    // Set timestamps based on status
    switch (status) {
      case "fulfilled":
        updateData.fulfilled_at = new Date()
        break
      case "shipped":
        updateData.shipped_at = new Date()
        break
      case "delivered":
        updateData.delivered_at = new Date()
        break
      case "cancelled":
        updateData.cancelled_at = new Date()
        break
    }
    
    return await this.updateVendorOrders([{ id: vendorOrderId, ...updateData }]).then(orders => orders[0])
  }
  
  /**
   * Start vendor onboarding
   */
  async startVendorOnboarding(vendorId: string) {
    return await this.vendorOnboardingService.startOnboarding(vendorId)
  }
  
  /**
   * Get vendor onboarding status
   */
  async getVendorOnboardingStatus(vendorId: string) {
    return await this.vendorOnboardingService.getOnboardingStatus(vendorId)
  }
  
  /**
   * Complete onboarding step
   */
  async completeOnboardingStep(vendorId: string, step: string, data?: any) {
    return await this.vendorOnboardingService.completeOnboardingStep(vendorId, step, data)
  }
  
  /**
   * Get Stripe onboarding link
   */
  async getStripeOnboardingLink(vendorId: string) {
    return await this.vendorOnboardingService.getStripeOnboardingLink(vendorId)
  }
  
  /**
   * Handle Stripe Connect return
   */
  async handleStripeReturn(vendorId: string) {
    return await this.vendorOnboardingService.handleStripeReturn(vendorId)
  }
  
  
  /**
   * Create vendor transfer
   */
  async createVendorTransfer(vendorId: string, amount: number, orderId: string, metadata?: any) {
    const vendor = await this.retrieveVendor(vendorId)
    
    if (!vendor || !vendor.stripe_account_id) {
      throw new Error("Vendor does not have a Stripe Connect account")
    }
    
    return await this.stripeConnectService.createTransfer(
      vendor.stripe_account_id,
      amount,
      "usd",
      orderId,
      metadata
    )
  }
  
  /**
   * Get vendor Stripe dashboard link
   */
  async getVendorStripeDashboard(vendorId: string) {
    const vendor = await this.retrieveVendor(vendorId)
    
    if (!vendor || !vendor.stripe_account_id) {
      throw new Error("Vendor does not have a Stripe Connect account")
    }
    
    return await this.stripeConnectService.createLoginLink(vendor.stripe_account_id)
  }
  
  /**
   * Calculate optimal fulfillment routing
   */
  async calculateFulfillmentRouting(request: any) {
    return await this.fulfillmentRoutingService.calculateOptimalRouting(request)
  }
  
  /**
   * Create fulfillment location
   */
  async createFulfillmentLocation(data: any) {
    return await this.createFulfillmentLocations([data]).then(locations => locations[0])
  }
  
  /**
   * Update fulfillment location
   */
  async updateFulfillmentLocation(id: string, data: any) {
    return await this.updateFulfillmentLocations([{ id, ...data }]).then(locations => locations[0])
  }
  
  /**
   * Get fulfillment locations with filters
   */
  async getFulfillmentLocations(filters?: any) {
    return await this.listFulfillmentLocations(filters)
  }
  
  /**
   * Create routing rule
   */
  async createRoutingRule(data: any) {
    return await this.createRoutingRules([data]).then(rules => rules[0])
  }
  
  /**
   * Update routing rule
   */
  async updateRoutingRule(id: string, data: any) {
    return await this.updateRoutingRules([{ id, ...data }]).then(rules => rules[0])
  }
  
  /**
   * Get routing rules with filters
   */
  async getRoutingRules(filters?: any) {
    return await this.listRoutingRules(filters)
  }
  
  /**
   * Assign vendor to fulfillment location
   */
  async assignVendorToLocation(vendorId: string, locationId: string) {
    const location = await this.retrieveFulfillmentLocation(locationId)
    if (!location) {
      throw new Error("Fulfillment location not found")
    }
    
    return await this.updateFulfillmentLocation(locationId, {
      vendor_id: vendorId
    })
  }

  /**
   * Record commission for an order
   */
  async recordOrderCommission(orderId: string, vendorId: string, orderTotal: number) {
    return await this.commissionTrackingService.recordCommission(orderId, vendorId, orderTotal)
  }

  /**
   * Get vendor commission report
   */
  async getVendorCommissionReport(vendorId: string, startDate?: Date, endDate?: Date) {
    return await this.commissionTrackingService.getVendorCommissionReport(vendorId, startDate, endDate)
  }

  /**
   * Get platform commission analytics
   */
  async getPlatformCommissionAnalytics(startDate?: Date, endDate?: Date) {
    return await this.commissionTrackingService.getPlatformCommissionAnalytics(startDate, endDate)
  }

  /**
   * Mark commission as collected
   */
  async markCommissionCollected(orderId: string) {
    return await this.commissionTrackingService.markCommissionCollected(orderId)
  }

  /**
   * Mark commissions as paid
   */
  async markCommissionsPaid(commissionIds: string[], payoutId: string) {
    return await this.commissionTrackingService.markCommissionPaid(commissionIds, payoutId)
  }

  /**
   * Update vendor monthly volume
   */
  async updateVendorMonthlyVolume(vendorId: string, amount: number) {
    return await this.commissionTrackingService.updateMonthlyVolume(vendorId, amount)
  }

  /**
   * Update vendor commission tier
   */
  async updateVendorCommissionTier(vendorId: string) {
    return await this.commissionTrackingService.updateVendorTier(vendorId)
  }

  /**
   * Create vendor payout
   */
  async createVendorPayout(vendorId: string, options?: any) {
    return await this.vendorPayoutService.createPayout(vendorId, options)
  }

  /**
   * Process vendor payout
   */
  async processVendorPayout(payoutId: string) {
    return await this.vendorPayoutService.processPayout(payoutId)
  }

  /**
   * Get vendor payouts
   */
  async getVendorPayouts(vendorId: string, options?: any) {
    return await this.vendorPayoutService.getVendorPayouts(vendorId, options)
  }

  /**
   * Calculate next payout
   */
  async calculateNextPayout(vendorId: string) {
    return await this.vendorPayoutService.calculateNextPayout(vendorId)
  }

  /**
   * Create batch payouts
   */
  async createBatchPayouts(options?: any) {
    return await this.vendorPayoutService.createBatchPayouts(options)
  }

  /**
   * Handle Stripe transfer webhook
   */
  async handleStripeTransferWebhook(event: any) {
    return await this.vendorPayoutService.handleTransferWebhook(event)
  }
}

export default MarketplaceModuleService