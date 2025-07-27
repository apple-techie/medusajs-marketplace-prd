'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
  allowedTypes?: string[]
}

export function AuthGuard({ children, allowedTypes }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('vendor_token')
      
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error('Unauthorized')
        }

        const data = await response.json()
        const vendor = data.vendor

        // Check if vendor is active
        if (!vendor.is_active && !pathname.includes('pending-approval')) {
          router.push('/dashboard/pending-approval')
          return
        }

        // Check if vendor type is allowed
        if (allowedTypes && !allowedTypes.includes(vendor.type)) {
          router.push(`/dashboard/${vendor.type}`)
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('vendor_token')
        localStorage.removeItem('vendor_id')
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname, allowedTypes])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}