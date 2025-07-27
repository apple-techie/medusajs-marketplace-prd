'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TruckIcon,
  CubeIcon,
  ClockIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface AnalyticsData {
  overview: {
    total_deliveries: number
    on_time_rate: number
    avg_delivery_time: number
    total_volume: number
    total_revenue: number
    active_routes: number
    period_comparison: {
      deliveries: number
      on_time_rate: number
      revenue: number
      volume: number
    }
  }
  performance: {
    daily_deliveries: {
      date: string
      count: number
      on_time: number
      delayed: number
    }[]
    hourly_throughput: {
      hour: string
      orders: number
    }[]
    delivery_times: {
      range: string
      count: number
    }[]
  }
  hub_metrics: {
    hub_name: string
    utilization: number
    throughput: number
    efficiency: number
    revenue: number
  }[]
  route_analytics: {
    route_name: string
    deliveries: number
    avg_time: number
    distance: number
    fuel_cost: number
    efficiency: number
  }[]
  product_distribution: {
    category: string
    volume: number
    revenue: number
    percentage: number
  }[]
  customer_insights: {
    top_customers: {
      name: string
      orders: number
      revenue: number
      avg_order_value: number
    }[]
    customer_types: {
      type: string
      count: number
      revenue: number
    }[]
  }
}

export default function DistributorAnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedMetric, setSelectedMetric] = useState<'deliveries' | 'revenue' | 'efficiency'>('deliveries')

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('vendor_token')
      const vendorType = localStorage.getItem('vendor_type')
      
      if (!token || vendorType !== 'distributor_partner') {
        router.push('/vendor/login')
      }
    }
    
    checkAuth()
    fetchAnalytics()
  }, [router, selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Mock analytics data
      const mockAnalytics: AnalyticsData = {
        overview: {
          total_deliveries: 3250,
          on_time_rate: 94.5,
          avg_delivery_time: 3.2,
          total_volume: 45000,
          total_revenue: 285000000,
          active_routes: 24,
          period_comparison: {
            deliveries: 12,
            on_time_rate: 2.3,
            revenue: 18,
            volume: 15
          }
        },
        performance: {
          daily_deliveries: [
            { date: 'Mon', count: 520, on_time: 492, delayed: 28 },
            { date: 'Tue', count: 485, on_time: 461, delayed: 24 },
            { date: 'Wed', count: 510, on_time: 479, delayed: 31 },
            { date: 'Thu', count: 495, on_time: 468, delayed: 27 },
            { date: 'Fri', count: 540, on_time: 513, delayed: 27 },
            { date: 'Sat', count: 380, on_time: 361, delayed: 19 },
            { date: 'Sun', count: 320, on_time: 304, delayed: 16 }
          ],
          hourly_throughput: [
            { hour: '6AM', orders: 45 },
            { hour: '8AM', orders: 120 },
            { hour: '10AM', orders: 180 },
            { hour: '12PM', orders: 220 },
            { hour: '2PM', orders: 200 },
            { hour: '4PM', orders: 160 },
            { hour: '6PM', orders: 140 },
            { hour: '8PM', orders: 80 }
          ],
          delivery_times: [
            { range: '<2 hours', count: 850 },
            { range: '2-4 hours', count: 1680 },
            { range: '4-6 hours', count: 520 },
            { range: '6-8 hours', count: 150 },
            { range: '>8 hours', count: 50 }
          ]
        },
        hub_metrics: [
          {
            hub_name: 'Main Distribution Center',
            utilization: 85,
            throughput: 450,
            efficiency: 98.5,
            revenue: 12500000
          },
          {
            hub_name: 'Bay Area Warehouse',
            utilization: 45,
            throughput: 280,
            efficiency: 92.3,
            revenue: 8200000
          },
          {
            hub_name: 'North Valley Hub',
            utilization: 72,
            throughput: 320,
            efficiency: 96.7,
            revenue: 9800000
          },
          {
            hub_name: 'Desert Distribution',
            utilization: 15,
            throughput: 120,
            efficiency: 85.2,
            revenue: 3500000
          }
        ],
        route_analytics: [
          {
            route_name: 'LA Downtown Route',
            deliveries: 450,
            avg_time: 2.8,
            distance: 125,
            fuel_cost: 45000,
            efficiency: 96.5
          },
          {
            route_name: 'Bay Area Circuit',
            deliveries: 380,
            avg_time: 3.5,
            distance: 180,
            fuel_cost: 62000,
            efficiency: 91.2
          },
          {
            route_name: 'Valley Express',
            deliveries: 320,
            avg_time: 3.2,
            distance: 150,
            fuel_cost: 52000,
            efficiency: 94.8
          },
          {
            route_name: 'Desert Run',
            deliveries: 180,
            avg_time: 4.5,
            distance: 220,
            fuel_cost: 78000,
            efficiency: 82.4
          }
        ],
        product_distribution: [
          { category: 'Flower', volume: 18000, revenue: 120000000, percentage: 40 },
          { category: 'Edibles', volume: 12000, revenue: 72000000, percentage: 27 },
          { category: 'Concentrates', volume: 8000, revenue: 60000000, percentage: 18 },
          { category: 'Vapes', volume: 5000, revenue: 25000000, percentage: 10 },
          { category: 'Accessories', volume: 2000, revenue: 8000000, percentage: 5 }
        ],
        customer_insights: {
          top_customers: [
            {
              name: 'Green Valley Dispensary',
              orders: 245,
              revenue: 3200000,
              avg_order_value: 13061
            },
            {
              name: 'Herbal Wellness Shop',
              orders: 198,
              revenue: 2850000,
              avg_order_value: 14394
            },
            {
              name: "Nature's Medicine",
              orders: 186,
              revenue: 2600000,
              avg_order_value: 13978
            },
            {
              name: 'Elevated Health Store',
              orders: 172,
              revenue: 2400000,
              avg_order_value: 13953
            }
          ],
          customer_types: [
            { type: 'Dispensaries', count: 125, revenue: 180000000 },
            { type: 'Retail Shops', count: 85, revenue: 75000000 },
            { type: 'Wellness Centers', count: 45, revenue: 30000000 }
          ]
        }
      }

      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    )
  }

  // Chart configurations
  const deliveryChartData = {
    labels: analytics.performance.daily_deliveries.map(d => d.date),
    datasets: [
      {
        label: 'Total Deliveries',
        data: analytics.performance.daily_deliveries.map(d => d.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'On-Time Deliveries',
        data: analytics.performance.daily_deliveries.map(d => d.on_time),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  }

  const throughputChartData = {
    labels: analytics.performance.hourly_throughput.map(h => h.hour),
    datasets: [
      {
        label: 'Orders Processed',
        data: analytics.performance.hourly_throughput.map(h => h.orders),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1
      }
    ]
  }

  const deliveryTimeChartData = {
    labels: analytics.performance.delivery_times.map(d => d.range),
    datasets: [{
      data: analytics.performance.delivery_times.map(d => d.count),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  }

  const productDistributionData = {
    labels: analytics.product_distribution.map(p => p.category),
    datasets: [{
      data: analytics.product_distribution.map(p => p.percentage),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)'
      ],
      borderWidth: 0
    }]
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distribution Analytics</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track performance metrics and optimize your distribution network
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
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{analytics.overview.total_deliveries.toLocaleString()}</p>
              <p className="mt-1 text-sm">
                <span className={`font-medium ${analytics.overview.period_comparison.deliveries >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.overview.period_comparison.deliveries >= 0 ? '+' : ''}{analytics.overview.period_comparison.deliveries}%
                </span>
                <span className="text-gray-500"> vs last period</span>
              </p>
            </div>
            <TruckIcon className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{analytics.overview.on_time_rate}%</p>
              <p className="mt-1 text-sm">
                <span className={`font-medium ${analytics.overview.period_comparison.on_time_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.overview.period_comparison.on_time_rate >= 0 ? '+' : ''}{analytics.overview.period_comparison.on_time_rate}%
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
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{(analytics.overview.total_volume / 1000).toFixed(1)}k</p>
              <p className="mt-1 text-sm">
                <span className={`font-medium ${analytics.overview.period_comparison.volume >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.overview.period_comparison.volume >= 0 ? '+' : ''}{analytics.overview.period_comparison.volume}%
                </span>
                <span className="text-gray-500"> units moved</span>
              </p>
            </div>
            <CubeIcon className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ${(analytics.overview.total_revenue / 100000).toFixed(1)}k
              </p>
              <p className="mt-1 text-sm">
                <span className={`font-medium ${analytics.overview.period_comparison.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.overview.period_comparison.revenue >= 0 ? '+' : ''}{analytics.overview.period_comparison.revenue}%
                </span>
                <span className="text-gray-500"> vs last period</span>
              </p>
            </div>
            <CurrencyDollarIcon className="h-10 w-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Delivery Performance</h3>
          <Line
            data={deliveryChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
            height={300}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Throughput</h3>
          <Bar
            data={throughputChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
            height={300}
          />
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Time Distribution</h3>
          <Doughnut
            data={deliveryTimeChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right'
                }
              }
            }}
            height={300}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Distribution</h3>
          <Doughnut
            data={productDistributionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right'
                }
              }
            }}
            height={300}
          />
        </div>
      </div>

      {/* Hub Performance Table */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Hub Performance Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hub
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daily Throughput
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.hub_metrics.map((hub, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingStorefrontIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{hub.hub_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">{hub.utilization}%</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${hub.utilization > 80 ? 'bg-red-600' : hub.utilization > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                          style={{ width: `${hub.utilization}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hub.throughput} orders/day
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      hub.efficiency >= 95 ? 'bg-green-100 text-green-800' : 
                      hub.efficiency >= 90 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {hub.efficiency}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(hub.revenue / 100).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Analytics */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Route Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deliveries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.route_analytics.map((route, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{route.route_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.deliveries}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.avg_time} hours
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.distance} miles
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(route.fuel_cost / 100).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{route.efficiency}%</span>
                      {route.efficiency >= 90 ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 ml-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 ml-1" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.customer_insights.top_customers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${(customer.revenue / 100).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Avg: ${(customer.avg_order_value / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Customer Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.customer_insights.customer_types.map((type, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{type.type}</span>
                    <span className="text-sm text-gray-500">{type.count} customers</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(type.revenue / analytics.overview.total_revenue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ${(type.revenue / 100000).toFixed(1)}k revenue
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}