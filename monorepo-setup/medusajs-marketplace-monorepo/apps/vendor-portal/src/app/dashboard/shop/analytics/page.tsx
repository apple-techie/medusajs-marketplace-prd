'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  EyeIcon,
  ArrowPathIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowDownTrayIcon
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
    total_clicks: number
    unique_visitors: number
    conversion_rate: number
    average_order_value: number
    total_revenue: number
    total_commission: number
    period_change: {
      clicks: number
      visitors: number
      conversion: number
      aov: number
      revenue: number
      commission: number
    }
  }
  referral_performance: {
    code: string
    clicks: number
    conversions: number
    conversion_rate: number
    revenue: number
    commission: number
  }[]
  traffic_sources: {
    source: string
    visits: number
    conversions: number
    revenue: number
  }[]
  top_products: {
    product_name: string
    referrals: number
    revenue: number
    commission: number
  }[]
  daily_metrics: {
    date: string
    clicks: number
    conversions: number
    revenue: number
  }[]
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('last_30_days')
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'clicks' | 'conversions'>('revenue')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(`http://localhost:9000/vendor/shop/analytics?period=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportAnalytics = () => {
    // In a real app, this would generate and download a report
    console.log('Exporting analytics...')
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

  // Chart data preparation
  const dailyChartData = {
    labels: analytics.daily_metrics.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: selectedMetric === 'revenue' ? 'Revenue' : selectedMetric === 'clicks' ? 'Clicks' : 'Conversions',
        data: analytics.daily_metrics.map(d => 
          selectedMetric === 'revenue' ? d.revenue / 100 : 
          selectedMetric === 'clicks' ? d.clicks : 
          d.conversions
        ),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const trafficSourcesData = {
    labels: analytics.traffic_sources.map(s => s.source),
    datasets: [
      {
        data: analytics.traffic_sources.map(s => s.visits),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  const referralPerformanceData = {
    labels: analytics.referral_performance.map(r => r.code),
    datasets: [
      {
        label: 'Commission Earned',
        data: analytics.referral_performance.map(r => r.commission / 100),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 4
      }
    ]
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track your referral performance and earnings
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="this_month">This month</option>
            <option value="last_month">Last month</option>
          </select>
          <button
            onClick={exportAnalytics}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <EyeIcon className="h-8 w-8 text-blue-600" />
            <span className={`text-sm font-medium ${analytics.overview.period_change.clicks >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.overview.period_change.clicks >= 0 ? '+' : ''}{analytics.overview.period_change.clicks}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.overview.total_clicks.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Clicks</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
            <span className={`text-sm font-medium ${analytics.overview.period_change.visitors >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.overview.period_change.visitors >= 0 ? '+' : ''}{analytics.overview.period_change.visitors}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.overview.unique_visitors.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Unique Visitors</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <ArrowPathIcon className="h-8 w-8 text-green-600" />
            <span className={`text-sm font-medium ${analytics.overview.period_change.conversion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.overview.period_change.conversion >= 0 ? '+' : ''}{analytics.overview.period_change.conversion}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.overview.conversion_rate}%</p>
          <p className="text-sm text-gray-500">Conversion Rate</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCartIcon className="h-8 w-8 text-orange-600" />
            <span className={`text-sm font-medium ${analytics.overview.period_change.aov >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.overview.period_change.aov >= 0 ? '+' : ''}{analytics.overview.period_change.aov}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(analytics.overview.average_order_value / 100).toFixed(2)}</p>
          <p className="text-sm text-gray-500">Avg Order Value</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            <span className={`text-sm font-medium ${analytics.overview.period_change.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.overview.period_change.revenue >= 0 ? '+' : ''}{analytics.overview.period_change.revenue}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(analytics.overview.total_revenue / 100).toFixed(2)}</p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <ChartBarIcon className="h-8 w-8 text-indigo-600" />
            <span className={`text-sm font-medium ${analytics.overview.period_change.commission >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.overview.period_change.commission >= 0 ? '+' : ''}{analytics.overview.period_change.commission}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(analytics.overview.total_commission / 100).toFixed(2)}</p>
          <p className="text-sm text-gray-500">Commission Earned</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Performance Trends</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedMetric('revenue')}
                className={`px-3 py-1 text-sm rounded ${selectedMetric === 'revenue' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                Revenue
              </button>
              <button
                onClick={() => setSelectedMetric('clicks')}
                className={`px-3 py-1 text-sm rounded ${selectedMetric === 'clicks' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                Clicks
              </button>
              <button
                onClick={() => setSelectedMetric('conversions')}
                className={`px-3 py-1 text-sm rounded ${selectedMetric === 'conversions' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                Conversions
              </button>
            </div>
          </div>
          <div className="h-64">
            <Line 
              data={dailyChartData} 
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
            />
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
          <div className="h-64">
            <Doughnut
              data={trafficSourcesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Referral Performance */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Referral Code Performance</h2>
        <div className="h-64">
          <Bar
            data={referralPerformanceData}
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
          />
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Performing Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Product</th>
                <th className="text-right py-3 px-6 font-medium text-gray-900">Referrals</th>
                <th className="text-right py-3 px-6 font-medium text-gray-900">Revenue</th>
                <th className="text-right py-3 px-6 font-medium text-gray-900">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.top_products.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-900">{product.product_name}</td>
                  <td className="py-4 px-6 text-right text-gray-600">{product.referrals}</td>
                  <td className="py-4 px-6 text-right text-gray-900">${(product.revenue / 100).toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-medium text-green-600">
                    ${(product.commission / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}