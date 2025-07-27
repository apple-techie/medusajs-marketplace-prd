#!/bin/bash

echo "🧪 Testing Vendor APIs..."

# First login as vendor to get token
echo "1. Testing vendor login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:9000/auth/vendor \
  -H "Content-Type: application/json" \
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

# Test vendor me endpoint
echo -e "\n2. Testing /vendor/me endpoint..."
ME_RESPONSE=$(curl -s -X GET http://localhost:9000/vendor/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: http://localhost:3001")

echo $ME_RESPONSE | jq '.' 2>/dev/null || echo $ME_RESPONSE

# Test product collections endpoint
echo -e "\n3. Testing /vendor/collections endpoint..."
COLLECTIONS_RESPONSE=$(curl -s -X GET http://localhost:9000/vendor/collections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: http://localhost:3001")

echo "Collections count: $(echo $COLLECTIONS_RESPONSE | jq '.count' 2>/dev/null || echo 'Failed')"

# Test product types endpoint
echo -e "\n4. Testing /vendor/product-types endpoint..."
TYPES_RESPONSE=$(curl -s -X GET http://localhost:9000/vendor/product-types \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: http://localhost:3001")

echo "Product types count: $(echo $TYPES_RESPONSE | jq '.count' 2>/dev/null || echo 'Failed')"

# Test product categories endpoint
echo -e "\n5. Testing /vendor/product-categories endpoint..."
CATEGORIES_RESPONSE=$(curl -s -X GET http://localhost:9000/vendor/product-categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: http://localhost:3001")

echo "Categories count: $(echo $CATEGORIES_RESPONSE | jq '.count' 2>/dev/null || echo 'Failed')"

# Test vendor products endpoint
echo -e "\n6. Testing /vendor/products endpoint..."
PRODUCTS_RESPONSE=$(curl -s -X GET http://localhost:9000/vendor/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: http://localhost:3001")

echo "Products count: $(echo $PRODUCTS_RESPONSE | jq '.products | length' 2>/dev/null || echo 'Failed')"

echo -e "\n✨ All tests completed!"