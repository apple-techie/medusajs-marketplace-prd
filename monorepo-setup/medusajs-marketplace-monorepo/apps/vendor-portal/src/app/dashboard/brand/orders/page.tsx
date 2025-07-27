'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@marketplace/ui'
import { Badge, Input } from '@medusajs/ui'
import { formatCurrency } from '@/lib/utils'

type Order = {
  id: string
  display_id: number
  status: string
  fulfillment_status: string
  payment_status: string
  customer: {
    first_name: string
    last_name: string
    email: string
  }
  shipping_address: {
    first_name: string
    last_name: string
    address_1: string
    address_2?: string
    city: string
    province: string
    postal_code: string
    country_code: string
  }
  items: Array<{
    id: string
    title: string
    variant: {
      title: string
      sku: string
    }
    quantity: number
    unit_price: number
  }>
  total: number
  subtotal: number
  shipping_total: number
  tax_total: number
  currency_code: string
  created_at: string
}

const statusConfig: Record<string, { label: string; color: 'green' | 'blue' | 'red' | 'orange' | 'grey' | 'purple'; icon: any }> = {
  pending: { label: 'Pending', color: 'orange', icon: ClockIcon },
  completed: { label: 'Completed', color: 'green', icon: CheckCircleIcon },
  archived: { label: 'Archived', color: 'grey', icon: CheckCircleIcon },
  canceled: { label: 'Canceled', color: 'red', icon: XCircleIcon },
  requires_action: { label: 'Action Required', color: 'red', icon: ClockIcon },
}

const fulfillmentStatusConfig: Record<string, { label: string; color: 'green' | 'blue' | 'red' | 'orange' | 'grey' | 'purple' }> = {
  not_fulfilled: { label: 'Unfulfilled', color: 'grey' },
  partially_fulfilled: { label: 'Partially Fulfilled', color: 'orange' },
  fulfilled: { label: 'Fulfilled', color: 'green' },
  partially_shipped: { label: 'Partially Shipped', color: 'orange' },
  shipped: { label: 'Shipped', color: 'blue' },
  delivered: { label: 'Delivered', color: 'green' },
  partially_returned: { label: 'Partially Returned', color: 'orange' },
  returned: { label: 'Returned', color: 'grey' },
  canceled: { label: 'Canceled', color: 'red' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [fulfillmentFilter, setFulfillmentFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.display_id.toString().includes(searchQuery) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.customer.first_name} ${order.customer.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesFulfillment = fulfillmentFilter === 'all' || order.fulfillment_status === fulfillmentFilter
    
    return matchesSearch && matchesStatus && matchesFulfillment
  })

  const getOrderStats = () => {
    const pending = orders.filter(o => o.fulfillment_status === 'not_fulfilled').length
    const processing = orders.filter(o => ['partially_fulfilled', 'partially_shipped'].includes(o.fulfillment_status)).length
    const completed = orders.filter(o => ['delivered', 'fulfilled'].includes(o.fulfillment_status)).length
    
    return { pending, processing, completed }
  }

  const stats = getOrderStats()

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and fulfill customer orders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Orders
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.pending}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TruckIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Processing
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.processing}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.completed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>

        <select
          value={fulfillmentFilter}
          onChange={(e) => setFulfillmentFilter(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="all">All Fulfillment</option>
          <option value="not_fulfilled">Unfulfilled</option>
          <option value="partially_fulfilled">Partially Fulfilled</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fulfillment
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    href={`/dashboard/brand/orders/${order.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-900"
                  >
                    #{order.display_id}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.customer.first_name} {order.customer.last_name}
                  </div>
                  <div className="text-sm text-gray-500">{order.customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(order.total, order.currency_code)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    color={statusConfig[order.status as keyof typeof statusConfig]?.color || 'grey'} 
                    size="small"
                  >
                    {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    color={fulfillmentStatusConfig[order.fulfillment_status as keyof typeof fulfillmentStatusConfig]?.color || 'grey'} 
                    size="small"
                  >
                    {fulfillmentStatusConfig[order.fulfillment_status as keyof typeof fulfillmentStatusConfig]?.label || order.fulfillment_status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/dashboard/brand/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}