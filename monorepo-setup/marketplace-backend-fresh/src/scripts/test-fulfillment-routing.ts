export default async function testFulfillmentRouting({ container }) {
  const marketplaceService = container.resolve("marketplace")
  
  console.log("🧪 Testing fulfillment routing system...")
  
  // Test Case 1: Simple order from New York
  console.log("\n📍 Test Case 1: NYC customer ordering regular items")
  const test1 = await marketplaceService.calculateFulfillmentRouting({
    customer_address: {
      city: "New York",
      state_province: "NY",
      postal_code: "10001",
      country_code: "US",
      latitude: 40.7580,
      longitude: -73.9855
    },
    items: [
      {
        product_id: "prod_test_1",
        variant_id: "var_test_1",
        quantity: 2,
        vendor_id: "vendor_test_1",
        metadata: {}
      }
    ],
    shipping_option: {
      provider_id: "smart-fulfillment",
      service_level: "standard"
    }
  })
  
  console.log("Result:", JSON.stringify(test1, null, 2))
  
  // Test Case 2: California customer with refrigerated items
  console.log("\n📍 Test Case 2: LA customer ordering refrigerated items")
  const test2 = await marketplaceService.calculateFulfillmentRouting({
    customer_address: {
      city: "Los Angeles",
      state_province: "CA",
      postal_code: "90001",
      country_code: "US",
      latitude: 34.0522,
      longitude: -118.2437
    },
    items: [
      {
        product_id: "prod_cold_1",
        variant_id: "var_cold_1",
        quantity: 5,
        vendor_id: "vendor_test_2",
        metadata: {
          requires_refrigeration: true
        }
      }
    ],
    shipping_option: {
      provider_id: "smart-fulfillment",
      service_level: "express"
    }
  })
  
  console.log("Result:", JSON.stringify(test2, null, 2))
  
  // Test Case 3: Multi-vendor order requiring split fulfillment
  console.log("\n📍 Test Case 3: Chicago customer with multi-vendor order")
  const test3 = await marketplaceService.calculateFulfillmentRouting({
    customer_address: {
      city: "Chicago",
      state_province: "IL",
      postal_code: "60601",
      country_code: "US",
      latitude: 41.8781,
      longitude: -87.6298
    },
    items: [
      {
        product_id: "prod_test_1",
        variant_id: "var_test_1",
        quantity: 10,
        vendor_id: "vendor_test_1",
        metadata: {}
      },
      {
        product_id: "prod_hazmat_1",
        variant_id: "var_hazmat_1",
        quantity: 1,
        vendor_id: "vendor_test_3",
        metadata: {
          is_hazmat: true
        }
      },
      {
        product_id: "prod_oversized_1",
        variant_id: "var_oversized_1",
        quantity: 1,
        vendor_id: "vendor_test_4",
        metadata: {
          is_oversized: true
        }
      }
    ],
    shipping_option: {
      provider_id: "smart-fulfillment",
      service_level: "standard"
    }
  })
  
  console.log("Result:", JSON.stringify(test3, null, 2))
  
  // Test Case 4: Hawaii order (should route to LA)
  console.log("\n📍 Test Case 4: Hawaii customer (regional restriction)")
  const test4 = await marketplaceService.calculateFulfillmentRouting({
    customer_address: {
      city: "Honolulu",
      state_province: "HI",
      postal_code: "96801",
      country_code: "US",
      latitude: 21.3099,
      longitude: -157.8581
    },
    items: [
      {
        product_id: "prod_test_1",
        variant_id: "var_test_1",
        quantity: 3,
        vendor_id: "vendor_test_1",
        metadata: {}
      }
    ],
    shipping_option: {
      provider_id: "smart-fulfillment",
      service_level: "standard"
    }
  })
  
  console.log("Result:", JSON.stringify(test4, null, 2))
  
  // Test Case 5: High-value order (should apply surcharge)
  console.log("\n📍 Test Case 5: High-value order from Texas")
  const test5 = await marketplaceService.calculateFulfillmentRouting({
    customer_address: {
      city: "Dallas",
      state_province: "TX",
      postal_code: "75201",
      country_code: "US",
      latitude: 32.7767,
      longitude: -96.7970
    },
    items: [
      {
        product_id: "prod_expensive_1",
        variant_id: "var_expensive_1",
        quantity: 1,
        vendor_id: "vendor_test_5",
        metadata: {
          value_cents: 60000 // $600 item
        }
      }
    ],
    shipping_option: {
      provider_id: "smart-fulfillment",
      service_level: "overnight"
    }
  })
  
  console.log("Result:", JSON.stringify(test5, null, 2))
  
  console.log("\n✅ Fulfillment routing tests completed!")
}