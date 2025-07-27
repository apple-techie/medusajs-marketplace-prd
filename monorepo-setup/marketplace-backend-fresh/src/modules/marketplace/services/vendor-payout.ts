import { MedusaError } from "@medusajs/framework/utils"
import Stripe from "stripe"
import { 
  Payout,
  PayoutAdjustment,
  CommissionRecord,
  Vendor
} from "../models"

export class VendorPayoutService {
  private vendorService: any
  private commissionRecordService: any
  private payoutService: any
  private payoutAdjustmentService: any
  private stripeConnectService: any
  private stripe: Stripe

  constructor(container: any) {
    this.vendorService = container.vendorService
    this.commissionRecordService = container.commissionRecordService
    this.payoutService = container.payoutService
    this.payoutAdjustmentService = container.payoutAdjustmentService
    this.stripeConnectService = container.stripeConnectService
    
    // Initialize Stripe
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-06-30.basil"
    })
  }

  /**
   * Create a payout for a vendor
   */
  async createPayout(vendorId: string, options?: {
    endDate?: Date
    adjustments?: Array<{
      type: string
      amount: number
      description: string
    }>
  }) {
    const vendor = await this.vendorService.retrieve(vendorId)
    
    if (!vendor) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Vendor ${vendorId} not found`
      )
    }

    if (!vendor.stripe_account_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Vendor has not completed Stripe Connect onboarding"
      )
    }

    // Get unpaid commissions
    const unpaidCommissions = await this.getUnpaidCommissions(vendorId, options?.endDate)
    
    if (unpaidCommissions.length === 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No unpaid commissions found for this vendor"
      )
    }

    // Calculate payout amount
    const commissionTotal = unpaidCommissions.reduce(
      (sum, record) => sum + record.net_amount, 
      0
    )

    // Apply adjustments if any
    let adjustmentTotal = 0
    const adjustmentRecords: any[] = []
    
    if (options?.adjustments) {
      for (const adj of options.adjustments) {
        adjustmentTotal += adj.amount
        adjustmentRecords.push({
          type: adj.type,
          amount: adj.amount,
          description: adj.description
        })
      }
    }

    const payoutAmount = commissionTotal + adjustmentTotal

    if (payoutAmount <= 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Payout amount must be greater than zero"
      )
    }

    // Create payout record
    const payout = await this.payoutService.create({
      vendor_id: vendorId,
      amount: payoutAmount,
      commission_total: commissionTotal,
      adjustment_total: adjustmentTotal,
      commission_count: unpaidCommissions.length,
      status: "pending",
      period_start: unpaidCommissions[0].created_at,
      period_end: options?.endDate || new Date()
    })

    // Create adjustment records if any
    if (adjustmentRecords.length > 0) {
      for (const adj of adjustmentRecords) {
        await this.payoutAdjustmentService.create({
          type: adj.type,
          amount: adj.amount,
          description: adj.description,
          payout_id: payout.id
        })
      }
    }

    // Mark commissions as included in payout
    const commissionIds = unpaidCommissions.map(c => c.id)
    await this.commissionRecordService.update(commissionIds, {
      payout_id: payout.id,
      status: "processing"
    })

    return payout
  }

  /**
   * Process a payout through Stripe
   */
  async processPayout(payoutId: string) {
    const payout = await this.payoutService.retrieve(payoutId, {
      relations: ["vendor"]
    })

    if (!payout) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Payout ${payoutId} not found`
      )
    }

    if (payout.status !== "pending") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Payout is not in pending status`
      )
    }

    try {
      // Create Stripe transfer
      const transfer = await this.stripe.transfers.create({
        amount: Math.round(payout.amount * 100), // Convert to cents
        currency: "usd",
        destination: payout.vendor.stripe_account_id,
        description: `Marketplace payout for period ${payout.period_start.toISOString().split('T')[0]} to ${payout.period_end.toISOString().split('T')[0]}`,
        metadata: {
          payout_id: payout.id,
          vendor_id: payout.vendor_id,
          commission_count: payout.commission_count.toString()
        }
      })

      // Update payout with Stripe transfer ID
      await this.payoutService.update(payoutId, {
        stripe_transfer_id: transfer.id,
        status: "processing",
        processed_at: new Date()
      })

      // Update commission records
      const commissions = await this.commissionRecordService.list({
        filters: { payout_id: payoutId }
      })

      const commissionIds = commissions.map(c => c.id)
      await this.commissionRecordService.update(commissionIds, {
        status: "paid"
      })

      return { payout, transfer }
    } catch (error) {
      // Update payout status to failed
      await this.payoutService.update(payoutId, {
        status: "failed",
        failed_at: new Date(),
        failure_reason: error.message
      })

      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to process payout: ${error.message}`
      )
    }
  }

  /**
   * Get unpaid commissions for a vendor
   */
  async getUnpaidCommissions(vendorId: string, endDate?: Date) {
    const filters: any = {
      vendor_id: vendorId,
      status: "collected",
      payout_id: null
    }

    if (endDate) {
      filters.created_at = { $lte: endDate }
    }

    return await this.commissionRecordService.list({ filters })
  }

  /**
   * Get payout history for a vendor
   */
  async getVendorPayouts(vendorId: string, options?: {
    status?: string
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }) {
    const filters: any = { vendor_id: vendorId }

    if (options?.status) {
      filters.status = options.status
    }

    if (options?.startDate || options?.endDate) {
      filters.created_at = {}
      if (options.startDate) {
        filters.created_at.$gte = options.startDate
      }
      if (options.endDate) {
        filters.created_at.$lte = options.endDate
      }
    }

    const payouts = await this.payoutService.list({
      filters,
      limit: options?.limit || 20,
      offset: options?.offset || 0,
      relations: ["adjustments"]
    })

    // Calculate summary statistics
    const summary = payouts.reduce((acc, payout) => {
      acc.total_count += 1
      acc.total_amount += payout.amount
      
      if (!acc.by_status[payout.status]) {
        acc.by_status[payout.status] = {
          count: 0,
          amount: 0
        }
      }
      
      acc.by_status[payout.status].count += 1
      acc.by_status[payout.status].amount += payout.amount
      
      return acc
    }, {
      total_count: 0,
      total_amount: 0,
      by_status: {}
    })

    return {
      payouts,
      summary
    }
  }

  /**
   * Calculate next payout amount for a vendor
   */
  async calculateNextPayout(vendorId: string) {
    const unpaidCommissions = await this.getUnpaidCommissions(vendorId)
    
    const commissionTotal = unpaidCommissions.reduce(
      (sum, record) => sum + record.net_amount, 
      0
    )

    return {
      vendor_id: vendorId,
      commission_count: unpaidCommissions.length,
      commission_total: commissionTotal,
      estimated_payout: commissionTotal,
      period_start: unpaidCommissions.length > 0 ? unpaidCommissions[0].created_at : null,
      period_end: new Date()
    }
  }

  /**
   * Handle Stripe webhook for transfer updates
   */
  async handleTransferWebhook(event: Stripe.Event) {
    const transfer = event.data.object as Stripe.Transfer

    if (!transfer.metadata?.payout_id) {
      return // Not a marketplace payout
    }

    const payoutId = transfer.metadata.payout_id
    const payout = await this.payoutService.retrieve(payoutId)

    if (!payout) {
      console.error(`Payout ${payoutId} not found for transfer ${transfer.id}`)
      return
    }

    switch (event.type) {
      case "transfer.created":
        // Already handled in processPayout
        break

      // Note: transfer.paid and transfer.failed are not in the current Stripe types
      // We'll handle these cases if they become available

      case "transfer.reversed":
        await this.payoutService.update(payoutId, {
          status: "reversed",
          reversed_at: new Date()
        })
        break
    }
  }

  /**
   * Create batch payouts for all eligible vendors
   */
  async createBatchPayouts(options?: {
    vendorIds?: string[]
    endDate?: Date
    minAmount?: number
  }) {
    let vendors: any[]
    
    if (options?.vendorIds) {
      vendors = await this.vendorService.list({
        filters: { 
          id: options.vendorIds,
          stripe_account_id: { $ne: null },
          status: "active"
        }
      })
    } else {
      vendors = await this.vendorService.list({
        filters: { 
          stripe_account_id: { $ne: null },
          status: "active"
        }
      })
    }

    const results: any[] = []
    
    for (const vendor of vendors) {
      try {
        // Calculate payout amount
        const payoutCalc = await this.calculateNextPayout(vendor.id)
        
        // Skip if below minimum amount
        if (options?.minAmount && payoutCalc.estimated_payout < options.minAmount) {
          results.push({
            vendor_id: vendor.id,
            status: "skipped",
            reason: `Below minimum amount of ${options.minAmount}`
          })
          continue
        }

        // Skip if no unpaid commissions
        if (payoutCalc.commission_count === 0) {
          results.push({
            vendor_id: vendor.id,
            status: "skipped",
            reason: "No unpaid commissions"
          })
          continue
        }

        // Create payout
        const payout = await this.createPayout(vendor.id, {
          endDate: options?.endDate
        })

        results.push({
          vendor_id: vendor.id,
          status: "created",
          payout_id: payout.id,
          amount: payout.amount
        })
      } catch (error) {
        results.push({
          vendor_id: vendor.id,
          status: "failed",
          error: error.message
        })
      }
    }

    return {
      total_vendors: vendors.length,
      created: results.filter(r => r.status === "created").length,
      skipped: results.filter(r => r.status === "skipped").length,
      failed: results.filter(r => r.status === "failed").length,
      results
    }
  }
}