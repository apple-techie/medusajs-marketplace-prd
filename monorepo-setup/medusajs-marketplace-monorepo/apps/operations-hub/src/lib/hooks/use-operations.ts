"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAdmin } from "../medusa-client"

// Dashboard analytics
export function useDashboardAnalytics(period = "7d") {
  return useQuery({
    queryKey: ["operations", "analytics", period],
    queryFn: () => fetchAdmin(`/dashboard?period=${period}`),
  })
}

// All vendors
export function useAllVendors() {
  return useQuery({
    queryKey: ["operations", "vendors"],
    queryFn: () => fetchAdmin("/vendors"),
  })
}

// Vendor management
export function useUpdateVendorStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      fetchAdmin(`/vendors/${id}`, {
        method: "POST",
        body: JSON.stringify({ is_active }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations", "vendors"] })
    },
  })
}

// Order management
export function useOperationsOrders(filters?: any) {
  return useQuery({
    queryKey: ["operations", "orders", filters],
    queryFn: () => fetchAdmin(`/orders?${new URLSearchParams(filters).toString()}`),
  })
}

// Product approvals
export function usePendingProducts() {
  return useQuery({
    queryKey: ["operations", "products", "pending"],
    queryFn: () => fetchAdmin("/products?status=pending"),
  })
}

export function useApproveProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      fetchAdmin(`/products/${id}`, {
        method: "POST",
        body: JSON.stringify({ status: "published" }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations", "products"] })
    },
  })
}