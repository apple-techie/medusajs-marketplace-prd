#!/bin/bash

# Stripe Payment Provider Setup Script for MedusaJS v2 Marketplace

echo "🚀 Setting up Stripe Payment Provider for MedusaJS Marketplace"

# Navigate to project directory
cd /Users/andrewpeltekci/Projects/medusajs-marketplace

# Install Stripe payment provider
echo "📦 Installing @medusajs/payment-stripe..."
npm install @medusajs/payment-stripe

echo "✅ Stripe payment provider installed successfully"
echo ""
echo "📝 Next steps:"
echo "1. Add these environment variables to your .env file:"
echo "   STRIPE_API_KEY=sk_test_YOUR_SECRET_KEY"
echo "   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET"
echo ""
echo "2. Update your medusa-config.ts with the Stripe configuration"
echo "3. Set up Stripe Connect in your Stripe Dashboard for marketplace functionality"
echo "4. Configure webhook endpoint: https://your-domain.com/stripe/hooks"