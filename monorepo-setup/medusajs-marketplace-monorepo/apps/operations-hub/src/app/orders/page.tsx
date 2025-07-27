'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { formatCurrency } from '@marketplace/ui/utils'
import { 
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  DocumentTextIcon,
  PrinterIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TagIcon,
  CubeIcon
} from '@heroicons/react/24/outline'

interface Order {
  id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  created_at: string
  updated_at: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
    verified_age: boolean
  }
  vendor: {
    id: string
    name: string
    type: 'shop_partner' | 'brand_partner' | 'distributor_partner'
  }
  shipping_address: {
    street: string
    city: string
    state: string
    zip: string
  }
  billing_address: {
    street: string
    city: string
    state: string
    zip: string
  }
  items: {
    id: string
    product_name: string
    variant_name?: string
    quantity: number
    unit_price: number
    total_price: number
    vendor_id: string
    vendor_name: string
    fulfillment_status: 'pending' | 'processing' | 'fulfilled' | 'shipped' | 'delivered'
  }[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  payment_status: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded'
  payment_method: string
  fulfillment_method: 'delivery' | 'pickup' | 'shipping'
  delivery_window?: string
  tracking_number?: string
  notes?: string
  commission_amount: number
  commission_status: 'pending' | 'calculated' | 'paid'
  priority: 'normal' | 'high' | 'urgent'
  flags: string[]
}

interface OrderStats {
  total_orders: number
  pending_orders: number
  processing_orders: number
  delivered_orders: number
  cancelled_orders: number
  total_revenue: number
  average_order_value: number
  orders_today: number
  revenue_today: number
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterVendor, setFilterVendor] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterDateRange, setFilterDateRange] = useState<string>('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'total' | 'status'>('created')
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockOrders: Order[] = [
        {
          id: 'ord_1',
          order_number: 'ORD-2024-0342',
          status: 'processing',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          customer: {
            id: 'cust_1',
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '(555) 123-4567',
            verified_age: true
          },
          vendor: {
            id: 'v1',
            name: 'Green Valley Dispensary',
            type: 'shop_partner'
          },
          shipping_address: {
            street: '123 Main St',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90001'
          },
          billing_address: {
            street: '123 Main St',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90001'
          },
          items: [
            {
              id: 'item_1',
              product_name: 'Premium Flower - OG Kush',
              variant_name: '3.5g',
              quantity: 2,
              unit_price: 3500,
              total_price: 7000,
              vendor_id: 'v1',
              vendor_name: 'Green Valley Dispensary',
              fulfillment_status: 'processing'
            },
            {
              id: 'item_2',
              product_name: 'CBD Tincture',
              variant_name: '30ml',
              quantity: 1,
              unit_price: 4500,
              total_price: 4500,
              vendor_id: 'v1',
              vendor_name: 'Green Valley Dispensary',
              fulfillment_status: 'processing'
            }
          ],
          subtotal: 11500,
          tax: 1035,
          shipping: 500,
          discount: 0,
          total: 13035,
          payment_status: 'captured',
          payment_method: 'card_visa',
          fulfillment_method: 'delivery',
          delivery_window: '2:00 PM - 4:00 PM',
          commission_amount: 2607,
          commission_status: 'calculated',
          priority: 'normal',
          flags: []
        },
        {
          id: 'ord_2',
          order_number: 'ORD-2024-0341',
          status: 'pending',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          customer: {
            id: 'cust_2',
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            phone: '(555) 234-5678',
            verified_age: true
          },
          vendor: {
            id: 'v2',
            name: 'Premium Brands Co',
            type: 'brand_partner'
          },
          shipping_address: {
            street: '456 Oak Ave',
            city: 'Oakland',
            state: 'CA',
            zip: '94601'
          },
          billing_address: {
            street: '456 Oak Ave',
            city: 'Oakland',
            state: 'CA',
            zip: '94601'
          },
          items: [
            {
              id: 'item_3',
              product_name: 'Premium Vape Cartridge',
              variant_name: '1g - Hybrid',
              quantity: 3,
              unit_price: 4000,
              total_price: 12000,
              vendor_id: 'v2',
              vendor_name: 'Premium Brands Co',
              fulfillment_status: 'pending'
            }
          ],
          subtotal: 12000,
          tax: 1080,
          shipping: 0,
          discount: 600,
          total: 12480,
          payment_status: 'authorized',
          payment_method: 'card_mastercard',
          fulfillment_method: 'pickup',
          commission_amount: 1800,
          commission_status: 'pending',
          priority: 'high',
          flags: ['first_time_customer']
        },
        {
          id: 'ord_3',
          order_number: 'ORD-2024-0340',
          status: 'delivered',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          customer: {
            id: 'cust_3',
            name: 'Mike Chen',
            email: 'mike.chen@email.com',
            phone: '(555) 345-6789',
            verified_age: true
          },
          vendor: {
            id: 'v3',
            name: 'West Coast Distribution',
            type: 'distributor_partner'
          },
          shipping_address: {
            street: '789 Pine St',
            city: 'Sacramento',
            state: 'CA',
            zip: '95814'
          },
          billing_address: {
            street: '789 Pine St',
            city: 'Sacramento',
            state: 'CA',
            zip: '95814'
          },
          items: [
            {
              id: 'item_4',
              product_name: 'Bulk Flower Pack',
              variant_name: '1oz - Mixed',
              quantity: 5,
              unit_price: 20000,
              total_price: 100000,
              vendor_id: 'v3',
              vendor_name: 'West Coast Distribution',
              fulfillment_status: 'delivered'
            },
            {
              id: 'item_5',
              product_name: 'Pre-Roll Pack',
              variant_name: '20-pack',
              quantity: 10,
              unit_price: 8000,
              total_price: 80000,
              vendor_id: 'v3',
              vendor_name: 'West Coast Distribution',
              fulfillment_status: 'delivered'
            }
          ],
          subtotal: 180000,
          tax: 16200,
          shipping: 0,
          discount: 9000,
          total: 187200,
          payment_status: 'captured',
          payment_method: 'ach_transfer',
          fulfillment_method: 'shipping',
          tracking_number: 'WCD123456789',
          commission_amount: 9000,
          commission_status: 'paid',
          priority: 'normal',
          flags: ['bulk_order', 'vip_customer']
        },
        {
          id: 'ord_4',
          order_number: 'ORD-2024-0339',
          status: 'cancelled',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          customer: {
            id: 'cust_4',
            name: 'Lisa Wong',
            email: 'lisa.w@email.com',
            phone: '(555) 456-7890',
            verified_age: false
          },
          vendor: {
            id: 'v1',
            name: 'Green Valley Dispensary',
            type: 'shop_partner'
          },
          shipping_address: {
            street: '321 Elm St',
            city: 'Pasadena',
            state: 'CA',
            zip: '91101'
          },
          billing_address: {
            street: '321 Elm St',
            city: 'Pasadena',
            state: 'CA',
            zip: '91101'
          },
          items: [
            {
              id: 'item_6',
              product_name: 'Edibles Variety Pack',
              quantity: 2,
              unit_price: 2500,
              total_price: 5000,
              vendor_id: 'v1',
              vendor_name: 'Green Valley Dispensary',
              fulfillment_status: 'pending'
            }
          ],
          subtotal: 5000,
          tax: 450,
          shipping: 500,
          discount: 0,
          total: 5950,
          payment_status: 'refunded',
          payment_method: 'card_visa',
          fulfillment_method: 'delivery',
          notes: 'Cancelled: Age verification failed',
          commission_amount: 0,
          commission_status: 'pending',
          priority: 'normal',
          flags: ['age_verification_failed']
        },
        {
          id: 'ord_5',
          order_number: 'ORD-2024-0338',
          status: 'shipped',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          customer: {
            id: 'cust_5',
            name: 'David Park',
            email: 'david.p@email.com',
            phone: '(555) 567-8901',
            verified_age: true
          },
          vendor: {
            id: 'v4',
            name: 'Herbal Wellness Shop',
            type: 'shop_partner'
          },
          shipping_address: {
            street: '654 Beach Blvd',
            city: 'Santa Monica',
            state: 'CA',
            zip: '90401'
          },
          billing_address: {
            street: '654 Beach Blvd',
            city: 'Santa Monica',
            state: 'CA',
            zip: '90401'
          },
          items: [
            {
              id: 'item_7',
              product_name: 'CBD Pain Relief Cream',
              variant_name: '4oz',
              quantity: 1,
              unit_price: 5500,
              total_price: 5500,
              vendor_id: 'v4',
              vendor_name: 'Herbal Wellness Shop',
              fulfillment_status: 'shipped'
            },
            {
              id: 'item_8',
              product_name: 'Hemp Tea Blend',
              variant_name: '20 bags',
              quantity: 2,
              unit_price: 1500,
              total_price: 3000,
              vendor_id: 'v4',
              vendor_name: 'Herbal Wellness Shop',
              fulfillment_status: 'shipped'
            }
          ],
          subtotal: 8500,
          tax: 765,
          shipping: 500,
          discount: 425,
          total: 9340,
          payment_status: 'captured',
          payment_method: 'card_amex',
          fulfillment_method: 'delivery',
          delivery_window: '10:00 AM - 12:00 PM',
          tracking_number: 'HWS987654321',
          commission_amount: 1275,
          commission_status: 'calculated',
          priority: 'urgent',
          flags: ['expedited_shipping']
        }
      ]
      setOrders(mockOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Mock stats for demonstration
      const mockStats: OrderStats = {
        total_orders: 1567,
        pending_orders: 45,
        processing_orders: 89,
        delivered_orders: 1234,
        cancelled_orders: 78,
        total_revenue: 458750000, // $4.58M
        average_order_value: 29267, // $292.67
        orders_today: 87,
        revenue_today: 2585000 // $25.8K
      }
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load order data</p>
        </div>
      </DashboardLayout>
    )
  }

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />
      case 'confirmed':
      case 'processing':
        return <CheckIcon className="h-5 w-5 text-blue-600" />
      case 'fulfilled':
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-purple-600" />
      case 'delivered':
        return <CheckIcon className="h-5 w-5 text-green-600" />
      case 'cancelled':
      case 'refunded':
        return <XMarkIcon className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-indigo-100 text-indigo-800'
      case 'fulfilled': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case 'captured': return 'bg-green-100 text-green-800'
      case 'authorized': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

  const formatOrderDate = (date: string) => {
    const orderDate = new Date(date)
    const now = new Date()
    const diff = now.getTime() - orderDate.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (hours < 24) {
      return `${hours}h ago`
    } else if (days < 7) {
      return `${days}d ago`
    } else {
      return orderDate.toLocaleDateString()
    }
  }

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      if (searchTerm && !order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterStatus !== 'all' && order.status !== filterStatus) {
        return false
      }
      if (filterVendor !== 'all' && order.vendor.type !== filterVendor) {
        return false
      }
      if (filterPriority !== 'all' && order.priority !== filterPriority) {
        return false
      }
      if (filterDateRange !== 'all') {
        const orderDate = new Date(order.created_at)
        const now = new Date()
        switch (filterDateRange) {
          case 'today':
            return orderDate.toDateString() === now.toDateString()
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return orderDate >= weekAgo
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return orderDate >= monthAgo
          default:
            return true
        }
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'total':
          return b.total - a.total
        case 'status':
          return a.status.localeCompare(b.status)
        case 'created':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id))
    }
  }

  const handleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  const toggleOrderExpanded = (orderId: string) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter(id => id !== orderId))
    } else {
      setExpandedOrders([...expandedOrders, orderId])
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) return
    
    // In a real app, these would be API calls
    switch (action) {
      case 'export':
        handleExport(selectedOrders)
        break
      case 'update_status':
        alert(`Update status for ${selectedOrders.length} orders`)
        break
      case 'print':
        alert(`Print ${selectedOrders.length} orders`)
        break
    }
    setSelectedOrders([])
  }

  const handleExport = (orderIds?: string[]) => {
    const ordersToExport = orderIds 
      ? orders.filter(o => orderIds.includes(o.id))
      : filteredOrders
    
    const headers = ['Order #', 'Date', 'Customer', 'Vendor', 'Status', 'Payment', 'Total', 'Commission', 'Items']
    const rows = ordersToExport.map(order => [
      order.order_number,
      new Date(order.created_at).toLocaleDateString(),
      order.customer.name,
      order.vendor.name,
      order.status,
      order.payment_status,
      formatCurrency(order.total),
      formatCurrency(order.commission_amount),
      order.items.length
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
            <p className="text-gray-600 mt-1">
              Manage and track all marketplace orders
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
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ShoppingCartIcon className="h-10 w-10 text-blue-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.total_orders.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ClockIcon className="h-10 w-10 text-yellow-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.pending_orders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <TruckIcon className="h-10 w-10 text-purple-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Processing</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.processing_orders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <BanknotesIcon className="h-10 w-10 text-green-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Today's Revenue</dt>
                    <dd className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue_today)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <CubeIcon className="h-10 w-10 text-indigo-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                    <dd className="text-2xl font-bold text-gray-900">{formatCurrency(stats.average_order_value)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders..."
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filterVendor}
                onChange={(e) => setFilterVendor(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Vendor Types</option>
                <option value="shop_partner">Shop Partners</option>
                <option value="brand_partner">Brand Partners</option>
                <option value="distributor_partner">Distributors</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created">Sort by Created Date</option>
                <option value="updated">Sort by Updated Date</option>
                <option value="total">Sort by Total</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedOrders.length} order(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('update_status')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Status
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Export Selected
              </button>
              <button
                onClick={() => handleBulkAction('print')}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Print
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
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
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleOrderExpanded(order.id)}
                            className="mr-2 text-gray-400 hover:text-gray-600"
                          >
                            {expandedOrders.includes(order.id) ? (
                              <ChevronDownIcon className="h-4 w-4" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4" />
                            )}
                          </button>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                            <div className="text-sm text-gray-500">{formatOrderDate(order.created_at)}</div>
                          </div>
                        </div>
                        {order.priority !== 'normal' && (
                          <span className={`mt-1 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityStyle(order.priority)}`}>
                            {order.priority}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                        {!order.customer.verified_age && (
                          <span className="inline-flex items-center text-xs text-red-600">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            Age not verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getVendorTypeIcon(order.vendor.type)}
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{order.vendor.name}</div>
                          <div className="text-sm text-gray-500">{order.items.length} items</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</div>
                        <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-0.5 ${getPaymentStatusStyle(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className={`ml-2 inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-0.5 ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      {order.tracking_number && (
                        <div className="text-xs text-gray-500 mt-1">
                          Track: {order.tracking_number}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <DocumentTextIcon className="h-5 w-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <PrinterIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedOrders.includes(order.id) && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          {/* Order Items */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                                  <div className="flex items-center">
                                    <TagIcon className="h-4 w-4 text-gray-400 mr-2" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {item.product_name} {item.variant_name && `- ${item.variant_name}`}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {item.vendor_name} • Qty: {item.quantity}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                      {formatCurrency(item.total_price)}
                                    </div>
                                    <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-0.5 ${getStatusStyle(item.fulfillment_status)}`}>
                                      {item.fulfillment_status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                              <div className="text-sm text-gray-600">
                                <p>{order.shipping_address.street}</p>
                                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                              </div>
                              {order.fulfillment_method === 'delivery' && order.delivery_window && (
                                <p className="text-sm text-blue-600 mt-2">
                                  <ClockIcon className="h-4 w-4 inline mr-1" />
                                  {order.delivery_window}
                                </p>
                              )}
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Summary</h4>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Subtotal:</span>
                                  <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tax:</span>
                                  <span className="text-gray-900">{formatCurrency(order.tax)}</span>
                                </div>
                                {order.shipping > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="text-gray-900">{formatCurrency(order.shipping)}</span>
                                  </div>
                                )}
                                {order.discount > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="text-red-600">-{formatCurrency(order.discount)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-medium pt-1 border-t">
                                  <span className="text-gray-900">Total:</span>
                                  <span className="text-gray-900">{formatCurrency(order.total)}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Commission</h4>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Amount:</span>
                                  <span className="text-gray-900">{formatCurrency(order.commission_amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-0.5 ${
                                    order.commission_status === 'paid' ? 'bg-green-100 text-green-800' :
                                    order.commission_status === 'calculated' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {order.commission_status}
                                  </span>
                                </div>
                              </div>
                              {order.flags.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500">Flags:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {order.flags.map((flag, index) => (
                                      <span key={index} className="inline-flex text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                        {flag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {order.notes && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                              <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                                {order.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                No orders found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}