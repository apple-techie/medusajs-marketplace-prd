"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAdmin } from "../medusa-client"

// Get all vendors
export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => fetchAdmin("/vendors"),
  })
}

// Get vendor by ID
export function useVendor(id: string) {
  return useQuery({
    queryKey: ["vendors", id],
    queryFn: () => fetchAdmin(`/vendors/${id}`),
    enabled: !!id,
  })
}

// Update vendor status
export function useUpdateVendor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      fetchAdmin(`/vendors/${id}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })
}

// Create new vendor
export function useCreateVendor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) =>
      fetchAdmin("/vendors", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })
}