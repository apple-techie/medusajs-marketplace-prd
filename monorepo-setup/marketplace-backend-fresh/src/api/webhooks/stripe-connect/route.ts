import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import Stripe from "stripe"

// POST /webhooks/stripe-connect - Handle Stripe Connect webhooks
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const marketplaceService = req.scope.resolve("marketplace")
  const endpointSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET
  
  if (!endpointSecret) {
    console.error("STRIPE_CONNECT_WEBHOOK_SECRET not configured")
    return res.status(500).json({ 
      message: "Webhook secret not configured" 
    })
  }
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-06-30.basil"
  })
  
  const sig = req.headers["stripe-signature"] as string
  
  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      req.body as string | Buffer,
      sig,
      endpointSecret
    )
    
    // Handle the event
    await marketplaceService.stripeConnectService.handleWebhook(event)
    
    // Handle specific events that need vendor updates
    switch (event.type) {
      case "account.updated":
        const account = event.data.object as Stripe.Account
        
        // Find vendor by Stripe account ID
        const vendors = await marketplaceService.listVendors({
          filters: { stripe_account_id: account.id }
        })
        
        if (vendors.length > 0) {
          const vendor = vendors[0]
          
          // Update vendor with Stripe account status
          await marketplaceService.updateVendor(vendor.id, {
            stripe_charges_enabled: account.charges_enabled,
            stripe_payouts_enabled: account.payouts_enabled,
            stripe_details_submitted: account.details_submitted,
            stripe_onboarding_completed: 
              account.details_submitted && 
              account.charges_enabled && 
              account.payouts_enabled
          })
          
          console.log(`Updated vendor ${vendor.id} with Stripe status`)
        }
        break
        
      case "account.application.deauthorized":
        // Handle vendor disconnecting their Stripe account
        const deauthorizedAccount = event.account as string
        
        const deauthorizedVendors = await marketplaceService.listVendors({
          filters: { stripe_account_id: deauthorizedAccount }
        })
        
        if (deauthorizedVendors.length > 0) {
          const vendor = deauthorizedVendors[0]
          
          // Clear Stripe account information
          await marketplaceService.updateVendor(vendor.id, {
            stripe_account_id: null,
            stripe_onboarding_completed: false,
            stripe_charges_enabled: false,
            stripe_payouts_enabled: false,
            stripe_details_submitted: false,
            status: "pending" // Set vendor back to pending
          })
          
          console.log(`Vendor ${vendor.id} deauthorized their Stripe account`)
        }
        break
        
      case "transfer.created":
      case "transfer.reversed":
        // Handle transfer events for payouts
        await marketplaceService.handleStripeTransferWebhook(event)
        break
    }
    
    res.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error.message)
    res.status(400).json({ 
      message: "Webhook error",
      error: error.message 
    })
  }
}