'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowsRightLeftIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

interface Transfer {
  id: string
  transfer_number: string
  from_location: {
    id: string
    name: string
    city: string
    state: string
  }
  to_location: {
    id: string
    name: string
    city: string
    state: string
  }
  items: {
    id: string
    sku: string
    name: string
    quantity: number
    unit_value: number
  }[]
  status: 'draft' | 'preparing' | 'in_transit' | 'received' | 'cancelled'
  priority: 'standard' | 'urgent'
  initiated_by: string
  initiated_at: string
  expected_arrival: string
  actual_arrival: string | null
  tracking_number: string | null
  notes: string | null
  total_value: number
}

interface Location {
  id: string
  name: string
  city: string
  state: string
  inventory_capacity: number
  current_inventory: number
}

export default function DistributorTransfersPage() {
  const router = useRouter()
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null)
  const [showTransferDetails, setShowTransferDetails] = useState(false)
  const [showNewTransfer, setShowNewTransfer] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterLocation, setFilterLocation] = useState<string>('all')

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('vendor_token')
      const vendorType = localStorage.getItem('vendor_type')
      
      if (!token || vendorType !== 'distributor_partner') {
        router.push('/vendor/login')
      }
    }
    
    checkAuth()
    fetchTransfers()
    fetchLocations()
  }, [router])

  const fetchTransfers = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockTransfers: Transfer[] = [
        {
          id: 'transfer_1',
          transfer_number: 'TRF-2025-0089',
          from_location: {
            id: 'loc_1',
            name: 'Main Distribution Center',
            city: 'Los Angeles',
            state: 'CA'
          },
          to_location: {
            id: 'loc_2',
            name: 'Bay Area Warehouse',
            city: 'Oakland',
            state: 'CA'
          },
          items: [
            { id: 'item_1', sku: 'THC-IND-001', name: 'Indica Strain A', quantity: 50, unit_value: 1200 },
            { id: 'item_2', sku: 'THC-SAT-002', name: 'Sativa Strain B', quantity: 30, unit_value: 1500 },
            { id: 'item_3', sku: 'CBD-OIL-003', name: 'CBD Oil 1000mg', quantity: 20, unit_value: 4500 }
          ],
          status: 'in_transit',
          priority: 'urgent',
          initiated_by: 'John Manager',
          initiated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          expected_arrival: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          actual_arrival: null,
          tracking_number: 'TRK-INT-2025-0089',
          notes: 'Low stock at Bay Area location',
          total_value: 195000
        },
        {
          id: 'transfer_2',
          transfer_number: 'TRF-2025-0088',
          from_location: {
            id: 'loc_3',
            name: 'North Valley Hub',
            city: 'Sacramento',
            state: 'CA'
          },
          to_location: {
            id: 'loc_5',
            name: 'Desert Distribution',
            city: 'Palm Springs',
            state: 'CA'
          },
          items: [
            { id: 'item_4', sku: 'THC-HYB-004', name: 'Hybrid Strain C', quantity: 40, unit_value: 1300 },
            { id: 'item_5', sku: 'EDIBLE-005', name: 'Gummies 10mg', quantity: 100, unit_value: 800 }
          ],
          status: 'preparing',
          priority: 'standard',
          initiated_by: 'Jane Supervisor',
          initiated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          expected_arrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          actual_arrival: null,
          tracking_number: null,
          notes: null,
          total_value: 132000
        },
        {
          id: 'transfer_3',
          transfer_number: 'TRF-2025-0087',
          from_location: {
            id: 'loc_4',
            name: 'Central Coast Facility',
            city: 'San Luis Obispo',
            state: 'CA'
          },
          to_location: {
            id: 'loc_1',
            name: 'Main Distribution Center',
            city: 'Los Angeles',
            state: 'CA'
          },
          items: [
            { id: 'item_6', sku: 'THC-IND-006', name: 'Indica Strain D', quantity: 60, unit_value: 1100 },
            { id: 'item_7', sku: 'VAPE-007', name: 'Vape Cartridge 0.5g', quantity: 80, unit_value: 2500 },
            { id: 'item_8', sku: 'PRE-ROLL-008', name: 'Pre-rolls Pack', quantity: 40, unit_value: 900 }
          ],
          status: 'in_transit',
          priority: 'standard',
          initiated_by: 'Mike Coordinator',
          initiated_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          expected_arrival: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          actual_arrival: null,
          tracking_number: 'TRK-INT-2025-0087',
          notes: 'Regular inventory rebalancing',
          total_value: 302000
        },
        {
          id: 'transfer_4',
          transfer_number: 'TRF-2025-0086',
          from_location: {
            id: 'loc_2',
            name: 'Bay Area Warehouse',
            city: 'Oakland',
            state: 'CA'
          },
          to_location: {
            id: 'loc_3',
            name: 'North Valley Hub',
            city: 'Sacramento',
            state: 'CA'
          },
          items: [
            { id: 'item_9', sku: 'CBD-CAP-009', name: 'CBD Capsules 25mg', quantity: 50, unit_value: 3000 },
            { id: 'item_10', sku: 'THC-SAT-010', name: 'Sativa Strain E', quantity: 25, unit_value: 1400 }
          ],
          status: 'received',
          priority: 'standard',
          initiated_by: 'Sarah Manager',
          initiated_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          expected_arrival: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          actual_arrival: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
          tracking_number: 'TRK-INT-2025-0086',
          notes: null,
          total_value: 185000
        }
      ]

      setTransfers(mockTransfers)
    } catch (error) {
      console.error('Error fetching transfers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLocations = async () => {
    try {
      // Mock data for demonstration
      const mockLocations: Location[] = [
        {
          id: 'loc_1',
          name: 'Main Distribution Center',
          city: 'Los Angeles',
          state: 'CA',
          inventory_capacity: 10000,
          current_inventory: 8500
        },
        {
          id: 'loc_2',
          name: 'Bay Area Warehouse',
          city: 'Oakland',
          state: 'CA',
          inventory_capacity: 8000,
          current_inventory: 3600
        },
        {
          id: 'loc_3',
          name: 'North Valley Hub',
          city: 'Sacramento',
          state: 'CA',
          inventory_capacity: 6000,
          current_inventory: 4320
        },
        {
          id: 'loc_4',
          name: 'Central Coast Facility',
          city: 'San Luis Obispo',
          state: 'CA',
          inventory_capacity: 4000,
          current_inventory: 3600
        },
        {
          id: 'loc_5',
          name: 'Desert Distribution',
          city: 'Palm Springs',
          state: 'CA',
          inventory_capacity: 3000,
          current_inventory: 450
        }
      ]

      setLocations(mockLocations)
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'text-green-600 bg-green-100'
      case 'in_transit':
        return 'text-blue-600 bg-blue-100'
      case 'preparing':
        return 'text-yellow-600 bg-yellow-100'
      case 'draft':
        return 'text-gray-600 bg-gray-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'text-red-600' : 'text-gray-600'
  }

  const updateTransferStatus = async (transferId: string, newStatus: string) => {
    try {
      // In a real app, this would call an API endpoint
      setTransfers(transfers.map(transfer => 
        transfer.id === transferId ? { ...transfer, status: newStatus as any } : transfer
      ))
      
      if (selectedTransfer?.id === transferId) {
        setSelectedTransfer({ ...selectedTransfer, status: newStatus as any })
      }
    } catch (error) {
      console.error('Error updating transfer status:', error)
    }
  }

  const calculateTransferProgress = (transfer: Transfer) => {
    if (transfer.status === 'draft') return 0
    if (transfer.status === 'preparing') return 25
    if (transfer.status === 'in_transit') return 75
    if (transfer.status === 'received') return 100
    if (transfer.status === 'cancelled') return 0
    return 0
  }

  const filteredTransfers = transfers
    .filter(transfer => {
      if (searchTerm && !transfer.transfer_number.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterStatus !== 'all' && transfer.status !== filterStatus) {
        return false
      }
      if (filterLocation !== 'all' && 
          transfer.from_location.id !== filterLocation && 
          transfer.to_location.id !== filterLocation) {
        return false
      }
      return true
    })
    .sort((a, b) => new Date(b.initiated_at).getTime() - new Date(a.initiated_at).getTime())

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transfer Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage inventory transfers between distribution locations
          </p>
        </div>
        <button
          onClick={() => setShowNewTransfer(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Transfer
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Transfers</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {transfers.filter(t => t.status === 'in_transit' || t.status === 'preparing').length}
              </p>
            </div>
            <ArrowsRightLeftIcon className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {transfers.filter(t => t.status === 'in_transit').length}
              </p>
            </div>
            <TruckIcon className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ${transfers
                  .filter(t => t.status === 'in_transit' || t.status === 'preparing')
                  .reduce((sum, t) => sum + t.total_value, 0)
                  .toLocaleString()}
              </p>
            </div>
            <CubeIcon className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent Transfers</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {transfers.filter(t => t.priority === 'urgent' && t.status !== 'received').length}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transfer number..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="preparing">Preparing</option>
            <option value="in_transit">In Transit</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transfers List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transfer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items & Value
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
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">#{transfer.transfer_number}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transfer.initiated_at).toLocaleDateString()}
                      </p>
                      {transfer.priority === 'urgent' && (
                        <span className="text-xs font-medium text-red-600">URGENT</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-medium text-gray-900">{transfer.from_location.name}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <ArrowsRightLeftIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">{transfer.to_location.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">
                      {transfer.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ${transfer.total_value.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${calculateTransferProgress(transfer)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ETA: {new Date(transfer.expected_arrival).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                      {transfer.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedTransfer(transfer)
                        setShowTransferDetails(true)
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Details Modal */}
      {showTransferDetails && selectedTransfer && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Transfer #{selectedTransfer.transfer_number}
                </h2>
                <button
                  onClick={() => setShowTransferDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Transfer Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTransfer.status)}`}>
                    {selectedTransfer.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <p className={`mt-1 text-sm font-medium ${getPriorityColor(selectedTransfer.priority)}`}>
                    {selectedTransfer.priority.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Value</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    ${selectedTransfer.total_value.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Route Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Route Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">From</p>
                    <p className="text-sm font-medium text-gray-900">{selectedTransfer.from_location.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedTransfer.from_location.city}, {selectedTransfer.from_location.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">To</p>
                    <p className="text-sm font-medium text-gray-900">{selectedTransfer.to_location.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedTransfer.to_location.city}, {selectedTransfer.to_location.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-32">Initiated:</span>
                    <span className="text-gray-900">
                      {new Date(selectedTransfer.initiated_at).toLocaleString()} by {selectedTransfer.initiated_by}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-32">Expected Arrival:</span>
                    <span className="text-gray-900">
                      {new Date(selectedTransfer.expected_arrival).toLocaleString()}
                    </span>
                  </div>
                  {selectedTransfer.actual_arrival && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-32">Actual Arrival:</span>
                      <span className="text-gray-900">
                        {new Date(selectedTransfer.actual_arrival).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedTransfer.tracking_number && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-32">Tracking:</span>
                      <span className="text-gray-900 font-mono">{selectedTransfer.tracking_number}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Transfer Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Value</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedTransfer.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.sku}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">${item.unit_value / 100}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            ${(item.quantity * item.unit_value / 100).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              {selectedTransfer.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <DocumentTextIcon className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Notes</h4>
                      <p className="text-sm text-yellow-700 mt-1">{selectedTransfer.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                {selectedTransfer.status === 'draft' && (
                  <button
                    onClick={() => updateTransferStatus(selectedTransfer.id, 'preparing')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    Start Preparation
                  </button>
                )}
                {selectedTransfer.status === 'preparing' && (
                  <button
                    onClick={() => updateTransferStatus(selectedTransfer.id, 'in_transit')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    Mark as Shipped
                  </button>
                )}
                {selectedTransfer.status === 'in_transit' && (
                  <button
                    onClick={() => updateTransferStatus(selectedTransfer.id, 'received')}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                  >
                    Mark as Received
                  </button>
                )}
                {(selectedTransfer.status === 'draft' || selectedTransfer.status === 'preparing') && (
                  <button
                    onClick={() => updateTransferStatus(selectedTransfer.id, 'cancelled')}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                  >
                    Cancel Transfer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Transfer Modal */}
      {showNewTransfer && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Transfer</h2>
                <button
                  onClick={() => setShowNewTransfer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Transfer creation form would be implemented here
                </p>
                <button
                  onClick={() => setShowNewTransfer(false)}
                  className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}