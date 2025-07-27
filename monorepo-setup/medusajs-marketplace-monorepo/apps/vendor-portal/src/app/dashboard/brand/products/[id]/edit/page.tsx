'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import ProductForm from '@/components/products/product-form'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [resolvedParams.id])

  const fetchProduct = async () => {
    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/products/${resolvedParams.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      } else {
        router.push('/dashboard/brand/products')
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    setSaving(true)
    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/products/${resolvedParams.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )
      
      if (response.ok) {
        router.push(`/dashboard/brand/products/${resolvedParams.id}`)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update product')
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/dashboard/brand/products/${resolvedParams.id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Product
        </Link>
        
        <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-sm text-gray-700">
          Update product information
        </p>
      </div>

      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/dashboard/brand/products/${resolvedParams.id}`)}
        isLoading={saving}
      />
    </div>
  )
}