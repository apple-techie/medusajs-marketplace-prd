'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { VendorType } from '@marketplace/types'

export default function VendorPortalHome() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<VendorType | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('vendor_token')
    if (token) {
      // Try to get vendor info and redirect to their dashboard
      fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/vendors/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.vendor) {
            router.push(`/dashboard/${data.vendor.type}`)
          }
        })
        .catch(() => {
          // If error, show vendor type selection
        })
    } else {
      // Not authenticated, redirect to login
      router.push('/login')
    }
  }, [router])

  const vendorTypes = [
    {
      type: 'shop' as VendorType,
      title: 'Shop Partner',
      description: 'Earn commissions by promoting products without holding inventory',
      benefits: [
        '15-25% commission on sales',
        'No inventory management',
        'Marketing support',
        'Real-time analytics'
      ],
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      type: 'brand' as VendorType,
      title: 'Brand Partner',
      description: 'Sell your products directly and manage your own inventory',
      benefits: [
        'Full control over products',
        'Set your own prices',
        'Brand presence',
        'Direct customer relationships'
      ],
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      type: 'distributor' as VendorType,
      title: 'Distributor Partner',
      description: 'Fulfill orders for multiple brands from your warehouse',
      benefits: [
        'Volume-based discounts',
        'Multi-brand inventory',
        'Fulfillment hub status',
        'Regional exclusivity'
      ],
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    }
  ]

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/dashboard/${selectedType}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the Vendor Portal
          </h1>
          <p className="text-xl text-gray-600">
            Choose your vendor type to access your personalized dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {vendorTypes.map((vendor) => (
            <div
              key={vendor.type}
              onClick={() => setSelectedType(vendor.type)}
              className={`
                cursor-pointer rounded-lg border-2 p-6 transition-all
                ${selectedType === vendor.type ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                ${vendor.color}
              `}
            >
              <h3 className="text-xl font-semibold mb-3">{vendor.title}</h3>
              <p className="text-gray-600 mb-4">{vendor.description}</p>
              <ul className="space-y-2">
                {vendor.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className={`
              px-8 py-3 rounded-lg font-semibold transition-all
              ${selectedType 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}