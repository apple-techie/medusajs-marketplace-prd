import { Modules } from "@medusajs/framework/utils"
import { MedusaContainer } from "@medusajs/framework/types"

export default async function seedAgeRestrictedProducts({ container }: { container: MedusaContainer }) {
  const productService = container.resolve(Modules.PRODUCT)
  const ageVerificationService = container.resolve("age_verification")
  const query = container.resolve("query")

  try {
    console.log("🔞 Seeding Age-Restricted Products...\n")

    // Get some existing products to mark as age-restricted
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "metadata.*"],
      filters: {
        title: {
          $in: ["Premium Wine Collection", "Craft Beer Selection", "Limited Edition Whiskey"]
        }
      }
    })

    console.log(`Found ${products.length} products to mark as age-restricted`)

    // If no products found, get some random products
    if (products.length === 0) {
      const { data: allProducts } = await query.graph({
        entity: "product",
        fields: ["id", "title", "metadata.*"],
        pagination: {
          take: 5
        }
      })
      
      for (const product of allProducts.slice(0, 3)) {
        const ageRestriction = await ageVerificationService.createAgeRestrictedProduct({
          product_id: product.id,
          minimum_age: 21,
          restriction_reason: "Alcohol product - legal age required",
          requires_id_check: true,
          restricted_states: ["UT", "PA"], // Example restricted states
          compliance_category: "alcohol"
        })
        
        console.log(`✅ Marked ${product.title} as age-restricted (21+)`)
      }
    } else {
      // Mark the found products as age-restricted
      for (const product of products) {
        const ageRestriction = await ageVerificationService.createAgeRestrictedProduct({
          product_id: product.id,
          minimum_age: 21,
          restriction_reason: "Alcohol product - legal age required",
          requires_id_check: true,
          restricted_states: ["UT", "PA"],
          compliance_category: "alcohol"
        })
        
        console.log(`✅ Marked ${product.title} as age-restricted (21+)`)
      }
    }

    // Create some tobacco products (18+)
    const tobaccoProducts = [
      {
        handle: "premium-cigars",
        title: "Premium Cigars Collection",
        description: "Hand-rolled premium cigars",
        metadata: {
          vendor_id: "vendor_urban_style",
          vendor_name: "Urban Style Shop"
        }
      },
      {
        handle: "vape-starter-kit",
        title: "Vape Starter Kit",
        description: "Complete vaping starter kit",
        metadata: {
          vendor_id: "vendor_tech_haven",
          vendor_name: "Tech Haven"
        }
      }
    ]

    for (const productData of tobaccoProducts) {
      try {
        // Create the product first
        const [product] = await productService.createProducts([{
          ...productData,
          status: "published" as any,
          category_ids: [],
          is_giftcard: false,
          discountable: true,
          variants: [
            {
              title: "Default Variant",
              sku: `${productData.handle}-default`,
              barcode: `${productData.handle}-barcode`,
              manage_inventory: false,
              // prices are set separately, not on variant creation
            }
          ]
        }])

        // Mark as age-restricted (18+)
        await ageVerificationService.createAgeRestrictedProduct({
          product_id: product.id,
          minimum_age: 18,
          restriction_reason: "Tobacco/Nicotine product - age verification required",
          requires_id_check: false,
          compliance_category: "tobacco"
        })

        console.log(`✅ Created and marked ${product.title} as age-restricted (18+)`)
      } catch (error) {
        console.log(`Product ${productData.handle} might already exist, skipping...`)
      }
    }

    // Get age restriction stats
    const stats = await ageVerificationService.getVerificationStats()
    console.log("\n📊 Age Verification Stats:")
    console.log(`Total sessions: ${stats.total}`)
    console.log(`Verified: ${stats.verified}`)
    console.log(`Failed: ${stats.failed}`)
    console.log(`Pending: ${stats.pending}`)

    console.log("\n✨ Age-restricted products seeding completed!")

  } catch (error) {
    console.error("❌ Seeding failed:", error)
  }
}