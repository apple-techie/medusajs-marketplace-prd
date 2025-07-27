'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PencilIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button } from "@marketplace/ui"
import { Badge } from "@medusajs/ui"
import { formatCurrency } from '@/lib/utils'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    setDeleting(true)
    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/products/${resolvedParams.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        router.push('/dashboard/brand/products')
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    } finally {
      setDeleting(false)
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

  const getInventoryCount = () => {
    return product.variants?.reduce((sum: number, variant: any) => {
      return sum + (variant.inventory_quantity || 0)
    }, 0) || 0
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/brand/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{product.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Handle: {product.handle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              color={product.status === 'published' ? 'green' : 'grey'}
            >
              {product.status}
            </Badge>
            <Link href={`/dashboard/brand/products/${resolvedParams.id}/edit`}>
              <Button variant="secondary" size="sm">
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {(product.images?.length > 0 || product.thumbnail) && (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {product.thumbnail && (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      Thumbnail
                    </div>
                  </div>
                )}
                {product.images?.map((image: any, index: number) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {product.description || 'No description provided'}
            </p>
          </div>

          {/* Variants */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Variants</h3>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Variant
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      SKU
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Inventory
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {product.variants?.map((variant: any) => (
                    <tr key={variant.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {variant.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {variant.sku || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {variant.prices?.[0] ? formatCurrency(variant.prices[0].amount, variant.prices[0].currency_code) : '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {variant.inventory_quantity || 0}
                        {variant.allow_backorder && (
                          <span className="ml-2 text-xs text-gray-400">(Backorder allowed)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
            <dl className="space-y-3">
              {product.subtitle && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Subtitle</dt>
                  <dd className="text-sm text-gray-900">{product.subtitle}</dd>
                </>
              )}
              
              {product.collection && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Collection</dt>
                  <dd className="text-sm text-gray-900">{product.collection.title}</dd>
                </>
              )}
              
              {product.type && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900">{product.type.value}</dd>
                </>
              )}
              
              <dt className="text-sm font-medium text-gray-500">Discountable</dt>
              <dd className="text-sm text-gray-900">{product.discountable ? 'Yes' : 'No'}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Total Inventory</dt>
              <dd className="text-sm text-gray-900">{getInventoryCount()} units</dd>
              
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="text-sm text-gray-900">
                {new Date(product.created_at).toLocaleDateString()}
              </dd>
              
              <dt className="text-sm font-medium text-gray-500">Updated</dt>
              <dd className="text-sm text-gray-900">
                {new Date(product.updated_at).toLocaleDateString()}
              </dd>
            </dl>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: any) => (
                  <Badge key={tag.id} color="grey" size="small">
                    {tag.value}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}