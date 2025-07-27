"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { retrieveCustomer } from "@lib/data/customer"

type WishlistItem = {
  id: string
  product_id: string
  created_at: string
  product: any
}

export const useWishlist = () => {
  const queryClient = useQueryClient()
  const [customerId, setCustomerId] = useState<string | null>(null)

  // Get customer ID
  useEffect(() => {
    const getCustomer = async () => {
      try {
        const customer = await retrieveCustomer()
        if (customer) {
          setCustomerId(customer.id)
        }
      } catch (error) {
        console.error("Failed to get customer:", error)
      }
    }
    getCustomer()
  }, [])

  // Fetch wishlist
  const { data: wishlist, isLoading } = useQuery({
    queryKey: ["wishlist", customerId],
    queryFn: async () => {
      if (!customerId) return { wishlist_items: [] }
      
      const response = await fetch(`/api/customers/${customerId}/wishlist`)
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
      }
      return response.json()
    },
    enabled: !!customerId,
  })

  // Add to wishlist mutation
  const addToWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!customerId) throw new Error("Not authenticated")
      
      const response = await fetch(`/api/customers/${customerId}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to add to wishlist")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", customerId] })
    },
  })

  // Remove from wishlist mutation
  const removeFromWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!customerId) throw new Error("Not authenticated")
      
      const response = await fetch(
        `/api/customers/${customerId}/wishlist/${productId}`,
        {
          method: "DELETE",
        }
      )
      
      if (!response.ok) {
        throw new Error("Failed to remove from wishlist")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", customerId] })
    },
  })

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlist?.wishlist_items?.some(
      (item: WishlistItem) => item.product_id === productId
    ) || false
  }

  return {
    wishlist: wishlist?.wishlist_items || [],
    isLoading,
    addToWishlist: addToWishlist.mutate,
    removeFromWishlist: removeFromWishlist.mutate,
    isInWishlist,
    isAuthenticated: !!customerId,
  }
}