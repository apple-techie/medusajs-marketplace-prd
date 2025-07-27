// Stripe Connect Service for Marketplace Vendor Management
// src/services/stripe-marketplace.ts

import { TransactionBaseService } from "@medusajs/framework/utils"
import Stripe from "stripe"

type StripeMarketplaceServiceOptions = {
  stripe_api_key: string
  platform_fee_percentage: number // e.g., 15 for 15%
}

export default class StripeMarketplaceService extends TransactionBaseService {
  protected stripe_: Stripe
  protected platformFeePercentage_: number

  constructor(container: any, options: StripeMarketplaceServiceOptions) {
    super(container)
    
    this.stripe_ = new Stripe(options.stripe_api_key, {
      apiVersion: "2023-10-16",
    })
    
    this.platformFeePercentage_ = options.platform_fee_percentage || 15
  }

  /**
   * Create a Stripe Connect account for a vendor
   */
  async createVendorAccount(vendor: {
    email: string
    name: string
    id: string
    country?: string
  }): Promise<Stripe.Account> {
    return await this.stripe_.accounts.create({
      type: "express", // or "standard" for more control
      country: vendor.country || "US",
      email: vendor.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "company",
      company: {
        name: vendor.name,
      },
      metadata: {
        vendor_id: vendor.id,
      },
    })
  }

  /**
   * Create an account link for vendor onboarding
   */
  async createAccountLink(
    accountId: string,
    refreshUrl: string,
    returnUrl: string
  ): Promise<Stripe.AccountLink> {
    return await this.stripe_.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    })
  }

  /**
   * Create a payment intent with platform fee
   */
  async createPaymentIntentWithFee(params: {
    amount: number
    currency: string
    vendorAccountId: string
    orderId: string
    customerId?: string
  }): Promise<Stripe.PaymentIntent> {
    const platformFee = Math.round(params.amount * this.platformFeePercentage_ / 100)
    
    return await this.stripe_.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      application_fee_amount: platformFee,
      transfer_data: {
        destination: params.vendorAccountId,
      },
      metadata: {
        order_id: params.orderId,
        vendor_account_id: params.vendorAccountId,
      },
      customer: params.customerId,
    })
  }

  /**
   * Create a transfer to vendor (for manual payouts)
   */
  async createTransferToVendor(params: {
    amount: number
    currency: string
    vendorAccountId: string
    orderId: string
  }): Promise<Stripe.Transfer> {
    return await this.stripe_.transfers.create({
      amount: params.amount,
      currency: params.currency,
      destination: params.vendorAccountId,
      metadata: {
        order_id: params.orderId,
      },
    })
  }

  /**
   * Get vendor account balance
   */
  async getVendorBalance(vendorAccountId: string): Promise<Stripe.Balance> {
    return await this.stripe_.balance.retrieve({
      stripeAccount: vendorAccountId,
    })
  }

  /**
   * List vendor transactions
   */
  async listVendorTransactions(
    vendorAccountId: string,
    limit: number = 10
  ): Promise<Stripe.BalanceTransaction[]> {
    const transactions = await this.stripe_.balanceTransactions.list(
      {
        limit,
      },
      {
        stripeAccount: vendorAccountId,
      }
    )
    
    return transactions.data
  }

  /**
   * Create a payout for vendor
   */
  async createVendorPayout(params: {
    vendorAccountId: string
    amount?: number // If not specified, pays out full balance
    currency: string
  }): Promise<Stripe.Payout> {
    return await this.stripe_.payouts.create(
      {
        amount: params.amount,
        currency: params.currency,
      },
      {
        stripeAccount: params.vendorAccountId,
      }
    )
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(
    payload: string | Buffer,
    signature: string,
    endpointSecret: string
  ): Promise<Stripe.Event> {
    return this.stripe_.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret
    )
  }

  /**
   * Update platform fee percentage
   */
  updatePlatformFee(percentage: number): void {
    this.platformFeePercentage_ = percentage
  }
}