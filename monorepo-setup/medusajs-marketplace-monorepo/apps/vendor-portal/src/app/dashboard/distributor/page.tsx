'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  TruckIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface DistributorStats {
  total_orders: number
  pending_fulfillments: number
  in_transit: number
  delivered_today: number
  total_locations: number
  active_transfers: number
  low_stock_alerts: number
  fulfillment_rate: number
  average_delivery_time: number
  total_revenue: number
  period_comparison: {
    orders: number
    revenue: number
    fulfillment_rate: number
    delivery_time: number
  }
}

interface RecentOrder {
  id: string
  order_number: string
  destination: string
  items_count: number
  status: 'pending' | 'processing' | 'in_transit' | 'delivered'
  priority: 'standard' | 'express' | 'urgent'
  created_at: string
  expected_delivery: string
}

interface LocationStatus {
  id: string
  name: string
  city: string
  state: string
  inventory_value: number
  stock_level: number
  pending_orders: number
  active_staff: number
  status: 'operational' | 'limited' | 'offline'
}

interface ActiveTransfer {
  id: string
  from_location: string
  to_location: string
  items_count: number
  status: 'preparing' | 'in_transit' | 'received'
  initiated_at: string
  expected_arrival: string
}

export default function DistributorDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DistributorStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [locations, setLocations] = useState<LocationStatus[]>([])
  const [transfers, setTransfers] = useState<ActiveTransfer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('today')

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('vendor_token')
      const vendorType = localStorage.getItem('vendor_type')
      
      if (!token || vendorType !== 'distributor_partner') {
        router.push('/vendor/login')
      }
    }
    
    checkAuth()
    fetchDashboardData()
  }, [router, selectedPeriod])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      
      // Fetch distributor stats
      const statsResponse = await fetch(`http://localhost:9000/vendor/distributor/stats?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }
      
      // Fetch recent orders
      const ordersResponse = await fetch('http://localhost:9000/vendor/distributor/orders/recent', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setRecentOrders(ordersData.orders || [])
      }
      
      // Fetch locations status
      const locationsResponse = await fetch('http://localhost:9000/vendor/distributor/locations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json()
        setLocations(locationsData.locations || [])
      }
      
      // Fetch active transfers
      const transfersResponse = await fetch('http://localhost:9000/vendor/distributor/transfers/active', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (transfersResponse.ok) {
        const transfersData = await transfersResponse.json()
        setTransfers(transfersData.transfers || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'operational':
      case 'received':
        return 'text-green-600 bg-green-100'
      case 'in_transit':
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
      case 'preparing':
      case 'limited':
        return 'text-yellow-600 bg-yellow-100'
      case 'offline':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600'
      case 'express':
        return 'text-orange-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distribution Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your distribution network and fulfillment operations
          </p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_orders}</p>
              <p className="mt-1 text-sm">
                <span className={`font-medium ${stats.period_comparison.orders >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.period_comparison.orders >= 0 ? '+' : ''}{stats.period_comparison.orders}%
                </span>
                <span className="text-gray-500"> vs last period</span>
              </p>
            </div>
            <CubeIcon className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fulfillment Rate</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.fulfillment_rate}%</p>
              <p className="mt-1 text-sm">
                <span className={`font-medium ${stats.period_comparison.fulfillment_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.period_comparison.fulfillment_rate >= 0 ? '+' : ''}{stats.period_comparison.fulfillment_rate}%
                </span>
                <span className="text-gray-500"> vs last period</span>
              </p>
            </div>
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Delivery Time</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.average_delivery_time}h</p>
              <p className="mt-1 text-sm">
                <span className={`font-medium ${stats.period_comparison.delivery_time <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.period_comparison.delivery_time > 0 ? '+' : ''}{stats.period_comparison.delivery_time}%
                </span>
                <span className="text-gray-500"> vs last period</span>
              </p>
            </div>
            <ClockIcon className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ${(stats.total_revenue / 100).toLocaleString()}
              </p>
              <p className="mt-1 text-sm">
                <span className={`font-medium ${stats.period_comparison.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.period_comparison.revenue >= 0 ? '+' : ''}{stats.period_comparison.revenue}%
                </span>
                <span className="text-gray-500"> vs last period</span>
              </p>
            </div>
            <ChartBarIcon className="h-10 w-10 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending Fulfillments</p>
              <p className="mt-2 text-3xl font-bold text-yellow-900">{stats.pending_fulfillments}</p>
              <button 
                onClick={() => router.push('/dashboard/distributor/fulfillment')}
                className="mt-3 text-sm font-medium text-yellow-700 hover:text-yellow-800"
              >
                View all →
              </button>
            </div>
            <ExclamationTriangleIcon className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">In Transit</p>
              <p className="mt-2 text-3xl font-bold text-blue-900">{stats.in_transit}</p>
              <button 
                onClick={() => router.push('/dashboard/distributor/fulfillment')}
                className="mt-3 text-sm font-medium text-blue-700 hover:text-blue-800"
              >
                Track shipments →
              </button>
            </div>
            <TruckIcon className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Low Stock Alerts</p>
              <p className="mt-2 text-3xl font-bold text-red-900">{stats.low_stock_alerts}</p>
              <button 
                onClick={() => router.push('/dashboard/distributor/inventory')}
                className="mt-3 text-sm font-medium text-red-700 hover:text-red-800"
              >
                Manage inventory →
              </button>
            </div>
            <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <button
                onClick={() => router.push('/dashboard/distributor/fulfillment')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">#{order.order_number}</p>
                        <span className={`text-sm font-medium ${getPriorityColor(order.priority)}`}>
                          {order.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{order.destination}</p>
                      <p className="text-sm text-gray-500">{order.items_count} items</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        Expected: {new Date(order.expected_delivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Status */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Location Status</h2>
              <button
                onClick={() => router.push('/dashboard/distributor/hubs')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Manage hubs
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {locations.map((location) => (
                <div key={location.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{location.name}</p>
                        <p className="text-sm text-gray-600">{location.city}, {location.state}</p>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Stock Level:</span>
                            <span className="ml-1 font-medium">{location.stock_level}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Pending:</span>
                            <span className="ml-1 font-medium">{location.pending_orders}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(location.status)}`}>
                      {location.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Transfers */}
      {transfers.length > 0 && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Active Transfers</h2>
                <button
                  onClick={() => router.push('/dashboard/distributor/transfers')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Manage transfers
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {transfers.map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <ArrowsRightLeftIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transfer.from_location} → {transfer.to_location}
                        </p>
                        <p className="text-sm text-gray-500">{transfer.items_count} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                        {transfer.status.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        ETA: {new Date(transfer.expected_arrival).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}