'use client'

import { formatCurrency, formatPercentage } from '@marketplace/ui/utils'
import { useVendor, useVendorAnalytics } from '@/lib/hooks/use-vendor'

export default function BrandDashboard() {
  const { data: vendorResponse, isLoading: vendorLoading } = useVendor()
  const vendor = vendorResponse?.vendor
  const { data: analyticsResponse, isLoading: analyticsLoading } = useVendorAnalytics(vendor?.id)
  const analytics = analyticsResponse?.analytics

  // Loading state
  if (vendorLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Monthly Revenue',
      value: formatCurrency(analytics?.revenue?.total || 0),
      description: `${formatPercentage(vendor?.commission_rate || 15)} platform fee`,
      icon: '💰',
    },
    {
      name: 'Active Products',
      value: `${analytics?.products?.active || 0}/${analytics?.products?.total || 0}`,
      description: 'Products listed',
      icon: '📦',
    },
    {
      name: 'Total Orders',
      value: analytics?.orders?.total || 0,
      description: `${analytics?.orders?.pending || 0} pending`,
      icon: '📋',
    },
    {
      name: 'Avg Order Value',
      value: formatCurrency(analytics?.performance?.average_order_value || 0),
      description: 'Per order',
      icon: '📊',
    },
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: 156.00, status: 'pending', time: '10 min ago' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 89.99, status: 'processing', time: '25 min ago' },
    { id: 'ORD-003', customer: 'Bob Wilson', amount: 234.50, status: 'pending', time: '1 hour ago' },
    { id: 'ORD-004', customer: 'Alice Brown', amount: 67.00, status: 'completed', time: '2 hours ago' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {vendor?.name || 'Partner'}!</h2>
        <p className="text-gray-600 mt-1">
          Brand Partner • {formatPercentage(vendor?.commission_rate || 15)} platform fee
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="text-3xl mr-3">{item.icon}</div>
                <div className="flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {item.value}
                    </dd>
                    <dd className="text-sm text-gray-500">
                      {item.description}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
            Add New Product
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Manage Inventory
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            View Orders
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Analytics Report
          </button>
        </div>
      </div>
    </div>
  )
}