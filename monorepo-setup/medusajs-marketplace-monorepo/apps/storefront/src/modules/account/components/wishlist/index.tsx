"use client"

import { useEffect, useState, useCallback } from "react"
import { Container, Button } from "@medusajs/ui"
import { Trash, ShoppingBag } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@modules/cart/actions"
import { useParams } from "next/navigation"

type WishlistTemplateProps = {
  customerId: string
}

type WishlistItem = {
  id: string
  product_id: string
  created_at: string
  product: HttpTypes.StoreProduct & {
    cheapest_variant_price?: number
  }
}

const WishlistTemplate = ({ customerId }: WishlistTemplateProps) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set())
  const { countryCode } = useParams() as { countryCode: string }

  const fetchWishlist = useCallback(async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}/wishlist`)
      if (response.ok) {
        const data = await response.json()
        setWishlistItems(data.wishlist_items || [])
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error)
    } finally {
      setLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const removeFromWishlist = async (productId: string) => {
    setRemovingItems(prev => new Set(prev).add(productId))
    
    try {
      const response = await fetch(`/api/customers/${customerId}/wishlist/${productId}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setWishlistItems(items => items.filter(item => item.product_id !== productId))
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleAddToCart = async (product: HttpTypes.StoreProduct) => {
    if (!product.variants?.[0]?.id) return
    
    setAddingToCart(prev => new Set(prev).add(product.id))
    
    try {
      await addToCart({
        variantId: product.variants[0].id,
        quantity: 1,
        countryCode,
      })
      
      // Optionally remove from wishlist after adding to cart
      await removeFromWishlist(product.id)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl-semi">Wishlist</h1>
          <p className="text-base-regular text-ui-fg-subtle">
            Loading your saved products...
          </p>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl-semi">Wishlist</h1>
        <p className="text-base-regular text-ui-fg-subtle">
          {wishlistItems.length > 0
            ? `You have ${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} in your wishlist`
            : "Your wishlist is empty"}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <Container className="flex flex-col items-center justify-center p-12">
          <p className="text-large-regular mb-6">No items in your wishlist yet</p>
          <LocalizedClientLink href="/products">
            <Button variant="secondary">Browse Products</Button>
          </LocalizedClientLink>
        </Container>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item) => {
            const product = item.product
            const price = product.cheapest_variant_price || product.variants?.[0]?.calculated_price?.calculated_amount || 0
            const currencyCode = product.variants?.[0]?.calculated_price?.currency_code || "usd"
            
            return (
              <Container key={item.id} className="p-4">
                <div className="flex flex-col h-full">
                  <LocalizedClientLink href={`/products/${product.handle}`}>
                    <div className="mb-4">
                      <Thumbnail
                        thumbnail={product.thumbnail}
                        size="full"
                        className="rounded-lg"
                      />
                    </div>
                  </LocalizedClientLink>
                  
                  <div className="flex-1">
                    <LocalizedClientLink href={`/products/${product.handle}`}>
                      <h3 className="text-base-semi mb-2 hover:text-ui-fg-interactive">
                        {product.title}
                      </h3>
                    </LocalizedClientLink>
                    
                    <p className="text-small-regular text-ui-fg-subtle mb-4">
                      {product.subtitle}
                    </p>
                    
                    <p className="text-base-semi mb-4">
                      {convertToLocale({
                        amount: price,
                        currency_code: currencyCode,
                      })}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart.has(product.id) || !product.variants?.[0]?.id}
                    >
                      <ShoppingBag className="mr-2" />
                      {addingToCart.has(product.id) ? "Adding..." : "Add to Cart"}
                    </Button>
                    
                    <Button
                      variant="secondary"
                      onClick={() => removeFromWishlist(product.id)}
                      disabled={removingItems.has(product.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                  
                  <p className="text-xsmall-regular text-ui-fg-muted mt-2">
                    Added {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Container>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WishlistTemplate