import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/vendors/:id/products - Get vendor's products
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorId = req.params.id
  const { limit = 50, offset = 0 } = req.query
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Get products with vendor metadata
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "variants.prices.*",
        "variants.inventory_quantity",
        "images.*",
        "collection.*",
        "type.*",
        "tags.*",
      ],
      filters: {
        // Filter by vendor_id in metadata - this requires a custom filter
        // For now, we'll fetch all and filter in memory
      },
      pagination: {
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      },
    })

    // Filter products by vendor_id in metadata
    const vendorProducts = products.filter((product: any) => 
      product.metadata?.vendor_id === vendorId
    )

    res.json({
      products: vendorProducts,
      count: vendorProducts.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching vendor products", 
      error: error.message 
    })
  }
}

// POST /admin/vendors/:id/products - Create a new product
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorId = req.params.id
  const productService = req.scope.resolve(Modules.PRODUCT)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Get vendor details to add to metadata
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: ["id", "name", "commission_rate"],
      filters: { id: vendorId },
    })
    
    if (!vendors.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Vendor not found"
      )
    }
    
    const vendor = vendors[0]
    
    // Add vendor metadata to product
    const productData = {
      ...(req.body as any),
      metadata: {
        ...(req.body as any)?.metadata,
        vendor_id: vendorId,
        vendor_name: vendor.name,
      },
    }
    
    // Create product - MedusaJS v2 uses createProducts method
    const [product] = await productService.createProducts([productData])
    
    // Create vendor_product relation in marketplace module
    const marketplaceModule = req.scope.resolve("marketplace")
    if (marketplaceModule?.createVendorProducts) {
      await marketplaceModule.createVendorProducts({
        vendor_id: vendorId,
        product_id: product.id,
        commission_rate: (vendor as any).commission_rate || 0.20, // Default 20% commission
      })
    }
    
    // Fetch complete product data
    const { data: [completeProduct] } = await query.graph({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "variants.prices.*",
        "images.*",
        "collection.*",
        "type.*",
        "tags.*",
      ],
      filters: { id: product.id },
    })
    
    res.json({
      product: completeProduct,
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to create product",
      error: error.message 
    })
  }
}