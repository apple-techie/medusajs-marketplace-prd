'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { formatCurrency } from '@/lib/utils'
import SalesChart from '@/components/analytics/sales-chart'
import TopProductsTable from '@/components/analytics/top-products-table'
import OrderStatusChart from '@/components/analytics/order-status-chart'
import CustomerInsights from '@/components/analytics/customer-insights'

type Analytics = {
  overview: {
    total_revenue: number
    total_orders: number
    total_customers: number
    average_order_value: number
    conversion_rate: number
    currency_code: string
  }
  comparison: {
    revenue_change: number
    orders_change: number
    customers_change: number
    aov_change: number
  }
  sales_by_day: Array<{
    date: string
    revenue: number
    orders: number
  }>
  top_products: Array<{
    id: string
    title: string
    variant_title: string
    quantity_sold: number
    revenue: number
  }>
  order_status: {
    pending: number
    processing: number
    completed: number
    canceled: number
  }
  customer_insights: {
    new_customers: number
    returning_customers: number
    top_locations: Array<{
      city: string
      state: string
      orders: number
    }>
    customer_lifetime_value: number
  }
}

const PERIODS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
]

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/vendors/${vendorId}/analytics?period=${period}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    )
  }

  const renderMetricCard = (
    title: string,
    value: string | number,
    change: number,
    icon: React.ComponentType<{ className?: string }>,
    format?: 'currency' | 'number' | 'percent'
  ) => {
    const Icon = icon
    const isPositive = change >= 0
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
    const ChangeIcon = isPositive ? ArrowUpIcon : ArrowDownIcon

    let displayValue = value
    if (format === 'currency' && typeof value === 'number') {
      displayValue = formatCurrency(value, analytics.overview.currency_code)
    } else if (format === 'percent' && typeof value === 'number') {
      displayValue = `${value.toFixed(1)}%`
    }

    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {title}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {displayValue}
                  </div>
                  {change !== undefined && (
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${changeColor}`}>
                      <ChangeIcon className="self-center flex-shrink-0 h-4 w-4" />
                      <span className="ml-1">{Math.abs(change).toFixed(1)}%</span>
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track your store performance and insights
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {renderMetricCard(
          'Total Revenue',
          analytics.overview.total_revenue,
          analytics.comparison.revenue_change,
          CurrencyDollarIcon,
          'currency'
        )}
        {renderMetricCard(
          'Total Orders',
          analytics.overview.total_orders,
          analytics.comparison.orders_change,
          ShoppingBagIcon,
          'number'
        )}
        {renderMetricCard(
          'Total Customers',
          analytics.overview.total_customers,
          analytics.comparison.customers_change,
          UserGroupIcon,
          'number'
        )}
        {renderMetricCard(
          'Average Order Value',
          analytics.overview.average_order_value,
          analytics.comparison.aov_change,
          ChartBarIcon,
          'currency'
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Over Time</h3>
            <SalesChart data={analytics.sales_by_day} />
          </div>
        </div>

        {/* Order Status */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
            <OrderStatusChart data={analytics.order_status} />
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* Top Products */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
          <TopProductsTable 
            products={analytics.top_products} 
            currencyCode={analytics.overview.currency_code}
          />
        </div>

        {/* Customer Insights */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Insights</h3>
          <CustomerInsights 
            data={analytics.customer_insights}
            currencyCode={analytics.overview.currency_code}
          />
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Conversion Rate</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {analytics.overview.conversion_rate.toFixed(2)}%
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Customer Lifetime Value</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {formatCurrency(analytics.customer_insights.customer_lifetime_value, analytics.overview.currency_code)}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Repeat Customer Rate</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {((analytics.customer_insights.returning_customers / analytics.overview.total_customers) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}