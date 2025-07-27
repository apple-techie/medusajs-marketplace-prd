import { MedusaError } from "@medusajs/framework/utils"
import Stripe from "stripe"

export interface StripeConnectAccount {
  stripe_account_id: string
  account_type: string
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
  verification_status: string
  created_at: Date
}

export interface OnboardingStatus {
  completed: boolean
  requirements_due: string[]
  currently_due: string[]
  eventually_due: string[]
  disabled_reason?: string
  account_link?: string
}

export class StripeConnectService {
  private stripe: Stripe
  
  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "STRIPE_SECRET_KEY is not configured"
      )
    }
    
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-06-30.basil"
    })
  }
  
  /**
   * Create a Stripe Connect account for a vendor
   */
  async createConnectAccount(vendor: any): Promise<Stripe.Account> {
    try {
      const accountData: Stripe.AccountCreateParams = {
        type: "express", // Express accounts for simplified onboarding
        country: vendor.metadata?.country || "US",
        email: vendor.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true }
        },
        business_type: "company",
        company: {
          name: vendor.name,
          phone: vendor.metadata?.phone
        },
        business_profile: {
          name: vendor.name,
          url: vendor.website,
          mcc: this.getMccForVendorType(vendor.type)
        },
        metadata: {
          vendor_id: vendor.id,
          vendor_type: vendor.type,
          platform: "marketplace"
        }
      }
      
      // Add additional fields for different vendor types
      if (vendor.type === "distributor") {
        accountData.business_profile!.product_description = "Fulfillment and distribution services"
      }
      
      const account = await this.stripe.accounts.create(accountData)
      
      return account
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to create Stripe Connect account: ${error.message}`
      )
    }
  }
  
  /**
   * Get or create a Stripe Connect account link for onboarding
   */
  async createAccountLink(
    stripeAccountId: string,
    returnUrl: string,
    refreshUrl: string
  ): Promise<Stripe.AccountLink> {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding"
      })
      
      return accountLink
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to create account link: ${error.message}`
      )
    }
  }
  
  /**
   * Check the onboarding status of a Stripe Connect account
   */
  async getOnboardingStatus(stripeAccountId: string): Promise<OnboardingStatus> {
    try {
      const account = await this.stripe.accounts.retrieve(stripeAccountId)
      
      const status: OnboardingStatus = {
        completed: account.details_submitted && account.charges_enabled && account.payouts_enabled,
        requirements_due: account.requirements?.currently_due || [],
        currently_due: account.requirements?.currently_due || [],
        eventually_due: account.requirements?.eventually_due || [],
        disabled_reason: account.requirements?.disabled_reason || undefined
      }
      
      // If onboarding is not complete, generate a new account link
      if (!status.completed && status.currently_due.length > 0) {
        const accountLink = await this.createAccountLink(
          stripeAccountId,
          `${process.env.VENDOR_PORTAL_URL}/onboarding/complete`,
          `${process.env.VENDOR_PORTAL_URL}/onboarding/refresh`
        )
        status.account_link = accountLink.url
      }
      
      return status
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to get onboarding status: ${error.message}`
      )
    }
  }
  
  /**
   * Update a Stripe Connect account
   */
  async updateAccount(stripeAccountId: string, updates: Stripe.AccountUpdateParams): Promise<Stripe.Account> {
    try {
      const account = await this.stripe.accounts.update(stripeAccountId, updates)
      return account
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to update Stripe account: ${error.message}`
      )
    }
  }
  
  /**
   * Create a payout for a vendor
   */
  async createPayout(
    stripeAccountId: string,
    amount: number,
    currency: string = "usd",
    metadata?: any
  ): Promise<Stripe.Payout> {
    try {
      const payout = await this.stripe.payouts.create(
        {
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          metadata: metadata || {}
        },
        {
          stripeAccount: stripeAccountId
        }
      )
      
      return payout
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to create payout: ${error.message}`
      )
    }
  }
  
  /**
   * Create a transfer to a connected account
   */
  async createTransfer(
    stripeAccountId: string,
    amount: number,
    currency: string = "usd",
    orderId: string,
    metadata?: any
  ): Promise<Stripe.Transfer> {
    try {
      const transfer = await this.stripe.transfers.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        destination: stripeAccountId,
        transfer_group: `order_${orderId}`,
        metadata: {
          order_id: orderId,
          ...metadata
        }
      })
      
      return transfer
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to create transfer: ${error.message}`
      )
    }
  }
  
  /**
   * Get the balance for a connected account
   */
  async getAccountBalance(stripeAccountId: string): Promise<Stripe.Balance> {
    try {
      const balance = await this.stripe.balance.retrieve({
        stripeAccount: stripeAccountId
      })
      
      return balance
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to get account balance: ${error.message}`
      )
    }
  }
  
  /**
   * Create a login link for Express Dashboard
   */
  async createLoginLink(stripeAccountId: string): Promise<Stripe.LoginLink> {
    try {
      const loginLink = await this.stripe.accounts.createLoginLink(stripeAccountId)
      return loginLink
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to create login link: ${error.message}`
      )
    }
  }
  
  /**
   * Get MCC (Merchant Category Code) based on vendor type
   */
  private getMccForVendorType(vendorType: string): string {
    const mccMap = {
      shop: "5999", // Miscellaneous retail
      brand: "5699", // Miscellaneous apparel and accessory
      distributor: "5045" // Computers and software
    }
    
    return mccMap[vendorType] || "5999"
  }
  
  /**
   * Handle webhook events from Stripe
   */
  async handleWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "account.updated":
        // Handle account updates
        const account = event.data.object as Stripe.Account
        console.log(`Account ${account.id} was updated`)
        break
        
      case "account.application.authorized":
        // Handle when vendor authorizes the application
        console.log("Account application authorized")
        break
        
      case "account.application.deauthorized":
        // Handle when vendor deauthorizes the application
        console.log("Account application deauthorized")
        break
        
      case "payout.paid":
        // Handle successful payouts
        const payout = event.data.object as Stripe.Payout
        console.log(`Payout ${payout.id} was paid`)
        break
        
      case "payout.failed":
        // Handle failed payouts
        const failedPayout = event.data.object as Stripe.Payout
        console.log(`Payout ${failedPayout.id} failed`)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  }
}

export default StripeConnectService