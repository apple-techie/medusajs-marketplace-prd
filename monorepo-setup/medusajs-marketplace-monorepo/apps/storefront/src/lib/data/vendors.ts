"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { sortProducts } from "@lib/util/sort-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export async function getVendorProducts({
  vendorId,
  page = 1,
  limit = 12,
  sortBy = "created_at",
  category,
  regionId,
}: {
  vendorId: string
  page?: number
  limit?: number
  sortBy?: SortOptions
  category?: string
  regionId: string
}): Promise<{
  products: HttpTypes.StoreProduct[]
  count: number
}> {
  const offset = (page - 1) * limit
  
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }
  
  const query: any = {
    limit,
    offset,
    region_id: regionId,
  }
  
  if (category) {
    query.category_id = category
  }

  try {
    const response = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
      count: number
    }>(`/store/vendors/${vendorId}/products`, {
      method: "GET",
      query,
      headers,
      next,
      cache: "force-cache",
    })
    
    // Sort products client-side
    const sortedProducts = sortProducts(response.products, sortBy)
    
    return {
      products: sortedProducts,
      count: response.count,
    }
  } catch (error) {
    console.error("Failed to fetch vendor products:", error)
    return {
      products: [],
      count: 0,
    }
  }
}