#!/bin/bash

# MeiliSearch Setup Script for MedusaJS v2

echo "🚀 Setting up MeiliSearch for MedusaJS Marketplace"

# Navigate to project directory
cd /Users/andrewpeltekci/Projects/medusajs-marketplace

# Install MeiliSearch provider
echo "📦 Installing @medusajs/search-meilisearch..."
npm install @medusajs/search-meilisearch

echo "📦 Installing MeiliSearch client..."
npm install meilisearch

echo "✅ MeiliSearch provider installed successfully"
echo ""
echo "📝 Next steps:"
echo "1. Install and run MeiliSearch locally:"
echo "   brew install meilisearch (macOS)"
echo "   docker run -p 7700:7700 getmeili/meilisearch:latest (Docker)"
echo ""
echo "2. Add these environment variables to your .env file:"
echo "   MEILISEARCH_HOST=http://localhost:7700"
echo "   MEILISEARCH_API_KEY=your_master_key"
echo ""
echo "3. Update your medusa-config.ts with the MeiliSearch configuration"
echo "4. Run MeiliSearch with: meilisearch --master-key your_master_key"