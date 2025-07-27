#!/bin/bash

# SendGrid Notifications Setup Script for MedusaJS v2

echo "🚀 Setting up SendGrid Notifications for MedusaJS Marketplace"

# Navigate to project directory
cd /Users/andrewpeltekci/Projects/medusajs-marketplace

# Install SendGrid notification provider
echo "📦 Installing @medusajs/notification-sendgrid..."
npm install @medusajs/notification-sendgrid

echo "✅ SendGrid notification provider installed successfully"
echo ""
echo "📝 Next steps:"
echo "1. Add these environment variables to your .env file:"
echo "   SENDGRID_API_KEY=SG.your_api_key"
echo "   SENDGRID_FROM=noreply@marketplace.com"
echo "   SENDGRID_ORDER_PLACED_ID=d-xxxxx"
echo "   SENDGRID_ORDER_SHIPPED_ID=d-xxxxx"
echo "   SENDGRID_CUSTOMER_CREATED_ID=d-xxxxx"
echo "   SENDGRID_INVITE_CREATED_ID=d-xxxxx"
echo "   SENDGRID_RESET_PASSWORD_ID=d-xxxxx"
echo ""
echo "2. Create dynamic templates in SendGrid Dashboard"
echo "3. Update your medusa-config.ts with the SendGrid configuration"
echo "4. Verify your sender domain in SendGrid"