'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const vendorId = searchParams.get('vendor_id')
    const provider = searchParams.get('provider')
    const error = searchParams.get('error')

    if (error) {
      // Handle error
      router.push(`/login?error=${error}&provider=${provider}`)
      return
    }

    if (token && vendorId) {
      // Store authentication data
      localStorage.setItem('vendor_token', token)
      localStorage.setItem('vendor_id', vendorId)
      localStorage.setItem('auth_provider', provider || 'emailpass')

      // Get vendor details to determine type
      fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/vendors/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.vendor) {
            const vendorType = data.vendor.type || 'shop'
            router.push(`/dashboard/${vendorType}`)
          } else {
            router.push('/dashboard')
          }
        })
        .catch(() => {
          router.push('/dashboard')
        })
    } else {
      // No token, redirect to login
      router.push('/login')
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}