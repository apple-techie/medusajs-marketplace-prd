'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { formatCurrency } from '@marketplace/ui/utils'
import { 
  CubeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  TagIcon,
  PhotoIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

interface ProductVariant {
  id: string
  title: string
  sku: string
  price: number
  inventory_quantity: number
  options: { [key: string]: string }
}

interface Product {
  id: string
  title: string
  handle: string
  description: string
  status: 'published' | 'draft' | 'archived'
  thumbnail: string
  images: string[]
  vendor: {
    id: string
    name: string
    type: 'shop_partner' | 'brand_partner' | 'distributor_partner'
  }
  categories: {
    id: string
    name: string
  }[]
  collection: {
    id: string
    name: string
  }
  type: {
    id: string
    value: string
  }
  variants: ProductVariant[]
  created_at: string
  updated_at: string
  published_at: string | null
  total_inventory: number
  available_inventory: number
  sales_count: number
  revenue: number
  rating: number
  review_count: number
  compliance: {
    age_restricted: boolean
    age_limit: 18 | 21 | null
    license_required: boolean
    lab_tested: boolean
    warnings: string[]
  }
  performance: {
    conversion_rate: number
    return_rate: number
    avg_order_value: number
    stock_turnover: number
  }
}

interface ProductStats {
  total_products: number
  published_products: number
  draft_products: number
  out_of_stock: number
  low_stock: number
  total_sales: number
  total_revenue: number
  inventory_value: number
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<ProductStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterStock, setFilterStock] = useState<string>('all')
  const [filterVendorType, setFilterVendorType] = useState<string>('all')
  const [filterCompliance, setFilterCompliance] = useState<string>('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'title' | 'sales' | 'revenue' | 'created' | 'updated'>('updated')
  const [expandedProducts, setExpandedProducts] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockProducts: Product[] = [
        {
          id: 'prod_1',
          title: 'Premium OG Kush',
          handle: 'premium-og-kush',
          description: 'Classic strain with earthy pine aroma and potent effects',
          status: 'published',
          thumbnail: 'https://via.placeholder.com/150',
          images: ['https://via.placeholder.com/150'],
          vendor: {
            id: 'v1',
            name: 'Green Valley Dispensary',
            type: 'shop_partner'
          },
          categories: [{ id: 'cat_1', name: 'Flower' }],
          collection: { id: 'col_1', name: 'Premium Strains' },
          type: { id: 'type_1', value: 'cannabis_flower' },
          variants: [
            {
              id: 'var_1',
              title: '3.5g',
              sku: 'OGK-3.5',
              price: 4500,
              inventory_quantity: 85,
              options: { size: '3.5g' }
            },
            {
              id: 'var_2',
              title: '7g',
              sku: 'OGK-7',
              price: 8500,
              inventory_quantity: 45,
              options: { size: '7g' }
            },
            {
              id: 'var_3',
              title: '14g',
              sku: 'OGK-14',
              price: 16000,
              inventory_quantity: 20,
              options: { size: '14g' }
            }
          ],
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          published_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          total_inventory: 150,
          available_inventory: 150,
          sales_count: 342,
          revenue: 2450000,
          rating: 4.8,
          review_count: 156,
          compliance: {
            age_restricted: true,
            age_limit: 21,
            license_required: true,
            lab_tested: true,
            warnings: ['Keep out of reach of children', 'Do not drive or operate machinery']
          },
          performance: {
            conversion_rate: 12.5,
            return_rate: 0.8,
            avg_order_value: 7163,
            stock_turnover: 4.2
          }
        },
        {
          id: 'prod_2',
          title: 'Relaxing Lavender Bath Bomb',
          handle: 'relaxing-lavender-bath-bomb',
          description: 'CBD-infused bath bomb with natural lavender essential oils',
          status: 'published',
          thumbnail: 'https://via.placeholder.com/150',
          images: ['https://via.placeholder.com/150'],
          vendor: {
            id: 'v2',
            name: 'Premium Brands Co',
            type: 'brand_partner'
          },
          categories: [{ id: 'cat_2', name: 'Topicals' }],
          collection: { id: 'col_2', name: 'Wellness Products' },
          type: { id: 'type_2', value: 'topical' },
          variants: [
            {
              id: 'var_4',
              title: 'Single',
              sku: 'BATH-LAV-1',
              price: 1200,
              inventory_quantity: 200,
              options: { quantity: '1 pack' }
            },
            {
              id: 'var_5',
              title: '3-Pack',
              sku: 'BATH-LAV-3',
              price: 3000,
              inventory_quantity: 85,
              options: { quantity: '3 pack' }
            }
          ],
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          total_inventory: 285,
          available_inventory: 285,
          sales_count: 156,
          revenue: 356000,
          rating: 4.9,
          review_count: 89,
          compliance: {
            age_restricted: true,
            age_limit: 18,
            license_required: false,
            lab_tested: true,
            warnings: ['For external use only']
          },
          performance: {
            conversion_rate: 8.2,
            return_rate: 1.2,
            avg_order_value: 2282,
            stock_turnover: 2.8
          }
        },
        {
          id: 'prod_3',
          title: 'Mango Haze Vape Cartridge',
          handle: 'mango-haze-vape',
          description: 'Tropical flavored vape cartridge with balanced effects',
          status: 'published',
          thumbnail: 'https://via.placeholder.com/150',
          images: ['https://via.placeholder.com/150'],
          vendor: {
            id: 'v2',
            name: 'Premium Brands Co',
            type: 'brand_partner'
          },
          categories: [{ id: 'cat_3', name: 'Vapes' }],
          collection: { id: 'col_3', name: 'Vape Collection' },
          type: { id: 'type_3', value: 'vape_cartridge' },
          variants: [
            {
              id: 'var_6',
              title: '0.5g',
              sku: 'VAPE-MH-05',
              price: 3500,
              inventory_quantity: 5,
              options: { size: '0.5g' }
            },
            {
              id: 'var_7',
              title: '1g',
              sku: 'VAPE-MH-1',
              price: 6000,
              inventory_quantity: 0,
              options: { size: '1g' }
            }
          ],
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          published_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          total_inventory: 5,
          available_inventory: 5,
          sales_count: 523,
          revenue: 2615000,
          rating: 4.7,
          review_count: 234,
          compliance: {
            age_restricted: true,
            age_limit: 21,
            license_required: true,
            lab_tested: true,
            warnings: ['Contains cannabis', 'Keep away from heat']
          },
          performance: {
            conversion_rate: 15.3,
            return_rate: 2.1,
            avg_order_value: 5000,
            stock_turnover: 8.5
          }
        },
        {
          id: 'prod_4',
          title: 'Chocolate Chip Cookies 10-Pack',
          handle: 'chocolate-chip-cookies',
          description: 'Delicious cannabis-infused chocolate chip cookies',
          status: 'draft',
          thumbnail: 'https://via.placeholder.com/150',
          images: ['https://via.placeholder.com/150'],
          vendor: {
            id: 'v4',
            name: 'Herbal Wellness Shop',
            type: 'shop_partner'
          },
          categories: [{ id: 'cat_4', name: 'Edibles' }],
          collection: { id: 'col_4', name: 'Baked Goods' },
          type: { id: 'type_4', value: 'edible' },
          variants: [
            {
              id: 'var_8',
              title: '100mg THC',
              sku: 'COOK-CC-100',
              price: 2500,
              inventory_quantity: 50,
              options: { potency: '100mg' }
            }
          ],
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          published_at: null,
          total_inventory: 50,
          available_inventory: 50,
          sales_count: 0,
          revenue: 0,
          rating: 0,
          review_count: 0,
          compliance: {
            age_restricted: true,
            age_limit: 21,
            license_required: true,
            lab_tested: true,
            warnings: ['Contains THC', 'Start with small dose', 'May contain allergens']
          },
          performance: {
            conversion_rate: 0,
            return_rate: 0,
            avg_order_value: 0,
            stock_turnover: 0
          }
        },
        {
          id: 'prod_5',
          title: 'Bulk Sativa Mix - 1 Pound',
          handle: 'bulk-sativa-mix',
          description: 'Premium sativa strain mix for bulk orders',
          status: 'published',
          thumbnail: 'https://via.placeholder.com/150',
          images: ['https://via.placeholder.com/150'],
          vendor: {
            id: 'v3',
            name: 'West Coast Distribution',
            type: 'distributor_partner'
          },
          categories: [{ id: 'cat_5', name: 'Bulk' }],
          collection: { id: 'col_5', name: 'Wholesale' },
          type: { id: 'type_5', value: 'bulk_flower' },
          variants: [
            {
              id: 'var_9',
              title: '1 Pound',
              sku: 'BULK-SAT-1LB',
              price: 150000,
              inventory_quantity: 25,
              options: { weight: '1lb' }
            }
          ],
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          published_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          total_inventory: 25,
          available_inventory: 25,
          sales_count: 45,
          revenue: 6750000,
          rating: 4.6,
          review_count: 12,
          compliance: {
            age_restricted: true,
            age_limit: 21,
            license_required: true,
            lab_tested: true,
            warnings: ['Wholesale only', 'B2B license required']
          },
          performance: {
            conversion_rate: 3.2,
            return_rate: 0,
            avg_order_value: 150000,
            stock_turnover: 1.8
          }
        }
      ]

      setProducts(mockProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Mock stats for demonstration
      const mockStats: ProductStats = {
        total_products: 3250,
        published_products: 2845,
        draft_products: 305,
        out_of_stock: 145,
        low_stock: 287,
        total_sales: 45230,
        total_revenue: 125000000,
        inventory_value: 18500000
      }

      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load product data</p>
        </div>
      </DashboardLayout>
    )
  }

  // Helper functions
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockStatus = (product: Product) => {
    const totalInventory = product.total_inventory
    if (totalInventory === 0) return { label: 'Out of Stock', style: 'text-red-600 bg-red-100' }
    if (totalInventory < 20) return { label: 'Low Stock', style: 'text-yellow-600 bg-yellow-100' }
    return { label: 'In Stock', style: 'text-green-600 bg-green-100' }
  }

  const getVendorTypeIcon = (type: string) => {
    switch (type) {
      case 'shop_partner':
        return <BuildingStorefrontIcon className="h-4 w-4 text-blue-600" />
      case 'brand_partner':
        return <CubeIcon className="h-4 w-4 text-purple-600" />
      case 'distributor_partner':
        return <TruckIcon className="h-4 w-4 text-green-600" />
      default:
        return null
    }
  }

  const getComplianceIcon = (compliance: Product['compliance']) => {
    if (!compliance.lab_tested) return <XMarkIcon className="h-4 w-4 text-red-600" />
    if (compliance.warnings.length > 2) return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
    return <ShieldCheckIcon className="h-4 w-4 text-green-600" />
  }

  const formatDateAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return `${diffMinutes}m ago`
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.handle.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.vendor.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterStatus !== 'all' && product.status !== filterStatus) {
        return false
      }
      if (filterStock !== 'all') {
        const stockStatus = getStockStatus(product)
        if (filterStock === 'out_of_stock' && stockStatus.label !== 'Out of Stock') return false
        if (filterStock === 'low_stock' && stockStatus.label !== 'Low Stock') return false
        if (filterStock === 'in_stock' && stockStatus.label !== 'In Stock') return false
      }
      if (filterVendorType !== 'all' && product.vendor.type !== filterVendorType) {
        return false
      }
      if (filterCompliance !== 'all') {
        if (filterCompliance === 'verified' && !product.compliance.lab_tested) return false
        if (filterCompliance === 'restricted' && !product.compliance.age_restricted) return false
        if (filterCompliance === 'warnings' && product.compliance.warnings.length === 0) return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'sales':
          return b.sales_count - a.sales_count
        case 'revenue':
          return b.revenue - a.revenue
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) return
    
    // In a real app, these would be API calls
    switch (action) {
      case 'publish':
        alert(`Publishing ${selectedProducts.length} products`)
        break
      case 'archive':
        alert(`Archiving ${selectedProducts.length} products`)
        break
      case 'export':
        handleExport(selectedProducts)
        break
    }
    setSelectedProducts([])
  }

  const handleExport = (productIds?: string[]) => {
    const productsToExport = productIds 
      ? products.filter(p => productIds.includes(p.id))
      : filteredProducts
    
    const headers = ['Title', 'SKU', 'Vendor', 'Status', 'Price', 'Inventory', 'Sales', 'Revenue', 'Rating', 'Created', 'Updated']
    const rows = productsToExport.map(product => [
      product.title,
      product.variants[0]?.sku || 'N/A',
      product.vendor.name,
      product.status,
      formatCurrency(product.variants[0]?.price || 0),
      product.total_inventory,
      product.sales_count,
      formatCurrency(product.revenue),
      product.rating || 'N/A',
      new Date(product.created_at).toLocaleDateString(),
      new Date(product.updated_at).toLocaleDateString()
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `products-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleProductExpansion = (productId: string) => {
    if (expandedProducts.includes(productId)) {
      setExpandedProducts(expandedProducts.filter(id => id !== productId))
    } else {
      setExpandedProducts([...expandedProducts, productId])
    }
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Product Catalog</h2>
            <p className="text-gray-600 mt-1">
              Manage all marketplace products across vendors
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => handleExport()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
            <button 
              onClick={() => router.push('/products/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Product Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <CubeIcon className="h-10 w-10 text-blue-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{stats.total_products.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <CheckIcon className="h-10 w-10 text-green-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{stats.published_products.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Out of Stock</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{stats.out_of_stock}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ChartBarIcon className="h-10 w-10 text-purple-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <TagIcon className="h-10 w-10 text-indigo-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Inventory Value</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(stats.inventory_value)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <select
              value={filterVendorType}
              onChange={(e) => setFilterVendorType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Vendors</option>
              <option value="shop_partner">Shop Partners</option>
              <option value="brand_partner">Brand Partners</option>
              <option value="distributor_partner">Distributors</option>
            </select>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                More
              </button>

              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filterCompliance}
                onChange={(e) => setFilterCompliance(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Compliance</option>
                <option value="verified">Lab Tested</option>
                <option value="restricted">Age Restricted</option>
                <option value="warnings">Has Warnings</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="updated">Sort by Updated</option>
                <option value="created">Sort by Created</option>
                <option value="title">Sort by Name</option>
                <option value="sales">Sort by Sales</option>
                <option value="revenue">Sort by Revenue</option>
              </select>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedProducts.length} product(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('archive')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Archive
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Export Selected
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Products View */}
        {viewMode === 'list' ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inventory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product)
                  const isExpanded = expandedProducts.includes(product.id)
                  
                  return (
                    <React.Fragment key={product.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.title}</div>
                              <div className="text-sm text-gray-500">{product.categories[0]?.name} • {product.type.value}</div>
                              {product.rating > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  ⭐ {product.rating} ({product.review_count} reviews)
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => toggleProductExpansion(product.id)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? (
                                <ChevronDownIcon className="h-5 w-5" />
                              ) : (
                                <ChevronRightIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getVendorTypeIcon(product.vendor.type)}
                            <span className="ml-2 text-sm text-gray-900">{product.vendor.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.style}`}>
                              {stockStatus.label}
                            </span>
                            <div className="text-sm text-gray-500 mt-1">
                              {product.total_inventory} units
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="flex items-center">
                              <ChartBarIcon className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-gray-900">{product.sales_count} sales</span>
                            </div>
                            <div className="text-gray-500">{formatCurrency(product.revenue)}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {product.performance.conversion_rate}% conversion
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(product.status)}`}>
                              {product.status}
                            </span>
                            <div className="flex items-center">
                              {getComplianceIcon(product.compliance)}
                              <span className="ml-1 text-xs text-gray-500">
                                {product.compliance.age_limit ? `${product.compliance.age_limit}+` : 'All ages'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => router.push(`/products/${product.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => router.push(`/products/${product.id}/edit`)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Variants */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Variants</h4>
                                <div className="space-y-1">
                                  {product.variants.map((variant) => (
                                    <div key={variant.id} className="text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">{variant.title}</span>
                                        <span className="text-gray-900">{formatCurrency(variant.price)}</span>
                                      </div>
                                      <div className="flex justify-between text-xs text-gray-500">
                                        <span>SKU: {variant.sku}</span>
                                        <span>{variant.inventory_quantity} units</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Performance Metrics */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Performance</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Conversion Rate</span>
                                    <span className="text-gray-900">{product.performance.conversion_rate}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Return Rate</span>
                                    <span className="text-gray-900">{product.performance.return_rate}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Avg Order Value</span>
                                    <span className="text-gray-900">{formatCurrency(product.performance.avg_order_value)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Stock Turnover</span>
                                    <span className="text-gray-900">{product.performance.stock_turnover}x</span>
                                  </div>
                                </div>
                              </div>

                              {/* Compliance Info */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Compliance</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center">
                                    {product.compliance.lab_tested ? (
                                      <CheckIcon className="h-4 w-4 text-green-600 mr-1" />
                                    ) : (
                                      <XMarkIcon className="h-4 w-4 text-red-600 mr-1" />
                                    )}
                                    <span className="text-gray-600">Lab Tested</span>
                                  </div>
                                  <div className="flex items-center">
                                    {product.compliance.license_required ? (
                                      <CheckIcon className="h-4 w-4 text-yellow-600 mr-1" />
                                    ) : (
                                      <XMarkIcon className="h-4 w-4 text-gray-400 mr-1" />
                                    )}
                                    <span className="text-gray-600">License Required</span>
                                  </div>
                                  {product.compliance.warnings.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs font-medium text-gray-700">Warnings:</p>
                                      <ul className="text-xs text-gray-600 list-disc list-inside">
                                        {product.compliance.warnings.map((warning, idx) => (
                                          <li key={idx}>{warning}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                              Created {formatDateAgo(product.created_at)} • Updated {formatDateAgo(product.updated_at)}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product)
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="absolute top-2 left-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded z-10"
                    />
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <span className={`absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{product.categories[0]?.name}</p>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(product.variants[0]?.price || 0)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${stockStatus.style}`}>
                        {stockStatus.label}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      {getVendorTypeIcon(product.vendor.type)}
                      <span className="ml-1 truncate">{product.vendor.name}</span>
                    </div>

                    {product.rating > 0 && (
                      <div className="mt-2 flex items-center text-sm">
                        <span className="text-yellow-400">⭐</span>
                        <span className="ml-1 text-gray-600">{product.rating}</span>
                        <span className="text-gray-400 ml-1">({product.review_count})</span>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-500">{product.sales_count} sales</span>
                      <div className="flex items-center">
                        {getComplianceIcon(product.compliance)}
                        <span className="ml-1 text-gray-500">
                          {product.compliance.age_limit ? `${product.compliance.age_limit}+` : 'All'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <button 
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => router.push(`/products/${product.id}/edit`)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              No products found matching your criteria
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}