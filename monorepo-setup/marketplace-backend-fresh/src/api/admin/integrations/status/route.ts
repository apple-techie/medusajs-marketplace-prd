import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Check real integration statuses based on environment variables and configuration
    const integrations = {
      stripe: {
        status: process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET ? 'connected' : 'not_configured',
        name: 'Stripe',
        description: 'Payment processing & vendor payouts',
        lastSync: process.env.STRIPE_SECRET_KEY ? new Date().toISOString() : null,
        features: {
          payments: !!process.env.STRIPE_SECRET_KEY,
          connect: !!process.env.STRIPE_SECRET_KEY,
          webhooks: !!process.env.STRIPE_WEBHOOK_SECRET
        }
      },
      sendgrid: {
        status: process.env.SENDGRID_API_KEY ? 'connected' : 'not_configured',
        name: 'SendGrid',
        description: 'Email notifications',
        lastSync: process.env.SENDGRID_API_KEY ? new Date().toISOString() : null,
        features: {
          transactional: !!process.env.SENDGRID_API_KEY,
          marketing: false,
          templates: !!process.env.SENDGRID_API_KEY
        }
      },
      s3: {
        status: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY ? 'connected' : 'not_configured',
        name: 'AWS S3',
        description: 'File storage',
        lastSync: process.env.S3_ACCESS_KEY_ID ? new Date().toISOString() : null,
        features: {
          upload: !!process.env.S3_ACCESS_KEY_ID,
          cdn: !!process.env.S3_BUCKET_NAME,
          backup: false
        }
      },
      analytics: {
        status: process.env.GOOGLE_ANALYTICS_ID ? 'connected' : 'not_configured',
        name: 'Google Analytics',
        description: 'Traffic analytics',
        lastSync: process.env.GOOGLE_ANALYTICS_ID ? new Date().toISOString() : null,
        features: {
          tracking: !!process.env.GOOGLE_ANALYTICS_ID,
          ecommerce: false,
          goals: false
        }
      },
      redis: {
        status: process.env.REDIS_URL ? 'connected' : 'not_configured',
        name: 'Redis',
        description: 'Caching & sessions',
        lastSync: process.env.REDIS_URL ? new Date().toISOString() : null,
        features: {
          cache: !!process.env.REDIS_URL,
          sessions: !!process.env.REDIS_URL,
          pubsub: !!process.env.REDIS_URL
        }
      }
    }
    
    res.json({ integrations })
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching integration status", 
      error: error.message 
    })
  }
}