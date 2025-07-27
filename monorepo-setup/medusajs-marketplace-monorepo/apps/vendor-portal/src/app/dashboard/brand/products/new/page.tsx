'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductForm from '@/components/products/product-form'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (data: any) => {
    setSaving(true)
    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/products`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )
      
      if (response.ok) {
        const { product } = await response.json()
        router.push(`/dashboard/brand/products/${product.id}`)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create product')
      }
    } catch (error) {
      console.error('Failed to create product:', error)
      alert('Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Product</h1>
        <p className="mt-2 text-sm text-gray-700">
          Add a new product to your catalog
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/dashboard/brand/products')}
        isLoading={saving}
      />
    </div>
  )
}