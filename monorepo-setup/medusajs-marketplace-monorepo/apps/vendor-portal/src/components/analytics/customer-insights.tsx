'use client'

import { UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { formatCurrency } from '@/lib/utils'

type CustomerInsightsProps = {
  data: {
    new_customers: number
    returning_customers: number
    top_locations: Array<{
      city: string
      state: string
      orders: number
    }>
    customer_lifetime_value: number
  }
  currencyCode: string
}

export default function CustomerInsights({ data, currencyCode }: CustomerInsightsProps) {
  const totalCustomers = data.new_customers + data.returning_customers
  const returningRate = totalCustomers > 0 
    ? ((data.returning_customers / totalCustomers) * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      {/* Customer Breakdown */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Breakdown</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">New Customers</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{data.new_customers}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Returning Customers</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{data.returning_customers}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>New ({100 - parseFloat(returningRate)}%)</span>
            <span>Returning ({returningRate}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${returningRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Locations */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Top Locations</h4>
        <div className="space-y-2">
          {data.top_locations.length > 0 ? (
            data.top_locations.slice(0, 5).map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {location.city}, {location.state}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {location.orders} orders
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No location data available</p>
          )}
        </div>
      </div>

      {/* Customer Lifetime Value */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Avg. Customer Lifetime Value</span>
          <span className="text-lg font-semibold text-gray-900">
            {formatCurrency(data.customer_lifetime_value, currencyCode)}
          </span>
        </div>
      </div>
    </div>
  )
}