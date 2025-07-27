#!/bin/bash

echo "Starting MedusaJS Marketplace Backend..."
echo "======================================="

# Use Node 20
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo ""

# Start the backend
npm run dev