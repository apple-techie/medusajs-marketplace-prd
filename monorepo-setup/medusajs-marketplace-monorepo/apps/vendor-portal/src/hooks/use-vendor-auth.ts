"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface VendorInfo {
  id: string
  name: string
  email: string
  type: "shop" | "brand" | "distributor"
  status: string
  stripe_onboarding_completed: boolean
}

export function useVendorAuth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [vendor, setVendor] = useState<VendorInfo | null>(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("vendor_token")
    
    if (!token) {
      setIsAuthenticated(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/vendors/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })

      if (response.ok) {
        const data = await response.json()
        setVendor(data.vendor)
        setIsAuthenticated(true)
      } else {
        // Token is invalid
        localStorage.removeItem("vendor_token")
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error("Auth check failed:", err)
      setIsAuthenticated(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/auth/vendor/emailpass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Invalid email or password")
      }

      const data = await response.json()
      
      // Store the auth token
      localStorage.setItem("vendor_token", data.token)
      
      // Get vendor info
      await checkAuth()
      
      return data
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [checkAuth])

  const logout = useCallback(() => {
    localStorage.removeItem("vendor_token")
    localStorage.removeItem("vendor_id")
    setIsAuthenticated(false)
    setVendor(null)
    router.push("/login")
  }, [router])

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return false
    }
    return true
  }, [isAuthenticated, router])

  return {
    isLoading,
    error,
    isAuthenticated,
    vendor,
    login,
    logout,
    checkAuth,
    requireAuth,
  }
}