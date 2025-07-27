import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../../../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../../../modules/marketplace"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorId = req.params.id
  const { 
    limit = 12, 
    offset = 0, 
    category_id,
    q,
    order,
    region_id,
  } = req.query

  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  const productService = req.scope.resolve(Modules.PRODUCT)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Get vendor to ensure it exists and is active
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    if (!vendor || vendor.status !== "active") {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Vendor not found"
      )
    }
    
    // Get vendor products using query with links
    const { data: vendorWithProducts } = await query.graph({
      entity: "vendor",
      fields: ["id", "product.*"],
      filters: {
        id: vendorId,
      },
    })
    
    if (!vendorWithProducts || vendorWithProducts.length === 0) {
      return res.json({
        products: [],
        count: 0,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      })
    }
    
    const vendorProducts = vendorWithProducts[0].product || []
    const productIds = Array.isArray(vendorProducts) ? vendorProducts.map((p: any) => p.id) : []
    
    if (productIds.length === 0) {
      return res.json({
        products: [],
        count: 0,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      })
    }
    
    // Build filters for products
    const filters: any = {
      id: productIds,
      status: "published",
    }
    
    if (category_id) {
      filters.category_id = Array.isArray(category_id) ? category_id : [category_id]
    }
    
    if (q) {
      filters.q = q
    }
    
    // Get products with details
    const { data: productDetails } = await query.graph({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "variants.calculated_price",
        "variants.inventory_items.inventory_levels.*",
        "images.*",
        "options.*",
        "options.values.*",
        "tags.*",
        "type.*",
        "collection.*",
        "categories.*",
      ],
      filters,
      pagination: {
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      },
      context: {
        region_id,
      }
    })
    
    // Get total count
    const { data: allProducts } = await query.graph({
      entity: "product",
      fields: ["id"],
      filters,
    })
    
    // Add vendor metadata to products
    const productsWithVendor = productDetails.map((product: any) => ({
      ...product,
      metadata: {
        ...product.metadata,
        vendor_id: vendorId,
        vendor_name: vendor.name,
      },
    }))
    
    res.json({
      products: productsWithVendor,
      count: allProducts.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to fetch vendor products",
      details: error.message,
    })
  }
}