#!/bin/bash

# S3 File Storage Setup Script for MedusaJS v2

echo "🚀 Setting up S3 File Storage for MedusaJS Marketplace"

# Navigate to project directory
cd /Users/andrewpeltekci/Projects/medusajs-marketplace

# Install S3 file provider
echo "📦 Installing @medusajs/file-s3..."
npm install @medusajs/file-s3

# Install AWS SDK if needed
echo "📦 Installing AWS SDK..."
npm install @aws-sdk/client-s3

echo "✅ S3 file storage provider installed successfully"
echo ""
echo "📝 Next steps:"
echo "1. Add these environment variables to your .env file:"
echo "   S3_ACCESS_KEY_ID=your_access_key"
echo "   S3_SECRET_ACCESS_KEY=your_secret_key"
echo "   S3_REGION=us-east-1"
echo "   S3_BUCKET=marketplace-assets"
echo "   S3_ENDPOINT=https://s3.amazonaws.com (optional for S3-compatible services)"
echo ""
echo "2. Create an S3 bucket with proper CORS configuration"
echo "3. Update your medusa-config.ts with the S3 configuration"