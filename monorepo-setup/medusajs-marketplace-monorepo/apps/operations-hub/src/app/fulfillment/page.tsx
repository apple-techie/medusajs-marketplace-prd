'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { fetchAdmin } from '@/lib/medusa-client'
import { formatPercentage } from '@marketplace/ui/utils'

export default function FulfillmentPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['fulfillment'],
    queryFn: () => fetchAdmin('/fulfillment')
  })
  
  const hubs = data?.hubs || []
  const metrics = data?.metrics || {
    totalOrdersToday: 0,
    avgFulfillmentTime: 0,
    networkCapacity: 0,
    deliverySuccessRate: 0
  }

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return 'text-red-600 bg-red-100'
    if (capacity >= 75) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading fulfillment data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Fulfillment Network</h2>
          <p className="text-gray-600 mt-1">
            Monitor and manage fulfillment hubs across the network
          </p>
        </div>

        {/* Hub Overview Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          {hubs.length > 0 ? hubs.map((hub: any) => (
            <div key={hub.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{hub.name}</h3>
                    <p className="text-sm text-gray-500">{hub.location}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hub.status)}`}>
                    {hub.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Capacity</span>
                      <span className={`font-semibold ${getCapacityColor(hub.capacity).split(' ')[0]}`}>
                        {hub.capacity}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          hub.capacity >= 90 ? 'bg-red-600' :
                          hub.capacity >= 75 ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${hub.capacity}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-gray-500">Active Orders</p>
                      <p className="text-lg font-semibold text-gray-900">{hub.activeOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="text-lg font-semibold text-gray-900">{hub.completedToday}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Staff</p>
                      <p className="text-lg font-semibold text-gray-900">{hub.staffCount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-3">
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    View Details
                  </button>
                  <button className="flex-1 px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Manage Hub
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 bg-white shadow rounded-lg p-6">
              <p className="text-gray-500 text-center">No fulfillment hubs configured yet.</p>
              <p className="text-sm text-gray-400 text-center mt-2">
                Add fulfillment locations in the marketplace settings.
              </p>
            </div>
          )}
        </div>

        {/* Fulfillment Metrics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Network Performance</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-gray-600">Total Orders Today</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalOrdersToday}</p>
              <p className="text-sm text-gray-500">
                {metrics.activeOrders} active, {metrics.completedToday} completed
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Fulfillment Time</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.avgFulfillmentTime}h</p>
              <p className="text-sm text-gray-500">
                {metrics.avgFulfillmentTime < 3 ? 'Within target' : 'Above target'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Network Capacity</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.networkCapacity}%</p>
              <p className={`text-sm ${
                metrics.networkCapacity >= 90 ? 'text-red-600' :
                metrics.networkCapacity >= 75 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {metrics.networkCapacity >= 90 ? 'Critical' :
                 metrics.networkCapacity >= 75 ? 'Near threshold' :
                 'Healthy'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivery Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.deliverySuccessRate}%</p>
              <p className={`text-sm ${
                metrics.deliverySuccessRate >= 95 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {metrics.deliverySuccessRate >= 95 ? 'Above target' : 'Below target'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-indigo-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-medium">Add Hub</p>
              <p className="text-sm text-gray-500">Configure new location</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-indigo-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <p className="font-medium">Transfer Orders</p>
              <p className="text-sm text-gray-500">Balance hub loads</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-indigo-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="font-medium">Export Report</p>
              <p className="text-sm text-gray-500">Download metrics</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-indigo-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-medium">Hub Settings</p>
              <p className="text-sm text-gray-500">Configure rules</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}