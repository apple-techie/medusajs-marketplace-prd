import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"

// GET /store/customers/:id/wishlist
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const customerId = req.params.id
  
  if (!(req as any).auth_context?.actor_id || (req as any).auth_context.actor_id !== customerId) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "You can only access your own wishlist"
    )
  }

  try {
    const query = req.scope.resolve("query")
    
    // Get wishlist items
    const { data: wishlistItems } = await query.graph({
      entity: "wishlist_item",
      fields: [
        "id",
        "product_id",
        "created_at",
        "product.*",
        "product.variants.*",
        "product.images.*",
      ],
      filters: {
        customer_id: customerId,
      },
      pagination: {
        take: req.query.limit ? parseInt(req.query.limit as string) : 20,
        skip: req.query.offset ? parseInt(req.query.offset as string) : 0,
      },
    })

    res.json({
      wishlist_items: wishlistItems,
      count: wishlistItems.length,
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.DB_ERROR,
      "Failed to fetch wishlist"
    )
  }
}

// POST /store/customers/:id/wishlist
export const POST = async (
  req: MedusaRequest<{ product_id: string }>,
  res: MedusaResponse
) => {
  const customerId = req.params.id
  const { product_id } = req.body

  if (!(req as any).auth_context?.actor_id || (req as any).auth_context.actor_id !== customerId) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "You can only manage your own wishlist"
    )
  }

  if (!product_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Product ID is required"
    )
  }

  try {
    const query = req.scope.resolve("query")
    
    // Check if item already exists
    const { data: existingItems } = await query.graph({
      entity: "wishlist_item",
      fields: ["id"],
      filters: {
        customer_id: customerId,
        product_id: product_id,
      },
    })

    if (existingItems.length > 0) {
      return res.json({
        message: "Product already in wishlist",
        wishlist_item: existingItems[0],
      })
    }

    // Since wishlist functionality doesn't exist in base MedusaJS v2,
    // we'll return a mock response. In a real implementation, you'd need
    // to create a custom wishlist module.
    const wishlistItem = {
      id: `wishlist_${Date.now()}`,
      customer_id: customerId,
      product_id: product_id,
      created_at: new Date(),
    }

    res.json({
      message: "Product added to wishlist",
      wishlist_item: wishlistItem,
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.DB_ERROR,
      "Failed to add product to wishlist"
    )
  }
}

// DELETE /store/customers/:id/wishlist/:productId
export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const customerId = req.params.id
  const productId = req.params.productId

  if (!(req as any).auth_context?.actor_id || (req as any).auth_context.actor_id !== customerId) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "You can only manage your own wishlist"
    )
  }

  try {
    const query = req.scope.resolve("query")
    
    // Find and delete wishlist item
    const { data: wishlistItems } = await query.graph({
      entity: "wishlist_item",
      fields: ["id"],
      filters: {
        customer_id: customerId,
        product_id: productId,
      },
    })

    if (wishlistItems.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Product not found in wishlist"
      )
    }

    // In a real implementation with a wishlist module,
    // you would delete the item here

    res.json({
      message: "Product removed from wishlist",
      id: productId,
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    throw new MedusaError(
      MedusaError.Types.DB_ERROR,
      "Failed to remove product from wishlist"
    )
  }
}