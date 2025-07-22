// Complete medusa-config.ts with all integrations

import { defineConfig } from "@medusajs/framework/utils"

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
    // Marketplace module
    {
      resolve: "./modules/marketplace"
    },
    
    // Segment analytics
    {
      resolve: "./modules/segment",
      options: {
        writeKey: process.env.SEGMENT_WRITE_KEY,
        flushAt: 20,
        flushInterval: 10000,
      }
    },
    
    // Stripe payment provider
    {
      resolve: "@medusajs/payment-stripe",
      options: {
        api_key: process.env.STRIPE_API_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
        capture: true,
        automatic_payment_methods: true,
        payment_method_types: ["card"],
      }
    },
    
    // S3 file storage
    {
      resolve: "@medusajs/file-s3",
      options: {
        access_key_id: process.env.S3_ACCESS_KEY_ID,
        secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION,
        bucket: process.env.S3_BUCKET,
        endpoint: process.env.S3_ENDPOINT,
        prefix: "medusa",
        acl: "public-read",
      }
    },
    
    // SendGrid notifications
    {
      resolve: "@medusajs/notification-sendgrid",
      options: {
        api_key: process.env.SENDGRID_API_KEY,
        from: process.env.SENDGRID_FROM,
        order_placed_template: process.env.SENDGRID_ORDER_PLACED_ID,
        order_shipped_template: process.env.SENDGRID_ORDER_SHIPPED_ID,
        customer_password_reset_template: process.env.SENDGRID_RESET_PASSWORD_ID,
        user_password_reset_template: process.env.SENDGRID_RESET_PASSWORD_ID,
      }
    },
    
    // MeiliSearch
    {
      resolve: "@medusajs/search-meilisearch",
      options: {
        host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
        api_key: process.env.MEILISEARCH_API_KEY,
        settings: {
          products: {
            indexSettings: {
              searchableAttributes: ["title", "description", "variant_sku"],
              displayedAttributes: ["id", "title", "description", "thumbnail", "handle"],
              filterableAttributes: ["type", "collection_id", "vendor_id"],
            },
          },
        },
      }
    },
  ]
})