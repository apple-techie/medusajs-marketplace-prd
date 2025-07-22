# MedusaJS v2 Integrations Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the recommended integrations for your MedusaJS v2 marketplace.

## Implementation Order

Follow this order for optimal setup:

1. **Stripe** - Payment processing (Essential)
2. **S3** - File storage for images
3. **SendGrid** - Transactional emails
4. **MeiliSearch** - Product search

## 1. Stripe Integration

### Installation
```bash
cd /Users/andrewpeltekci/Projects/medusajs-marketplace
npm install @medusajs/payment-stripe
```

### Configuration Steps

1. **Get Stripe API Keys**
   - Sign up at [stripe.com](https://stripe.com)
   - Navigate to Developers → API keys
   - Copy your test keys (sk_test_... and pk_test_...)

2. **Set up Stripe Connect** (for marketplace)
   - Enable Connect in your Stripe Dashboard
   - Configure Connect settings for your marketplace
   - Set up platform fees and payout schedules

3. **Configure Webhooks**
   - In Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.com/stripe/hooks`
   - Select events: payment_intent.succeeded, account.updated, etc.
   - Copy the webhook secret

4. **Update .env**
   ```env
   STRIPE_API_KEY=sk_test_YOUR_KEY
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
   ```

5. **Update medusa-config.ts**
   - Copy the Stripe configuration from `stripe-config.ts`

6. **Implement Marketplace Service**
   - Copy `stripe-marketplace-service.ts` to your project
   - This handles vendor onboarding and payment splitting

## 2. S3 File Storage

### Installation
```bash
npm install @medusajs/file-s3
npm install @aws-sdk/client-s3
```

### Configuration Steps

1. **AWS Setup**
   - Create an AWS account
   - Create an S3 bucket (e.g., marketplace-assets)
   - Create an IAM user with S3 permissions
   - Generate access keys

2. **Configure S3 Bucket**
   - Enable public access for product images
   - Set up CORS configuration (see `s3-config.ts`)
   - Apply bucket policy for public read

3. **Update .env**
   ```env
   S3_ACCESS_KEY_ID=YOUR_KEY
   S3_SECRET_ACCESS_KEY=YOUR_SECRET
   S3_REGION=us-east-1
   S3_BUCKET=marketplace-assets
   ```

4. **Alternative: DigitalOcean Spaces**
   ```env
   S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
   ```

## 3. SendGrid Integration

### Installation
```bash
npm install @medusajs/notification-sendgrid
```

### Configuration Steps

1. **SendGrid Setup**
   - Sign up at [sendgrid.com](https://sendgrid.com)
   - Verify your sender domain
   - Generate an API key

2. **Create Email Templates**
   - In SendGrid → Email API → Dynamic Templates
   - Create templates for each notification type
   - Use the HTML from `sendgrid-templates/order-placed.html` as a starting point
   - Note the template IDs (d-xxxxx)

3. **Update .env**
   ```env
   SENDGRID_API_KEY=SG.YOUR_KEY
   SENDGRID_FROM=noreply@yourdomain.com
   SENDGRID_ORDER_PLACED_ID=d-xxxxx
   # Add other template IDs
   ```

4. **Template Variables**
   - Reference `sendgrid-config.ts` for available variables
   - Customize templates in SendGrid's visual editor

## 4. MeiliSearch Integration

### Installation
```bash
npm install @medusajs/search-meilisearch
npm install meilisearch
```

### Local Setup

1. **Install MeiliSearch**
   ```bash
   # macOS
   brew install meilisearch
   
   # Docker
   docker run -p 7700:7700 getmeili/meilisearch:latest
   ```

2. **Run MeiliSearch**
   ```bash
   meilisearch --master-key your_master_key
   ```

3. **Update .env**
   ```env
   MEILISEARCH_HOST=http://localhost:7700
   MEILISEARCH_API_KEY=your_master_key
   ```

### Production Setup

Consider using:
- [Meilisearch Cloud](https://www.meilisearch.com/cloud)
- Self-hosted on your infrastructure

## Frontend SDK Setup

### For Next.js Storefront

1. **Install SDKs**
   ```bash
   cd ../medusajs-marketplace-storefront
   npm install @medusajs/medusa-js @medusajs/medusa-react @tanstack/react-query
   ```

2. **Configure Provider**
   ```typescript
   // app/providers.tsx
   import { MedusaProvider } from "@medusajs/medusa-react"
   
   export function Providers({ children }) {
     return (
       <MedusaProvider
         baseUrl="http://localhost:9000"
         queryClientProviderProps={{ client: queryClient }}
       >
         {children}
       </MedusaProvider>
     )
   }
   ```

3. **Use Hooks**
   ```typescript
   import { useProducts } from "@medusajs/medusa-react"
   
   const { products, isLoading } = useProducts()
   ```

## Testing Your Integrations

### 1. Test Stripe
- Create a test product
- Complete a test checkout
- Verify payment in Stripe Dashboard

### 2. Test S3
- Upload a product image
- Verify it appears in your S3 bucket
- Check image URL is accessible

### 3. Test SendGrid
- Create a test order
- Check email delivery
- Verify template rendering

### 4. Test MeiliSearch
- Add products to your store
- Search for products
- Test filters and sorting

## Troubleshooting

### Common Issues

1. **Stripe Webhook Failures**
   - Check webhook secret is correct
   - Verify endpoint URL
   - Check Stripe webhook logs

2. **S3 Upload Errors**
   - Verify IAM permissions
   - Check bucket policy
   - Ensure CORS is configured

3. **SendGrid Not Sending**
   - Verify domain authentication
   - Check API key permissions
   - Review SendGrid activity logs

4. **MeiliSearch Connection Failed**
   - Ensure MeiliSearch is running
   - Check API key and host
   - Verify network connectivity

## Next Steps

1. Configure production environment variables
2. Set up monitoring and alerts
3. Implement custom email templates
4. Optimize search rankings
5. Set up Stripe Connect onboarding flow

## Support Resources

- [MedusaJS Documentation](https://docs.medusajs.com)
- [Stripe Connect Guide](https://stripe.com/docs/connect)
- [SendGrid Templates](https://sendgrid.com/docs/ui/sending-email/how-to-send-an-email-with-dynamic-transactional-templates/)
- [MeiliSearch Docs](https://docs.meilisearch.com)