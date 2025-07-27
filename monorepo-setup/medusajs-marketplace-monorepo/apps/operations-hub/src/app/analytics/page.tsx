'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { formatCurrency, formatPercentage } from '@marketplace/ui/utils'
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ClockIcon,
  ArrowPathIcon,
  FunnelIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  MapIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
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
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface AnalyticsStats {
  total_revenue: number
  revenue_growth: number
  total_orders: number
  order_growth: number
  average_order_value: number
  aov_growth: number
  total_customers: number
  customer_growth: number
  total_vendors: number
  active_vendors: number
  total_products: number
  product_growth: number
  conversion_rate: number
  conversion_growth: number
  repeat_purchase_rate: number
}

interface VendorPerformance {
  vendor_id: string
  vendor_name: string
  vendor_type: string
  revenue: number
  orders: number
  products: number
  conversion_rate: number
  average_order_value: number
  customer_satisfaction: number
  growth_rate: number
}

interface ProductPerformance {
  product_id: string
  product_title: string
  category: string
  vendor_name: string
  revenue: number
  units_sold: number
  conversion_rate: number
  return_rate: number
  inventory_turnover: number
  trend: 'up' | 'down' | 'stable'
}

interface CustomerMetrics {
  acquisition_cost: number
  lifetime_value: number
  churn_rate: number
  retention_rate: number
  satisfaction_score: number
  segments: {
    name: string
    count: number
    revenue: number
    aov: number
  }[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [vendorPerformance, setVendorPerformance] = useState<VendorPerformance[]>([])
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([])
  const [customerMetrics, setCustomerMetrics] = useState<CustomerMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'customers' | 'products'>('revenue')
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'products' | 'customers' | 'geographic'>('overview')

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Mock data for demonstration
      const mockStats: AnalyticsStats = {
        total_revenue: 12500000,
        revenue_growth: 24.5,
        total_orders: 8450,
        order_growth: 18.2,
        average_order_value: 14792,
        aov_growth: 5.3,
        total_customers: 15420,
        customer_growth: 32.1,
        total_vendors: 157,
        active_vendors: 145,
        total_products: 3250,
        product_growth: 15.7,
        conversion_rate: 3.8,
        conversion_growth: 0.5,
        repeat_purchase_rate: 28.4
      }

      const mockVendorPerformance: VendorPerformance[] = [
        {
          vendor_id: 'v1',
          vendor_name: 'Green Valley Dispensary',
          vendor_type: 'shop_partner',
          revenue: 3200000,
          orders: 2150,
          products: 125,
          conversion_rate: 4.2,
          average_order_value: 14884,
          customer_satisfaction: 4.8,
          growth_rate: 28.5
        },
        {
          vendor_id: 'v2',
          vendor_name: 'Premium Brands Co',
          vendor_type: 'brand_partner',
          revenue: 2850000,
          orders: 1890,
          products: 85,
          conversion_rate: 3.9,
          average_order_value: 15079,
          customer_satisfaction: 4.7,
          growth_rate: 22.3
        },
        {
          vendor_id: 'v3',
          vendor_name: 'West Coast Distribution',
          vendor_type: 'distributor_partner',
          revenue: 4500000,
          orders: 450,
          products: 320,
          conversion_rate: 2.1,
          average_order_value: 100000,
          customer_satisfaction: 4.5,
          growth_rate: 35.2
        },
        {
          vendor_id: 'v4',
          vendor_name: 'Herbal Wellness Shop',
          vendor_type: 'shop_partner',
          revenue: 1250000,
          orders: 980,
          products: 65,
          conversion_rate: 3.5,
          average_order_value: 12755,
          customer_satisfaction: 4.6,
          growth_rate: 18.9
        }
      ]

      const mockProductPerformance: ProductPerformance[] = [
        {
          product_id: 'prod_1',
          product_title: 'Premium OG Kush',
          category: 'Flower',
          vendor_name: 'Green Valley Dispensary',
          revenue: 850000,
          units_sold: 1250,
          conversion_rate: 5.2,
          return_rate: 0.8,
          inventory_turnover: 4.5,
          trend: 'up'
        },
        {
          product_id: 'prod_2',
          product_title: 'Relaxing Lavender Bath Bomb',
          category: 'Topicals',
          vendor_name: 'Premium Brands Co',
          revenue: 425000,
          units_sold: 850,
          conversion_rate: 3.8,
          return_rate: 1.2,
          inventory_turnover: 3.2,
          trend: 'stable'
        },
        {
          product_id: 'prod_3',
          product_title: 'Mango Haze Vape Cartridge',
          category: 'Vapes',
          vendor_name: 'Premium Brands Co',
          revenue: 625000,
          units_sold: 1100,
          conversion_rate: 4.5,
          return_rate: 2.1,
          inventory_turnover: 6.8,
          trend: 'up'
        },
        {
          product_id: 'prod_4',
          product_title: 'Chocolate Chip Cookies 10-Pack',
          category: 'Edibles',
          vendor_name: 'Herbal Wellness Shop',
          revenue: 312000,
          units_sold: 625,
          conversion_rate: 3.2,
          return_rate: 0.5,
          inventory_turnover: 2.8,
          trend: 'down'
        }
      ]

      const mockCustomerMetrics: CustomerMetrics = {
        acquisition_cost: 4500,
        lifetime_value: 35000,
        churn_rate: 8.5,
        retention_rate: 91.5,
        satisfaction_score: 4.6,
        segments: [
          {
            name: 'Regular Buyers',
            count: 4250,
            revenue: 6500000,
            aov: 15294
          },
          {
            name: 'Occasional Buyers',
            count: 8500,
            revenue: 3800000,
            aov: 4470
          },
          {
            name: 'New Customers',
            count: 2670,
            revenue: 2200000,
            aov: 8240
          }
        ]
      }

      setStats(mockStats)
      setVendorPerformance(mockVendorPerformance)
      setProductPerformance(mockProductPerformance)
      setCustomerMetrics(mockCustomerMetrics)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!stats || !customerMetrics) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load analytics data</p>
        </div>
      </DashboardLayout>
    )
  }

  // Chart data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [1850000, 2100000, 2350000, 2180000, 2450000, 2570000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Orders',
        data: [1250, 1420, 1580, 1480, 1650, 1730],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
        fill: true
      }
    ]
  }

  const categoryBreakdownData = {
    labels: ['Flower', 'Vapes', 'Edibles', 'Topicals', 'Concentrates', 'Accessories'],
    datasets: [{
      data: [35, 25, 20, 10, 7, 3],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(163, 163, 163, 0.8)'
      ],
      borderWidth: 0
    }]
  }

  const vendorTypePerformanceData = {
    labels: ['Revenue', 'Orders', 'Products', 'Customers', 'Growth'],
    datasets: [
      {
        label: 'Shop Partners',
        data: [68, 75, 45, 82, 72],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
      },
      {
        label: 'Brand Partners',
        data: [55, 62, 35, 58, 65],
        backgroundColor: 'rgba(147, 51, 234, 0.2)',
        borderColor: 'rgba(147, 51, 234, 1)',
        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
        pointBorderColor: '#fff',
      },
      {
        label: 'Distributors',
        data: [85, 45, 92, 38, 88],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
      }
    ]
  }

  const customerSegmentData = {
    labels: customerMetrics.segments.map(s => s.name),
    datasets: [{
      label: 'Revenue',
      data: customerMetrics.segments.map(s => s.revenue),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
    }, {
      label: 'Customer Count',
      data: customerMetrics.segments.map(s => s.count * 1000), // Scale for visibility
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      yAxisID: 'y1'
    }]
  }

  const geographicData = {
    labels: ['California', 'Colorado', 'Oregon', 'Washington', 'Nevada', 'Arizona'],
    datasets: [{
      label: 'Revenue by State',
      data: [4500000, 2800000, 2100000, 1850000, 850000, 400000],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(163, 163, 163, 0.8)'
      ],
      borderWidth: 0
    }]
  }

  const getTrendIcon = (growth: number) => {
    if (growth > 0) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
    } else if (growth < 0) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
    }
    return null
  }

  const getGrowthStyle = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const handleExport = () => {
    // Export logic would go here
    alert('Exporting analytics report...')
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h2>
            <p className="text-gray-600 mt-1">
              Comprehensive marketplace analytics and insights
            </p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <button 
              onClick={() => fetchAnalyticsData()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button 
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</dd>
                    <dd className={`mt-1 text-sm flex items-center ${getGrowthStyle(stats.revenue_growth)}`}>
                      {getTrendIcon(stats.revenue_growth)}
                      <span className="ml-1">{Math.abs(stats.revenue_growth)}%</span>
                    </dd>
                  </dl>
                </div>
                <div className="ml-4">
                  <CurrencyDollarIcon className="h-12 w-12 text-green-600 opacity-20" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{stats.total_orders.toLocaleString()}</dd>
                    <dd className={`mt-1 text-sm flex items-center ${getGrowthStyle(stats.order_growth)}`}>
                      {getTrendIcon(stats.order_growth)}
                      <span className="ml-1">{Math.abs(stats.order_growth)}%</span>
                    </dd>
                  </dl>
                </div>
                <div className="ml-4">
                  <ShoppingCartIcon className="h-12 w-12 text-blue-600 opacity-20" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Order Value</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(stats.average_order_value)}</dd>
                    <dd className={`mt-1 text-sm flex items-center ${getGrowthStyle(stats.aov_growth)}`}>
                      {getTrendIcon(stats.aov_growth)}
                      <span className="ml-1">{Math.abs(stats.aov_growth)}%</span>
                    </dd>
                  </dl>
                </div>
                <div className="ml-4">
                  <ChartBarIcon className="h-12 w-12 text-purple-600 opacity-20" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Customers</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{stats.total_customers.toLocaleString()}</dd>
                    <dd className={`mt-1 text-sm flex items-center ${getGrowthStyle(stats.customer_growth)}`}>
                      {getTrendIcon(stats.customer_growth)}
                      <span className="ml-1">{Math.abs(stats.customer_growth)}%</span>
                    </dd>
                  </dl>
                </div>
                <div className="ml-4">
                  <UserGroupIcon className="h-12 w-12 text-indigo-600 opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                <dd className="mt-1 text-xl font-bold text-gray-900">{stats.conversion_rate}%</dd>
                <dd className={`text-xs ${getGrowthStyle(stats.conversion_growth)}`}>
                  +{stats.conversion_growth}% vs last period
                </dd>
              </dl>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Repeat Purchase</dt>
                <dd className="mt-1 text-xl font-bold text-gray-900">{stats.repeat_purchase_rate}%</dd>
                <dd className="text-xs text-gray-500">of customers</dd>
              </dl>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Vendors</dt>
                <dd className="mt-1 text-xl font-bold text-gray-900">{stats.active_vendors}/{stats.total_vendors}</dd>
                <dd className="text-xs text-gray-500">vendors</dd>
              </dl>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Products Listed</dt>
                <dd className="mt-1 text-xl font-bold text-gray-900">{stats.total_products.toLocaleString()}</dd>
                <dd className={`text-xs ${getGrowthStyle(stats.product_growth)}`}>
                  +{stats.product_growth}% growth
                </dd>
              </dl>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">CLV:CAC Ratio</dt>
                <dd className="mt-1 text-xl font-bold text-gray-900">
                  {(customerMetrics.lifetime_value / customerMetrics.acquisition_cost).toFixed(1)}:1
                </dd>
                <dd className="text-xs text-gray-500">lifetime value ratio</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'vendors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vendor Performance
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Product Analytics
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'customers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Customer Insights
              </button>
              <button
                onClick={() => setActiveTab('geographic')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'geographic'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Geographic
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue & Orders Trend</h3>
                  <div className="h-80">
                    <Line
                      data={revenueChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                          mode: 'index',
                          intersect: false,
                        },
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        },
                        scales: {
                          y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            ticks: {
                              callback: function(value) {
                                return '$' + (value as number / 100).toLocaleString()
                              }
                            }
                          },
                          y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: {
                              drawOnChartArea: false,
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
                  <div className="h-80">
                    <Doughnut
                      data={categoryBreakdownData}
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

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vendor Type Performance</h3>
                <div className="h-80">
                  <Radar
                    data={vendorTypePerformanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Vendor Performance Tab */}
          {activeTab === 'vendors' && (
            <div className="p-6">
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
                        AOV
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Satisfaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Growth
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vendorPerformance.map((vendor) => (
                      <tr key={vendor.vendor_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {vendor.vendor_type === 'shop_partner' && <BuildingStorefrontIcon className="h-4 w-4 text-blue-600 mr-2" />}
                            {vendor.vendor_type === 'brand_partner' && <CubeIcon className="h-4 w-4 text-purple-600 mr-2" />}
                            {vendor.vendor_type === 'distributor_partner' && <TruckIcon className="h-4 w-4 text-green-600 mr-2" />}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{vendor.vendor_name}</div>
                              <div className="text-sm text-gray-500">{vendor.products} products</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(vendor.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vendor.orders.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(vendor.average_order_value)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vendor.conversion_rate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{vendor.customer_satisfaction}</span>
                            <span className="ml-1 text-yellow-400">⭐</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center text-sm ${getGrowthStyle(vendor.growth_rate)}`}>
                            {getTrendIcon(vendor.growth_rate)}
                            <span className="ml-1">{vendor.growth_rate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Product Analytics Tab */}
          {activeTab === 'products' && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Units Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Return Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Turnover
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productPerformance.map((product) => (
                      <tr key={product.product_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.product_title}</div>
                            <div className="text-sm text-gray-500">{product.category} • {product.vendor_name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(product.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.units_sold.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.conversion_rate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.return_rate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.inventory_turnover}x
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.trend === 'up' && <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />}
                            {product.trend === 'down' && <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />}
                            {product.trend === 'stable' && <span className="h-4 w-4 text-gray-400">—</span>}
                            <span className={`ml-1 text-sm ${
                              product.trend === 'up' ? 'text-green-600' : 
                              product.trend === 'down' ? 'text-red-600' : 
                              'text-gray-600'
                            }`}>
                              {product.trend}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customer Insights Tab */}
          {activeTab === 'customers' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Segments</h3>
                  <div className="h-80">
                    <Bar
                      data={customerSegmentData}
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
                            type: 'linear',
                            display: true,
                            position: 'left',
                            ticks: {
                              callback: function(value) {
                                return '$' + (value as number / 100).toLocaleString()
                              }
                            }
                          },
                          y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: {
                              drawOnChartArea: false,
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Metrics</h3>
                  <dl className="space-y-4">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Customer Acquisition Cost</dt>
                      <dd className="text-sm font-bold text-gray-900">{formatCurrency(customerMetrics.acquisition_cost)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Customer Lifetime Value</dt>
                      <dd className="text-sm font-bold text-gray-900">{formatCurrency(customerMetrics.lifetime_value)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Retention Rate</dt>
                      <dd className="text-sm font-bold text-gray-900">{customerMetrics.retention_rate}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Churn Rate</dt>
                      <dd className="text-sm font-bold text-gray-900">{customerMetrics.churn_rate}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Satisfaction Score</dt>
                      <dd className="text-sm font-bold text-gray-900">{customerMetrics.satisfaction_score}/5.0</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Segment Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Segment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customers
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          AOV
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % of Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customerMetrics.segments.map((segment) => (
                        <tr key={segment.name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {segment.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {segment.count.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(segment.revenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(segment.aov)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {((segment.revenue / stats.total_revenue) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Geographic Tab */}
          {activeTab === 'geographic' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by State</h3>
                  <div className="h-80">
                    <Bar
                      data={geographicData}
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
                            ticks: {
                              callback: function(value) {
                                return '$' + (value as number / 100).toLocaleString()
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Regions</h3>
                  <div className="space-y-4">
                    {['California', 'Colorado', 'Oregon', 'Washington', 'Nevada'].map((state, index) => {
                      const revenues = [4500000, 2800000, 2100000, 1850000, 850000]
                      const revenue = revenues[index] || 0
                      const percentage = (revenue / (stats?.total_revenue || 1)) * 100
                      
                      return (
                        <div key={state}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{state}</span>
                            <span className="text-sm text-gray-900">{formatCurrency(revenue)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}