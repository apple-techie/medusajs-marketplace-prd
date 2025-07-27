'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  TruckIcon,
  CubeIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PrinterIcon,
  DocumentTextIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface FulfillmentOrder {
  id: string
  order_number: string
  customer: string
  destination: {
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  items: {
    id: string
    sku: string
    name: string
    quantity: number
    location: string
    picked: boolean
  }[]
  priority: 'standard' | 'express' | 'urgent'
  status: 'pending' | 'processing' | 'picked' | 'packed' | 'in_transit' | 'delivered'
  assigned_to: string | null
  created_at: string
  expected_delivery: string
  tracking_number: string | null
  notes: string | null
}

export default function DistributorFulfillmentPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<FulfillmentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<FulfillmentOrder | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('priority')

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('vendor_token')
      const vendorType = localStorage.getItem('vendor_type')
      
      if (!token || vendorType !== 'distributor_partner') {
        router.push('/vendor/login')
      }
    }
    
    checkAuth()
    fetchFulfillmentOrders()
  }, [router])

  const fetchFulfillmentOrders = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockOrders: FulfillmentOrder[] = [
        {
          id: 'fo_1',
          order_number: 'DO-2025-0142',
          customer: 'Green Valley Dispensary',
          destination: {
            name: 'Green Valley Dispensary',
            address: '123 Main Street',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90001'
          },
          items: [
            { id: 'item_1', sku: 'THC-IND-001', name: 'Indica Strain A', quantity: 12, location: 'A-12-3', picked: true },
            { id: 'item_2', sku: 'THC-SAT-002', name: 'Sativa Strain B', quantity: 8, location: 'B-14-2', picked: true },
            { id: 'item_3', sku: 'CBD-OIL-003', name: 'CBD Oil 1000mg', quantity: 4, location: 'C-08-1', picked: false }
          ],
          priority: 'urgent',
          status: 'processing',
          assigned_to: 'John Doe',
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          expected_delivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          tracking_number: null,
          notes: 'Customer needs by 3 PM'
        },
        {
          id: 'fo_2',
          order_number: 'DO-2025-0141',
          customer: 'Herbal Wellness Shop',
          destination: {
            name: 'Herbal Wellness Shop',
            address: '456 Oak Avenue',
            city: 'Santa Monica',
            state: 'CA',
            zip: '90401'
          },
          items: [
            { id: 'item_4', sku: 'THC-HYB-004', name: 'Hybrid Strain C', quantity: 20, location: 'D-10-4', picked: true },
            { id: 'item_5', sku: 'EDIBLE-005', name: 'Gummies 10mg', quantity: 15, location: 'E-05-2', picked: true }
          ],
          priority: 'express',
          status: 'packed',
          assigned_to: 'Jane Smith',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          expected_delivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          tracking_number: null,
          notes: null
        },
        {
          id: 'fo_3',
          order_number: 'DO-2025-0140',
          customer: "Nature's Medicine",
          destination: {
            name: "Nature's Medicine",
            address: '789 Pine Street',
            city: 'Long Beach',
            state: 'CA',
            zip: '90802'
          },
          items: [
            { id: 'item_6', sku: 'THC-IND-006', name: 'Indica Strain D', quantity: 30, location: 'A-15-2', picked: true },
            { id: 'item_7', sku: 'VAPE-007', name: 'Vape Cartridge 0.5g', quantity: 25, location: 'F-12-3', picked: true },
            { id: 'item_8', sku: 'PRE-ROLL-008', name: 'Pre-rolls Pack', quantity: 10, location: 'G-08-1', picked: true }
          ],
          priority: 'standard',
          status: 'in_transit',
          assigned_to: 'Mike Johnson',
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          expected_delivery: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          tracking_number: 'TRK-CA-2025-0140',
          notes: null
        },
        {
          id: 'fo_4',
          order_number: 'DO-2025-0139',
          customer: 'Elevated Health Store',
          destination: {
            name: 'Elevated Health Store',
            address: '321 Elm Street',
            city: 'Pasadena',
            state: 'CA',
            zip: '91101'
          },
          items: [
            { id: 'item_9', sku: 'CBD-CAP-009', name: 'CBD Capsules 25mg', quantity: 5, location: 'C-10-2', picked: false },
            { id: 'item_10', sku: 'THC-SAT-010', name: 'Sativa Strain E', quantity: 8, location: 'B-16-3', picked: false }
          ],
          priority: 'express',
          status: 'pending',
          assigned_to: null,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          expected_delivery: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          tracking_number: null,
          notes: 'Please verify inventory before picking'
        }
      ]

      setOrders(mockOrders)
    } catch (error) {
      console.error('Error fetching fulfillment orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'in_transit':
        return 'text-blue-600 bg-blue-100'
      case 'packed':
        return 'text-indigo-600 bg-indigo-100'
      case 'picked':
        return 'text-purple-600 bg-purple-100'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100'
      case 'pending':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100'
      case 'express':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getProgressPercentage = (order: FulfillmentOrder) => {
    const statusSteps = ['pending', 'processing', 'picked', 'packed', 'in_transit', 'delivered']
    const currentIndex = statusSteps.indexOf(order.status)
    return ((currentIndex + 1) / statusSteps.length) * 100
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // In a real app, this would call an API endpoint
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ))
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any })
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const printShippingLabel = (order: FulfillmentOrder) => {
    // In a real app, this would generate and print a shipping label
    alert(`Printing shipping label for order ${order.order_number}`)
  }

  const printPickList = (order: FulfillmentOrder) => {
    // In a real app, this would generate and print a pick list
    alert(`Printing pick list for order ${order.order_number}`)
  }

  const filteredOrders = orders
    .filter(order => {
      if (searchTerm && !order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !order.customer.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterStatus !== 'all' && order.status !== filterStatus) {
        return false
      }
      if (filterPriority !== 'all' && order.priority !== filterPriority) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 0, express: 1, standard: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'status':
          return a.status.localeCompare(b.status)
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Fulfillment Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and track distribution orders through the fulfillment process
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="picked">Picked</option>
            <option value="packed">Packed</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="express">Express</option>
            <option value="standard">Standard</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="priority">Sort by Priority</option>
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer & Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">#{order.order_number}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.destination.city}, {order.destination.state}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{order.items.length} items</p>
                    <p className="text-sm text-gray-500">
                      {order.items.filter(item => item.picked).length}/{order.items.length} picked
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getProgressPercentage(order)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(getProgressPercentage(order))}% complete
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowOrderDetails(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => printPickList(order)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <PrinterIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Order #{selectedOrder.order_number}
                </h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedOrder.priority)}`}>
                    {selectedOrder.priority}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Expected Delivery</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedOrder.expected_delivery).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Destination */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Destination</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedOrder.destination.name}</p>
                  <p>{selectedOrder.destination.address}</p>
                  <p>{selectedOrder.destination.city}, {selectedOrder.destination.state} {selectedOrder.destination.zip}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.sku}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.location}</td>
                          <td className="px-4 py-2">
                            {item.picked ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            ) : (
                              <ClockIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Notes</h4>
                      <p className="text-sm text-yellow-700 mt-1">{selectedOrder.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="space-x-3">
                  <button
                    onClick={() => printPickList(selectedOrder)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Print Pick List
                  </button>
                  {selectedOrder.status === 'packed' && (
                    <button
                      onClick={() => printShippingLabel(selectedOrder)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <PrinterIcon className="h-4 w-4 mr-2" />
                      Print Label
                    </button>
                  )}
                </div>
                
                <div className="space-x-3">
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      Start Processing
                      <ChevronRightIcon className="h-4 w-4 ml-2" />
                    </button>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'picked')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      Mark as Picked
                      <ChevronRightIcon className="h-4 w-4 ml-2" />
                    </button>
                  )}
                  {selectedOrder.status === 'picked' && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'packed')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      Mark as Packed
                      <ChevronRightIcon className="h-4 w-4 ml-2" />
                    </button>
                  )}
                  {selectedOrder.status === 'packed' && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'in_transit')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      Ship Order
                      <PaperAirplaneIcon className="h-4 w-4 ml-2" />
                    </button>
                  )}
                  {selectedOrder.status === 'in_transit' && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                    >
                      Mark as Delivered
                      <CheckCircleIcon className="h-4 w-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}