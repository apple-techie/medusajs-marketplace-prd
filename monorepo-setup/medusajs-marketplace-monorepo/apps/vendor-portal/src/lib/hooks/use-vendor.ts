"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAdmin } from "../medusa-client"

interface Vendor {
  id: string
  name: string
  type: "shop" | "brand" | "distributor"
  email: string
  description?: string
  logo?: string
  website?: string
  commission_rate: number
  is_active: boolean
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

// Fetch current vendor
export function useVendor() {
  return useQuery<{ vendor: Vendor }>({
    queryKey: ["vendor", "current"],
    queryFn: () => fetchAdmin("/vendors/me"),
    retry: false,
  })
}

// Fetch vendor by ID
export function useVendorById(id: string) {
  return useQuery<{ vendor: Vendor }>({
    queryKey: ["vendor", id],
    queryFn: () => fetchAdmin(`/vendors/${id}`),
    enabled: !!id,
  })
}

// Update vendor
export function useUpdateVendor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vendor> }) =>
      fetchAdmin(`/vendors/${id}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor"] })
    },
  })
}

// Vendor products
export function useVendorProducts(vendorId?: string) {
  return useQuery({
    queryKey: ["vendor", "products", vendorId],
    queryFn: () => fetchAdmin(`/vendors/${vendorId}/products`),
    enabled: !!vendorId,
  })
}

// Vendor orders
export function useVendorOrders(vendorId?: string) {
  return useQuery({
    queryKey: ["vendor", "orders", vendorId],
    queryFn: () => fetchAdmin(`/vendors/${vendorId}/orders`),
    enabled: !!vendorId,
  })
}

// Vendor analytics
export function useVendorAnalytics(vendorId?: string, period = "30d") {
  return useQuery({
    queryKey: ["vendor", "analytics", vendorId, period],
    queryFn: () => fetchAdmin(`/vendors/${vendorId}/analytics?period=${period}`),
    enabled: !!vendorId,
  })
}