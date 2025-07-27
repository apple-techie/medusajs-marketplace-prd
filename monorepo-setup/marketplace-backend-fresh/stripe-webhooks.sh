#!/bin/bash

# Script to manage Stripe webhook forwarding for local development

echo "🚀 Starting Stripe webhook forwarding for local development..."

# Kill any existing stripe listen processes
echo "Cleaning up existing Stripe listeners..."
pkill -f "stripe listen" || true

# Start general Stripe webhook forwarding
echo "Starting general Stripe webhook forwarding..."
stripe listen --forward-to localhost:9000/webhooks/stripe &
STRIPE_PID=$!

# Wait a moment for the first listener to start
sleep 2

# Start Stripe Connect webhook forwarding
echo "Starting Stripe Connect webhook forwarding..."
stripe listen --forward-to localhost:9000/webhooks/stripe-connect \
  --events account.updated,account.application.authorized,account.application.deauthorized &
CONNECT_PID=$!

echo "✅ Stripe webhook forwarding is running!"
echo ""
echo "📝 Important: The webhook secrets are already configured in your .env file:"
echo "   STRIPE_WEBHOOK_SECRET=whsec_8822e62b34e389e06215692d5aa8fa0b22a314b9529d9c220d178402fa8181a2"
echo "   STRIPE_CONNECT_WEBHOOK_SECRET=whsec_8822e62b34e389e06215692d5aa8fa0b22a314b9529d9c220d178402fa8181a2"
echo ""
echo "🔗 Webhook endpoints:"
echo "   General: http://localhost:9000/webhooks/stripe"
echo "   Connect: http://localhost:9000/webhooks/stripe-connect"
echo ""
echo "Press Ctrl+C to stop webhook forwarding..."

# Wait for user to press Ctrl+C
trap 'echo "Stopping webhook forwarding..."; kill $STRIPE_PID $CONNECT_PID 2>/dev/null; exit 0' INT
wait