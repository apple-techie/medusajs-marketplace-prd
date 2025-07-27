'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { formatCurrency } from '@marketplace/ui/utils'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface PlatformMetrics {
  totalGMV: number
  totalCommissions: number
  activeOrders: number
  activeVendors: number
  totalProducts: number
  totalCustomers: number
  todayMetrics: {
    orders: number
    revenue: number
    newCustomers: number
    completedDeliveries: number
    averageOrderValue: number
    conversionRate: number
  }
  vendorsByType: {
    shop: number
    brand: number
    distributor: number
  }
  ordersByStatus: {
    pending: number
    processing: number
    fulfilled: number
    delivered: number
    cancelled: number
  }
  performanceMetrics: {
    averageFulfillmentTime: number
    onTimeDeliveryRate: number
    customerSatisfaction: number
    vendorCompliance: number
  }
  revenueByPeriod: {
    label: string
    gmv: number
    commission: number
  }[]
  topVendors: {
    id: string
    name: string
    type: string
    revenue: number
    orders: number
    growth: number
  }[]
  alerts: {
    id: string
    type: 'critical' | 'warning' | 'info'
    title: string
    message: string
    timestamp: string
    vendorId?: string
    orderId?: string
  }[]
}

export default function OperationsOverview() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchDashboardData()
    // Disabled auto-refresh to prevent reconnection issues with mock data
    // const interval = setInterval(() => {
    //   setRefreshKey(prev => prev + 1)
    // }, 30000)
    // return () => clearInterval(interval)
  }, [selectedPeriod])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockMetrics: PlatformMetrics = {
        totalGMV: 2847500000, // $28.475M in cents
        totalCommissions: 512550000, // $5.125M in cents
        activeOrders: 342,
        activeVendors: 186,
        totalProducts: 3250,
        totalCustomers: 15420,
        todayMetrics: {
          orders: 87,
          revenue: 58500000, // $585K in cents
          newCustomers: 23,
          completedDeliveries: 76,
          averageOrderValue: 67241, // $672.41 in cents
          conversionRate: 3.8
        },
        vendorsByType: {
          shop: 125,
          brand: 48,
          distributor: 13
        },
        ordersByStatus: {
          pending: 45,
          processing: 89,
          fulfilled: 124,
          delivered: 76,
          cancelled: 8
        },
        performanceMetrics: {
          averageFulfillmentTime: 2.3,
          onTimeDeliveryRate: 94.5,
          customerSatisfaction: 4.7,
          vendorCompliance: 98.2
        },
        revenueByPeriod: [
          { label: 'Mon', gmv: 4200000, commission: 756000 },
          { label: 'Tue', gmv: 3850000, commission: 693000 },
          { label: 'Wed', gmv: 4500000, commission: 810000 },
          { label: 'Thu', gmv: 4100000, commission: 738000 },
          { label: 'Fri', gmv: 5200000, commission: 936000 },
          { label: 'Sat', gmv: 3800000, commission: 684000 },
          { label: 'Sun', gmv: 3200000, commission: 576000 }
        ],
        topVendors: [
          { id: 'v1', name: 'Green Valley Dispensary', type: 'shop', revenue: 3200000, orders: 145, growth: 12.5 },
          { id: 'v2', name: 'Premium Brands Co', type: 'brand', revenue: 2850000, orders: 98, growth: 8.3 },
          { id: 'v3', name: 'West Coast Distribution', type: 'distributor', revenue: 2600000, orders: 210, growth: 15.7 },
          { id: 'v4', name: 'Herbal Wellness Shop', type: 'shop', revenue: 2400000, orders: 132, growth: -2.1 },
          { id: 'v5', name: 'Elevated Brands', type: 'brand', revenue: 2100000, orders: 87, growth: 6.9 }
        ],
        alerts: [
          {
            id: 'a1',
            type: 'critical',
            title: 'Low Inventory Alert',
            message: 'Multiple products running low at Bay Area Warehouse',
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            vendorId: 'v3'
          },
          {
            id: 'a2',
            type: 'warning',
            title: 'Compliance Review Required',
            message: '3 new vendors pending compliance verification',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
          },
          {
            id: 'a3',
            type: 'info',
            title: 'High Order Volume',
            message: 'Order volume 25% above average for this time',
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
          }
        ]
      }
      setMetrics(mockMetrics)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !metrics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading operations dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </DashboardLayout>
    )
  }

  // Chart configurations
  const revenueChartData = {
    labels: metrics.revenueByPeriod.map(p => p.label),
    datasets: [
      {
        label: 'GMV',
        data: metrics.revenueByPeriod.map(p => p.gmv / 100),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4
      },
      {
        label: 'Commission',
        data: metrics.revenueByPeriod.map(p => p.commission / 100),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  }

  const orderStatusData = {
    labels: ['Pending', 'Processing', 'Fulfilled', 'Delivered', 'Cancelled'],
    datasets: [{
      data: [
        metrics.ordersByStatus.pending,
        metrics.ordersByStatus.processing,
        metrics.ordersByStatus.fulfilled,
        metrics.ordersByStatus.delivered,
        metrics.ordersByStatus.cancelled
      ],
      backgroundColor: [
        'rgba(156, 163, 175, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
      default:
        return <BellIcon className="h-5 w-5 text-blue-600" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Operations Command Center</h2>
            <p className="text-gray-600 mt-1">
              Real-time marketplace performance and operational metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              Auto-refresh: Disabled
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-10 w-10 text-green-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total GMV</dt>
                    <dd className="mt-1 text-xl font-semibold text-gray-900">
                      {formatCurrency(metrics.totalGMV)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ChartBarIcon className="h-10 w-10 text-blue-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Commission</dt>
                    <dd className="mt-1 text-xl font-semibold text-gray-900">
                      {formatCurrency(metrics.totalCommissions)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ShoppingCartIcon className="h-10 w-10 text-purple-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Orders</dt>
                    <dd className="mt-1 text-xl font-semibold text-gray-900">{metrics.activeOrders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <BuildingStorefrontIcon className="h-10 w-10 text-indigo-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Vendors</dt>
                    <dd className="mt-1 text-xl font-semibold text-gray-900">{metrics.activeVendors}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <UsersIcon className="h-10 w-10 text-orange-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Customers</dt>
                    <dd className="mt-1 text-xl font-semibold text-gray-900">
                      {metrics.totalCustomers.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <TruckIcon className="h-10 w-10 text-teal-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Deliveries</dt>
                    <dd className="mt-1 text-xl font-semibold text-gray-900">
                      {metrics.todayMetrics.completedDeliveries}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trends</h3>
            <div className="h-80 w-full">
              <Line
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${(value as number).toLocaleString()}`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
            <div className="h-80 w-full">
              <Doughnut
                data={orderStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Metrics */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">On-Time Delivery Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    {metrics.performanceMetrics.onTimeDeliveryRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${metrics.performanceMetrics.onTimeDeliveryRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                  <span className="text-sm font-medium text-gray-900">
                    {metrics.performanceMetrics.customerSatisfaction}/5.0
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(metrics.performanceMetrics.customerSatisfaction / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Vendor Compliance</span>
                  <span className="text-sm font-medium text-gray-900">
                    {metrics.performanceMetrics.vendorCompliance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${metrics.performanceMetrics.vendorCompliance}%` }}
                  />
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Fulfillment Time</span>
                  <span className="text-sm font-medium text-gray-900">
                    {metrics.performanceMetrics.averageFulfillmentTime} hours
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Snapshot */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Snapshot</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{metrics.todayMetrics.orders}</p>
                <p className="text-sm text-gray-600">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.todayMetrics.revenue)}
                </p>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{metrics.todayMetrics.newCustomers}</p>
                <p className="text-sm text-gray-600">New Customers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.todayMetrics.averageOrderValue)}
                </p>
                <p className="text-sm text-gray-600">Avg Order Value</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-lg font-medium text-gray-900">
                  {metrics.todayMetrics.conversionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Vendors */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Top Performing Vendors</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.topVendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(vendor.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vendor.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {vendor.growth >= 0 ? (
                            <>
                              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-sm text-green-600">+{vendor.growth}%</span>
                            </>
                          ) : (
                            <>
                              <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                              <span className="text-sm text-red-600">{vendor.growth}%</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">System Alerts</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {metrics.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTimestamp(alert.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
