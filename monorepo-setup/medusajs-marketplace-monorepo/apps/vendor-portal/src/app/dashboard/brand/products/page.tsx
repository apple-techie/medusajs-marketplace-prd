'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { formatCurrency } from '@/lib/utils'
import ProductsTable from '@/components/products/products-table'
import { Button } from '@marketplace/ui'
import BulkActions from '@/components/products/bulk-actions'
import ImportExportModal from '@/components/products/import-export-modal'

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [showImportExport, setShowImportExport] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product: any) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.handle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.size === 0) return

    const vendorId = localStorage.getItem('vendor_id')
    const token = localStorage.getItem('vendor_token')

    switch (action) {
      case 'delete':
        if (!confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) return
        
        for (const productId of selectedProducts) {
          await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/products/${productId}`,
            {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          )
        }
        break
      
      case 'publish':
      case 'draft':
        for (const productId of selectedProducts) {
          await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/products/${productId}`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: action === 'publish' ? 'published' : 'draft' }),
            }
          )
        }
        break
      
      case 'duplicate':
        for (const productId of selectedProducts) {
          await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/products/${productId}/duplicate`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          )
        }
        break
    }

    setSelectedProducts(new Set())
    fetchProducts()
  }

  const handleImport = async (file: File) => {
    // Parse CSV and create products
    const text = await file.text()
    const lines = text.split('\n')
    if (lines.length === 0 || !lines[0]) return
    const headers = lines[0].split(',').map(h => h.trim())
    
    const vendorId = localStorage.getItem('vendor_id')
    const token = localStorage.getItem('vendor_token')

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line) continue
      const values = line.split(',')
      if (values.length !== headers.length) continue

      const product: any = {}
      headers.forEach((header, index) => {
        product[header] = values[index]?.trim() || ''
      })

      // Create product
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/products`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: product.title,
            handle: product.handle,
            description: product.description,
            status: 'draft',
            variants: [{
              title: product.variant_title || 'Default',
              sku: product.sku,
              inventory_quantity: parseInt(product.inventory_quantity) || 0,
              prices: [{
                amount: Math.round(parseFloat(product.price) * 100),
                currency_code: 'usd'
              }]
            }]
          }),
        }
      )
    }

    fetchProducts()
  }

  const handleExport = () => {
    // Create CSV content
    const headers = ['title', 'handle', 'description', 'status', 'sku', 'price', 'inventory_quantity']
    const rows = products.map((product: any) => {
      const variant = product.variants?.[0] || {}
      const price = variant.prices?.[0]?.amount ? (variant.prices[0].amount / 100).toFixed(2) : '0'
      
      return [
        product.title,
        product.handle,
        product.description || '',
        product.status,
        variant.sku || '',
        price,
        variant.inventory_quantity || '0'
      ].map(v => `"${v}"`).join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')
    
    // Download file
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowImportExport(true)}
            className="inline-flex items-center"
          >
            <ArrowUpTrayIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Import/Export
          </Button>
          <Button
            onClick={() => router.push('/dashboard/brand/products/new')}
            className="inline-flex items-center"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedProducts.size}
        onAction={handleBulkAction}
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No products</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No products found matching your search.' : 'Get started by creating a new product.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button
                onClick={() => router.push('/dashboard/brand/products/new')}
                className="inline-flex items-center"
              >
                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                Add Product
              </Button>
            </div>
          )}
        </div>
      ) : (
        <ProductsTable 
          products={filteredProducts}
          onRefresh={fetchProducts}
          selectedProducts={selectedProducts}
          onSelectionChange={setSelectedProducts}
        />
      )}

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
        onImport={handleImport}
        onExport={handleExport}
      />
    </div>
  )
}