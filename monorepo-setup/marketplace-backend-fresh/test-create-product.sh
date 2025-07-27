#!/bin/bash

echo "🧪 Testing Product Creation..."

# First login as vendor to get token
echo "1. Logging in as vendor..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:9000/auth/vendor \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3001" \
  -d '{
    "email": "urbanstyle@example.com",
    "password": "vendor123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  echo $LOGIN_RESPONSE
  exit 1
fi

echo "✅ Login successful"

# Create a test product
echo -e "\n2. Creating test product..."
PRODUCT_RESPONSE=$(curl -s -X POST http://localhost:9000/vendor/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3001" \
  -d '{
    "title": "Test Product from API",
    "handle": "test-product-api",
    "description": "This is a test product created via API",
    "status": "draft",
    "type_id": null,
    "collection_id": null,
    "category_ids": [],
    "variants": [{
      "title": "Default",
      "sku": "TEST-API-001",
      "prices": [{
        "amount": 2999,
        "currency_code": "usd"
      }],
      "inventory_quantity": 100
    }],
    "metadata": {}
  }')

echo $PRODUCT_RESPONSE | jq '.' 2>/dev/null || echo $PRODUCT_RESPONSE

# Get product ID
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$PRODUCT_ID" ]; then
  echo "❌ Product creation failed"
  exit 1
fi

echo -e "\n✅ Product created with ID: $PRODUCT_ID"

# List products to verify
echo -e "\n3. Listing vendor products..."
LIST_RESPONSE=$(curl -s -X GET http://localhost:9000/vendor/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: http://localhost:3001")

PRODUCT_COUNT=$(echo $LIST_RESPONSE | jq '.products | length' 2>/dev/null || echo '0')
echo "Total products: $PRODUCT_COUNT"

echo -e "\n✨ Test completed!"