// MeiliSearch Configuration for medusa-config.ts

const meilisearchConfig = {
  resolve: "@medusajs/search-meilisearch",
  options: {
    host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
    api_key: process.env.MEILISEARCH_API_KEY,
    
    settings: {
      // Product search configuration
      products: {
        indexSettings: {
          // Fields that can be searched
          searchableAttributes: [
            "title",
            "description",
            "variant_sku",
            "collection.title",
            "tags.value",
            "type.value",
            "vendor.name", // For marketplace vendor search
          ],
          
          // Fields returned in search results
          displayedAttributes: [
            "id",
            "title",
            "description",
            "handle",
            "thumbnail",
            "variants",
            "collection",
            "type",
            "tags",
            "vendor", // Include vendor info in results
          ],
          
          // Fields that can be used for filtering
          filterableAttributes: [
            "type.value",
            "collection.id",
            "collection.handle",
            "variants.prices.currency_code",
            "variants.prices.amount",
            "tags.value",
            "status",
            "vendor.id", // Filter by vendor
            "vendor.name",
            "vendor.type", // shop, brand, distributor
          ],
          
          // Fields that can be used for sorting
          sortableAttributes: [
            "created_at",
            "updated_at",
            "title",
            "variants.prices.amount",
          ],
          
          // Ranking rules for relevance
          rankingRules: [
            "words",
            "typo",
            "proximity",
            "attribute",
            "sort",
            "exactness",
            "variants.prices.amount:asc", // Prioritize cheaper products
          ],
          
          // Synonyms for better search
          synonyms: {
            "tshirt": ["t-shirt", "tee"],
            "hoodie": ["hoody", "sweatshirt"],
            "sneakers": ["trainers", "tennis shoes"],
            "phone": ["smartphone", "mobile"],
          },
          
          // Typo tolerance
          typoTolerance: {
            enabled: true,
            minWordSizeForTypos: {
              oneTypo: 4,
              twoTypos: 8,
            },
          },
        },
        
        // Transform function to add custom fields
        transformer: (product: any) => ({
          ...product,
          // Add vendor name for easier searching
          vendor_name: product.vendor?.name,
          // Add price range for filtering
          min_price: Math.min(...product.variants.map((v: any) => 
            v.prices?.[0]?.amount || Infinity
          )),
          max_price: Math.max(...product.variants.map((v: any) => 
            v.prices?.[0]?.amount || 0
          )),
        }),
      },
      
      // Vendor search configuration
      vendors: {
        indexSettings: {
          searchableAttributes: [
            "name",
            "description",
            "handle",
            "type", // shop, brand, distributor
          ],
          displayedAttributes: [
            "id",
            "name",
            "handle",
            "logo",
            "description",
            "type",
            "rating",
            "product_count",
          ],
          filterableAttributes: [
            "type",
            "status",
            "rating",
          ],
          sortableAttributes: [
            "name",
            "rating",
            "product_count",
            "created_at",
          ],
        },
      },
      
      // Order search configuration (admin)
      orders: {
        indexSettings: {
          searchableAttributes: [
            "display_id",
            "email",
            "customer.first_name",
            "customer.last_name",
            "shipping_address.city",
            "items.title",
          ],
          displayedAttributes: [
            "id",
            "display_id",
            "email",
            "customer",
            "total",
            "status",
            "created_at",
          ],
          filterableAttributes: [
            "status",
            "payment_status",
            "fulfillment_status",
            "vendor.id",
            "created_at",
          ],
        },
      },
    },
    
    // Additional MeiliSearch options
    client_options: {
      timeout: 5000, // 5 seconds timeout
      headers: {
        "X-Meili-Source": "medusajs-marketplace",
      },
    },
  },
}

// Add to medusa-config.ts modules array
export default meilisearchConfig