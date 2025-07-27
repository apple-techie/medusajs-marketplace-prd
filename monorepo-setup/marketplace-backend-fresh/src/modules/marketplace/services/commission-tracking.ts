import { MedusaError } from "@medusajs/framework/utils"
import { 
  CommissionRecord, 
  VendorPlatformFee,
  VendorMonthlyVolume,
  Vendor,
  VendorOrder
} from "../models"
import { VendorType } from "../models/vendor"

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

export class CommissionTrackingService {
  private vendorService: any
  private commissionRecordService: any
  private platformFeeService: any
  private monthlyVolumeService: any
  private vendorOrderService: any

  constructor(container: any) {
    this.vendorService = container.vendorService
    this.commissionRecordService = container.commissionRecordService
    this.platformFeeService = container.vendorPlatformFeeService
    this.monthlyVolumeService = container.vendorMonthlyVolumeService
    this.vendorOrderService = container.vendorOrderService
  }

  /**
   * Calculate commission for a vendor order
   */
  async calculateOrderCommission(orderId: string, vendorId: string, orderTotal: number) {
    const vendor = await this.vendorService.retrieve(vendorId)
    
    if (!vendor) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Vendor ${vendorId} not found`
      )
    }

    // Get current commission rate
    const commissionRate = vendor.commission_rate / 100
    const commissionAmount = orderTotal * commissionRate
    const netAmount = orderTotal - commissionAmount

    return {
      vendor_id: vendorId,
      order_id: orderId,
      order_total: orderTotal,
      commission_rate: vendor.commission_rate,
      commission_amount: Math.round(commissionAmount * 100) / 100,
      net_amount: Math.round(netAmount * 100) / 100,
      vendor_type: vendor.type,
      commission_tier: vendor.commission_tier
    }
  }

  /**
   * Record commission for an order
   */
  async recordCommission(orderId: string, vendorId: string, orderTotal: number) {
    const commission = await this.calculateOrderCommission(orderId, vendorId, orderTotal)
    
    // Create commission record
    const commissionRecord = await this.commissionRecordService.create({
      vendor_id: vendorId,
      order_id: orderId,
      order_total: orderTotal,
      commission_rate: commission.commission_rate,
      commission_amount: commission.commission_amount,
      net_amount: commission.net_amount,
      status: "pending"
    })

    // Update vendor's total commission
    await this.vendorService.update(vendorId, {
      $inc: { 
        total_commission: commission.commission_amount,
        total_revenue: orderTotal
      }
    })

    // Update monthly volume
    await this.updateMonthlyVolume(vendorId, orderTotal)

    return commissionRecord
  }

  /**
   * Update vendor's monthly volume
   */
  async updateMonthlyVolume(vendorId: string, amount: number) {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    // Find or create monthly volume record
    const existingVolume = await this.monthlyVolumeService.list({
      filters: {
        vendor_id: vendorId,
        month,
        year
      }
    })

    if (existingVolume.length > 0) {
      // Update existing record
      await this.monthlyVolumeService.update(existingVolume[0].id, {
        $inc: {
          total_sales: amount,
          order_count: 1
        }
      })
    } else {
      // Create new record
      await this.monthlyVolumeService.create({
        vendor_id: vendorId,
        month,
        year,
        total_sales: amount,
        order_count: 1,
        commission_tier: await this.determineCommissionTier(vendorId, amount)
      })
    }

    // Check if tier should be updated (for shop partners)
    const vendor = await this.vendorService.retrieve(vendorId)
    if (vendor.type === VendorType.SHOP) {
      await this.updateVendorTier(vendorId)
    }
  }

  /**
   * Determine commission tier based on monthly volume
   */
  async determineCommissionTier(vendorId: string, currentMonthSales: number): Promise<string> {
    const vendor = await this.vendorService.retrieve(vendorId)
    
    if (vendor.type !== VendorType.SHOP) {
      return vendor.commission_tier || "fixed"
    }

    // Get last 3 months' average for tier calculation
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const volumes = await this.monthlyVolumeService.list({
      filters: {
        vendor_id: vendorId,
        created_at: { $gte: threeMonthsAgo }
      }
    })

    const totalSales = volumes.reduce((sum, vol) => sum + vol.total_sales, 0) + currentMonthSales
    const avgMonthlySales = totalSales / Math.max(volumes.length, 1)

    if (avgMonthlySales >= SHOP_COMMISSION_TIERS.gold.min) {
      return "gold"
    } else if (avgMonthlySales >= SHOP_COMMISSION_TIERS.silver.min) {
      return "silver"
    }
    return "bronze"
  }

  /**
   * Update vendor's commission tier
   */
  async updateVendorTier(vendorId: string) {
    const vendor = await this.vendorService.retrieve(vendorId)
    
    if (vendor.type !== VendorType.SHOP) {
      return vendor
    }

    const newTier = await this.determineCommissionTier(vendorId, 0)
    const tierConfig = SHOP_COMMISSION_TIERS[newTier]
    
    if (vendor.commission_tier !== newTier) {
      return await this.vendorService.update(vendorId, {
        commission_tier: newTier,
        commission_rate: tierConfig.rate
      })
    }

    return vendor
  }

  /**
   * Get commission report for a vendor
   */
  async getVendorCommissionReport(vendorId: string, startDate?: Date, endDate?: Date) {
    const filters: any = { vendor_id: vendorId }
    
    if (startDate) {
      filters.created_at = { $gte: startDate }
    }
    if (endDate) {
      filters.created_at = { ...(filters.created_at || {}), $lte: endDate }
    }

    const commissions = await this.commissionRecordService.list({ filters })
    
    const summary = commissions.reduce((acc, record) => {
      acc.total_orders += 1
      acc.total_sales += record.order_total
      acc.total_commission += record.commission_amount
      acc.total_net += record.net_amount
      
      if (!acc.by_status[record.status]) {
        acc.by_status[record.status] = {
          count: 0,
          commission: 0,
          net: 0
        }
      }
      
      acc.by_status[record.status].count += 1
      acc.by_status[record.status].commission += record.commission_amount
      acc.by_status[record.status].net += record.net_amount
      
      return acc
    }, {
      total_orders: 0,
      total_sales: 0,
      total_commission: 0,
      total_net: 0,
      by_status: {}
    })

    return {
      vendor_id: vendorId,
      period: {
        start: startDate,
        end: endDate
      },
      summary,
      records: commissions
    }
  }

  /**
   * Get platform-wide commission analytics
   */
  async getPlatformCommissionAnalytics(startDate?: Date, endDate?: Date) {
    const filters: any = {}
    
    if (startDate) {
      filters.created_at = { $gte: startDate }
    }
    if (endDate) {
      filters.created_at = { ...(filters.created_at || {}), $lte: endDate }
    }

    const commissions = await this.commissionRecordService.list({ filters })
    
    // Group by vendor type
    const byVendorType = await this.groupCommissionsByVendorType(commissions)
    
    // Group by status
    const byStatus = commissions.reduce((acc, record) => {
      if (!acc[record.status]) {
        acc[record.status] = {
          count: 0,
          total_sales: 0,
          total_commission: 0,
          total_net: 0
        }
      }
      
      acc[record.status].count += 1
      acc[record.status].total_sales += record.order_total
      acc[record.status].total_commission += record.commission_amount
      acc[record.status].total_net += record.net_amount
      
      return acc
    }, {})

    // Calculate totals
    const totals = commissions.reduce((acc, record) => {
      acc.total_orders += 1
      acc.total_sales += record.order_total
      acc.total_commission += record.commission_amount
      acc.total_net += record.net_amount
      return acc
    }, {
      total_orders: 0,
      total_sales: 0,
      total_commission: 0,
      total_net: 0
    })

    return {
      period: {
        start: startDate,
        end: endDate
      },
      totals,
      by_vendor_type: byVendorType,
      by_status: byStatus
    }
  }

  /**
   * Group commissions by vendor type
   */
  private async groupCommissionsByVendorType(commissions: any[]) {
    const vendorIds = [...new Set(commissions.map(c => c.vendor_id))]
    const vendors = await this.vendorService.list({
      filters: { id: vendorIds }
    })
    
    const vendorMap = vendors.reduce((map, vendor) => {
      map[vendor.id] = vendor
      return map
    }, {})

    return commissions.reduce((acc, record) => {
      const vendor = vendorMap[record.vendor_id]
      const type = vendor?.type || "unknown"
      
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          total_sales: 0,
          total_commission: 0,
          total_net: 0,
          avg_commission_rate: 0
        }
      }
      
      acc[type].count += 1
      acc[type].total_sales += record.order_total
      acc[type].total_commission += record.commission_amount
      acc[type].total_net += record.net_amount
      
      // Recalculate average
      acc[type].avg_commission_rate = 
        (acc[type].total_commission / acc[type].total_sales) * 100
      
      return acc
    }, {})
  }

  /**
   * Mark commission as collected when order is completed
   */
  async markCommissionCollected(orderId: string) {
    const commission = await this.commissionRecordService.list({
      filters: { order_id: orderId }
    })

    if (commission.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Commission record for order ${orderId} not found`
      )
    }

    return await this.commissionRecordService.update(commission[0].id, {
      status: "collected",
      collected_at: new Date()
    })
  }

  /**
   * Mark commission as paid out
   */
  async markCommissionPaid(commissionIds: string[], payoutId: string) {
    const updates = await Promise.all(
      commissionIds.map(id => 
        this.commissionRecordService.update(id, {
          status: "paid",
          payout_id: payoutId,
          paid_at: new Date()
        })
      )
    )

    return updates
  }
}