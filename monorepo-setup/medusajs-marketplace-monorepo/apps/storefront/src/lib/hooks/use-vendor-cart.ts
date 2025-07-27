'use client'

import { useQuery } from '@tanstack/react-query'
import { HttpTypes } from '@medusajs/types'

interface VendorCartSummary {
  cart_id: string
  vendor_summary: {
    vendor_count: number
    vendors: Array<{
      vendor_id: string
      vendor_name: string
      vendor_type: string
      item_count: number
      subtotal: number
      commission: number
      vendor_payout: number
    }>
    total_amount: number
    total_commission: number
    total_vendor_payout: number
  }
}

async function fetchVendorCartSummary(cartId: string): Promise<VendorCartSummary> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cartId}/vendor-summary`,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch vendor cart summary')
  }

  return response.json()
}

export function useVendorCart(cart: HttpTypes.StoreCart | null) {
  return useQuery({
    queryKey: ['vendor-cart', cart?.id],
    queryFn: () => fetchVendorCartSummary(cart!.id),
    enabled: !!cart?.id && (cart?.items?.length || 0) > 0,
    staleTime: 5000,
  })
}