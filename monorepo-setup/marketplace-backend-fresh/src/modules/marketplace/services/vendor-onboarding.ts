import { MedusaError } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../service"
import StripeConnectService from "./stripe-connect"
import { VendorStatus } from "../models/vendor"

export interface OnboardingStep {
  step: string
  completed: boolean
  required: boolean
  description: string
}

export interface VendorOnboardingStatus {
  vendor_id: string
  overall_status: "not_started" | "in_progress" | "completed" | "blocked"
  steps: OnboardingStep[]
  stripe_onboarding_url?: string
  blockers?: string[]
}

export class VendorOnboardingService {
  private marketplaceService: MarketplaceModuleService
  private stripeConnect: StripeConnectService
  
  constructor(marketplaceService: MarketplaceModuleService) {
    this.marketplaceService = marketplaceService
    this.stripeConnect = new StripeConnectService()
  }
  
  /**
   * Start the onboarding process for a vendor
   */
  async startOnboarding(vendorId: string): Promise<VendorOnboardingStatus> {
    const vendor = await this.marketplaceService.retrieveVendor(vendorId)
    
    if (!vendor) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Vendor not found"
      )
    }
    
    // Create Stripe Connect account if not exists
    if (!vendor.stripe_account_id) {
      const stripeAccount = await this.stripeConnect.createConnectAccount(vendor)
      
      await this.marketplaceService.updateVendor(vendorId, {
        stripe_account_id: stripeAccount.id,
        stripe_onboarding_started_at: new Date()
      })
      
      vendor.stripe_account_id = stripeAccount.id
    }
    
    // Get onboarding status
    const onboardingStatus = await this.getOnboardingStatus(vendorId)
    
    return onboardingStatus
  }
  
  /**
   * Get the current onboarding status for a vendor
   */
  async getOnboardingStatus(vendorId: string): Promise<VendorOnboardingStatus> {
    const vendor = await this.marketplaceService.retrieveVendor(vendorId)
    
    if (!vendor) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Vendor not found"
      )
    }
    
    const steps: OnboardingStep[] = [
      {
        step: "basic_information",
        completed: this.isBasicInfoComplete(vendor),
        required: true,
        description: "Complete basic business information"
      },
      {
        step: "address_verification",
        completed: this.isAddressComplete(vendor),
        required: true,
        description: "Verify business address"
      },
      {
        step: "tax_information",
        completed: !!vendor.tax_id,
        required: true,
        description: "Provide tax identification"
      },
      {
        step: "stripe_connect",
        completed: vendor.stripe_onboarding_completed,
        required: true,
        description: "Complete Stripe Connect setup for payments"
      },
      {
        step: "business_verification",
        completed: !!vendor.verified_at,
        required: false,
        description: "Verify business documentation"
      }
    ]
    
    // Get Stripe onboarding status if account exists
    let stripeOnboardingUrl: string | undefined
    let blockers: string[] = []
    
    if (vendor.stripe_account_id) {
      try {
        const stripeStatus = await this.stripeConnect.getOnboardingStatus(vendor.stripe_account_id)
        
        // Update vendor with Stripe status
        await this.marketplaceService.updateVendor(vendorId, {
          stripe_charges_enabled: stripeStatus.completed && stripeStatus.requirements_due.length === 0,
          stripe_payouts_enabled: stripeStatus.completed,
          stripe_details_submitted: stripeStatus.completed,
          stripe_onboarding_completed: stripeStatus.completed,
          stripe_onboarding_completed_at: stripeStatus.completed ? new Date() : null
        })
        
        // Update the stripe_connect step
        const stripeStep = steps.find(s => s.step === "stripe_connect")
        if (stripeStep) {
          stripeStep.completed = stripeStatus.completed
        }
        
        stripeOnboardingUrl = stripeStatus.account_link
        
        if (stripeStatus.disabled_reason) {
          blockers.push(`Stripe account disabled: ${stripeStatus.disabled_reason}`)
        }
        
        if (stripeStatus.currently_due.length > 0) {
          blockers.push(`Stripe requirements pending: ${stripeStatus.currently_due.join(", ")}`)
        }
      } catch (error) {
        console.error("Failed to get Stripe status:", error)
        blockers.push("Unable to verify Stripe account status")
      }
    }
    
    // Determine overall status
    const requiredSteps = steps.filter(s => s.required)
    const completedRequiredSteps = requiredSteps.filter(s => s.completed)
    
    let overallStatus: VendorOnboardingStatus["overall_status"] = "not_started"
    if (completedRequiredSteps.length === requiredSteps.length) {
      overallStatus = "completed"
    } else if (completedRequiredSteps.length > 0) {
      overallStatus = "in_progress"
    } else if (blockers.length > 0) {
      overallStatus = "blocked"
    }
    
    return {
      vendor_id: vendorId,
      overall_status: overallStatus,
      steps,
      stripe_onboarding_url: stripeOnboardingUrl,
      blockers: blockers.length > 0 ? blockers : undefined
    }
  }
  
  /**
   * Complete a specific onboarding step
   */
  async completeOnboardingStep(vendorId: string, step: string, data?: any): Promise<VendorOnboardingStatus> {
    const vendor = await this.marketplaceService.retrieveVendor(vendorId)
    
    if (!vendor) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Vendor not found"
      )
    }
    
    switch (step) {
      case "basic_information":
        await this.marketplaceService.updateVendor(vendorId, {
          description: data.description,
          website: data.website,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone
        })
        break
        
      case "address_verification":
        await this.marketplaceService.updateVendor(vendorId, {
          address_line_1: data.address_line_1,
          address_line_2: data.address_line_2,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country_code: data.country_code
        })
        break
        
      case "tax_information":
        await this.marketplaceService.updateVendor(vendorId, {
          tax_id: data.tax_id
        })
        break
        
      case "business_verification":
        // In a real implementation, you would verify documents here
        await this.marketplaceService.updateVendor(vendorId, {
          verified_at: new Date(),
          metadata: {
            ...vendor.metadata,
            verification_documents: data.documents
          }
        })
        break
        
      default:
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Unknown onboarding step: ${step}`
        )
    }
    
    // Check if all onboarding is complete and activate vendor
    const status = await this.getOnboardingStatus(vendorId)
    if (status.overall_status === "completed") {
      await this.activateVendor(vendorId)
    }
    
    return status
  }
  
  /**
   * Generate Stripe Connect onboarding link
   */
  async getStripeOnboardingLink(vendorId: string): Promise<string> {
    const vendor = await this.marketplaceService.retrieveVendor(vendorId)
    
    if (!vendor) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Vendor not found"
      )
    }
    
    if (!vendor.stripe_account_id) {
      // Start onboarding if not started
      const onboardingStatus = await this.startOnboarding(vendorId)
      return onboardingStatus.stripe_onboarding_url || ""
    }
    
    const accountLink = await this.stripeConnect.createAccountLink(
      vendor.stripe_account_id,
      `${process.env.VENDOR_PORTAL_URL}/onboarding/complete?vendor_id=${vendorId}`,
      `${process.env.VENDOR_PORTAL_URL}/onboarding/refresh?vendor_id=${vendorId}`
    )
    
    return accountLink.url
  }
  
  /**
   * Handle Stripe Connect return (after onboarding)
   */
  async handleStripeReturn(vendorId: string): Promise<VendorOnboardingStatus> {
    const vendor = await this.marketplaceService.retrieveVendor(vendorId)
    
    if (!vendor || !vendor.stripe_account_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Vendor or Stripe account not found"
      )
    }
    
    // Get updated status from Stripe
    const stripeStatus = await this.stripeConnect.getOnboardingStatus(vendor.stripe_account_id)
    
    // Update vendor with latest Stripe status
    await this.marketplaceService.updateVendor(vendorId, {
      stripe_charges_enabled: stripeStatus.completed && stripeStatus.requirements_due.length === 0,
      stripe_payouts_enabled: stripeStatus.completed,
      stripe_details_submitted: stripeStatus.completed,
      stripe_onboarding_completed: stripeStatus.completed,
      stripe_onboarding_completed_at: stripeStatus.completed ? new Date() : null
    })
    
    // Get overall onboarding status
    const onboardingStatus = await this.getOnboardingStatus(vendorId)
    
    // Activate vendor if all onboarding is complete
    if (onboardingStatus.overall_status === "completed") {
      await this.activateVendor(vendorId)
    }
    
    return onboardingStatus
  }
  
  /**
   * Activate a vendor after successful onboarding
   */
  private async activateVendor(vendorId: string): Promise<void> {
    await this.marketplaceService.updateVendor(vendorId, {
      status: VendorStatus.ACTIVE,
      is_active: true
    })
  }
  
  /**
   * Check if basic information is complete
   */
  private isBasicInfoComplete(vendor: any): boolean {
    return !!(
      vendor.name &&
      vendor.email &&
      vendor.description &&
      vendor.contact_email &&
      vendor.contact_phone
    )
  }
  
  /**
   * Check if address is complete
   */
  private isAddressComplete(vendor: any): boolean {
    return !!(
      vendor.address_line_1 &&
      vendor.city &&
      vendor.state &&
      vendor.postal_code &&
      vendor.country_code
    )
  }
}

export default VendorOnboardingService