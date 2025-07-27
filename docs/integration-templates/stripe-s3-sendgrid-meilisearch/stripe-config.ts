// Add this to your medusa-config.ts modules array

import { defineConfig } from "@medusajs/framework/utils"

// Stripe Configuration for Marketplace
const stripeConfig = {
  resolve: "@medusajs/payment-stripe",
  options: {
    api_key: process.env.STRIPE_API_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    capture: true, // Automatically capture payments
    automatic_payment_methods: true,
    // Stripe Connect settings for marketplace
    stripe_account: {
      business_type: "company",
      type: "standard", // Use "express" for simpler onboarding
    },
    // Payment method configuration
    payment_method_types: [
      "card",
      "ideal", // European payment method
      "sepa_debit", // European bank transfers
      "bancontact", // Belgian payment method
    ],
    // Webhook configuration
    webhook_config: {
      tolerance: 300, // 5 minutes tolerance for webhook timestamps
      network_retry_delay: 300,
    },
  }
}

// Full medusa-config.ts example
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    databaseDriverOptions: {
      connection: {
        ssl: false
      }
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  },
  modules: [
    {
      resolve: "./modules/marketplace"
    },
    {
      resolve: "./modules/segment",
      options: {
        writeKey: process.env.SEGMENT_WRITE_KEY,
        flushAt: 20,
        flushInterval: 10000,
      }
    },
    stripeConfig, // Add Stripe configuration here
  ]
})