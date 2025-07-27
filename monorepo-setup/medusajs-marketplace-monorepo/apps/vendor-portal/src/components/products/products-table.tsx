'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@marketplace/ui'
import { Badge, Checkbox } from '@medusajs/ui'

type Product = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  status: string
  collection?: { title: string }
  variants: Array<{
    id: string
    title: string
    inventory_quantity?: number
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
  created_at: string
}

type ProductsTableProps = {
  products: Product[]
  onRefresh: () => void
  selectedProducts?: Set<string>
  onSelectionChange?: (selected: Set<string>) => void
}

export default function ProductsTable({ 
  products, 
  onRefresh,
  selectedProducts,
  onSelectionChange 
}: ProductsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return
    
    if (checked) {
      onSelectionChange(new Set(products.map(p => p.id)))
    } else {
      onSelectionChange(new Set())
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (!onSelectionChange || !selectedProducts) return
    
    const newSelected = new Set(selectedProducts)
    if (checked) {
      newSelected.add(productId)
    } else {
      newSelected.delete(productId)
    }
    onSelectionChange(newSelected)
  }

  const isAllSelected = selectedProducts && products.length > 0 && 
    products.every(p => selectedProducts.has(p.id))

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    setDeletingId(productId)
    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const getProductPrice = (product: Product) => {
    if (!product.variants?.[0]?.prices?.[0]) return 'N/A'
    const price = product.variants[0].prices[0]
    return formatCurrency(price.amount, price.currency_code)
  }

  const getInventoryCount = (product: Product) => {
    return product.variants.reduce((sum, variant) => {
      return sum + (variant.inventory_quantity || 0)
    }, 0)
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {onSelectionChange && (
              <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                <Checkbox
                  checked={isAllSelected || false}
                  onCheckedChange={handleSelectAll}
                  className="absolute left-4 top-1/2 -mt-2 sm:left-6"
                />
              </th>
            )}
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Product
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Inventory
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Price
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Collection
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.map((product) => (
            <tr key={product.id}>
              {onSelectionChange && (
                <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                  <Checkbox
                    checked={selectedProducts?.has(product.id) || false}
                    onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                    className="absolute left-4 top-1/2 -mt-2 sm:left-6"
                  />
                </td>
              )}
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    {product.thumbnail ? (
                      <Image
                        className="h-10 w-10 rounded-md object-cover"
                        src={product.thumbnail}
                        alt={product.title}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-200" />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{product.title}</div>
                    <div className="text-gray-500">{product.handle}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <Badge
                  color={product.status === 'published' ? 'green' : 'grey'}
                  size="small"
                >
                  {product.status}
                </Badge>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {getInventoryCount(product)} in stock
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {getProductPrice(product)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {product.collection?.title || '-'}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/dashboard/brand/products/${product.id}`}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">View</span>
                  </Link>
                  <Link
                    href={`/dashboard/brand/products/${product.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}