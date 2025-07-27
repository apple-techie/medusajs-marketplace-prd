'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  TruckIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline'

interface InventoryItem {
  id: string
  variant_id: string
  product_id: string
  product_title: string
  variant_title: string
  sku: string
  quantity: number
  reserved_quantity: number
  available_quantity: number
  location: string
  last_updated: string
  low_stock_threshold: number
  optimal_stock_level: number
  reorder_point: number
  reorder_quantity: number
  in_transit: number
  pending_transfers: number
}

interface InventoryStats {
  total_items: number
  low_stock_items: number
  out_of_stock_items: number
  total_value: number
  items_to_reorder: number
  in_transit_value: number
  locations_count: number
}

export default function DistributorInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterLocation, setFilterLocation] = useState('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [transferData, setTransferData] = useState({
    variant_ids: [] as string[],
    from_location: '',
    to_location: '',
    quantities: {} as Record<string, number>,
    transfer_type: 'internal',
    notes: ''
  })

  useEffect(() => {
    fetchInventory()
    fetchInventoryStats()
  }, [])

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      const response = await fetch('http://localhost:9000/vendor/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Add mock in_transit and pending_transfers data for distributor view
        const enhancedInventory = (data.inventory || []).map((item: InventoryItem) => ({
          ...item,
          in_transit: Math.floor(Math.random() * 20),
          pending_transfers: Math.floor(Math.random() * 10)
        }))
        setInventory(enhancedInventory)
      } else {
        console.error('Failed to fetch inventory')
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInventoryStats = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      const response = await fetch('http://localhost:9000/vendor/inventory/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Add distributor-specific stats
        setStats({
          ...data.stats,
          in_transit_value: Math.floor(Math.random() * 50000) * 100,
          locations_count: 3
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleTransfer = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      const response = await fetch('http://localhost:9000/vendor/inventory/transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transferData)
      })

      if (response.ok) {
        await fetchInventory()
        await fetchInventoryStats()
        setShowTransferModal(false)
        setTransferData({
          variant_ids: [],
          from_location: '',
          to_location: '',
          quantities: {},
          transfer_type: 'internal',
          notes: ''
        })
        setSelectedItems([])
      }
    } catch (error) {
      console.error('Error creating transfer:', error)
    }
  }

  const handleBulkUpdate = async (updateType: string) => {
    if (updateType === 'transfer') {
      setTransferData({
        ...transferData,
        variant_ids: selectedItems
      })
      setShowTransferModal(true)
      return
    }

    try {
      const token = localStorage.getItem('vendor_token')
      const response = await fetch('http://localhost:9000/vendor/inventory/bulk-update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          variant_ids: selectedItems,
          update_type: updateType
        })
      })

      if (response.ok) {
        await fetchInventory()
        await fetchInventoryStats()
        setSelectedItems([])
        setShowBulkActions(false)
      }
    } catch (error) {
      console.error('Error bulk updating:', error)
    }
  }

  const exportInventory = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      const response = await fetch('http://localhost:9000/vendor/inventory/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `distributor-inventory-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting inventory:', error)
    }
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.variant_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'low_stock' && item.available_quantity <= item.low_stock_threshold) ||
      (filterStatus === 'out_of_stock' && item.available_quantity === 0) ||
      (filterStatus === 'needs_reorder' && item.available_quantity <= item.reorder_point) ||
      (filterStatus === 'in_transit' && item.in_transit > 0)
    
    const matchesLocation = filterLocation === 'all' || item.location === filterLocation
    
    return matchesSearch && matchesStatus && matchesLocation
  })

  const getStockStatus = (item: InventoryItem) => {
    if (item.available_quantity === 0) {
      return { label: 'Out of Stock', color: 'red' }
    } else if (item.available_quantity <= item.low_stock_threshold) {
      return { label: 'Low Stock', color: 'yellow' }
    } else {
      return { label: 'In Stock', color: 'green' }
    }
  }

  const uniqueLocations = [...new Set(inventory.map(item => item.location))]

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
        <h1 className="text-2xl font-bold text-gray-900">Distribution Inventory Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage inventory across multiple fulfillment hubs and distribution centers
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Items</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_items}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Locations</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.locations_count}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.low_stock_items}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="mt-2 text-3xl font-bold text-red-600">{stats.out_of_stock_items}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Value</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              ${(stats.total_value / 100).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  ${(stats.in_transit_value / 100).toLocaleString()}
                </p>
              </div>
              <TruckIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">To Reorder</p>
                <p className="mt-2 text-3xl font-bold text-purple-600">{stats.items_to_reorder}</p>
              </div>
              <ArrowPathIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by product, variant, or SKU..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Items</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="needs_reorder">Needs Reorder</option>
                <option value="in_transit">In Transit</option>
              </select>
              
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              {selectedItems.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                  >
                    Bulk Actions ({selectedItems.length})
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </button>
                  
                  {showBulkActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleBulkUpdate('transfer')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <ArrowsRightLeftIcon className="h-4 w-4 inline mr-2" />
                        Transfer Stock
                      </button>
                      <button
                        onClick={() => handleBulkUpdate('mark_low_stock')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mark as Low Stock
                      </button>
                      <button
                        onClick={() => handleBulkUpdate('generate_reorder')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Generate Reorder
                      </button>
                      <button
                        onClick={() => handleBulkUpdate('consolidate')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Consolidate Stock
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={exportInventory}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(filteredInventory.map(item => item.variant_id))
                        } else {
                          setSelectedItems([])
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">SKU</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Available</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Reserved</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">In Transit</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item)
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.variant_id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, item.variant_id])
                            } else {
                              setSelectedItems(selectedItems.filter(id => id !== item.variant_id))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{item.product_title}</p>
                          <p className="text-sm text-gray-500">{item.variant_title}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{item.sku}</td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${item.available_quantity === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.available_quantity}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{item.reserved_quantity}</td>
                      <td className="py-4 px-4">
                        {item.in_transit > 0 ? (
                          <span className="text-blue-600 font-medium flex items-center">
                            <TruckIcon className="h-4 w-4 mr-1" />
                            {item.in_transit}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-900 font-medium">{item.quantity}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{item.location}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setTransferData({
                              variant_ids: [item.variant_id],
                              from_location: item.location,
                              to_location: '',
                              quantities: { [item.variant_id]: 0 },
                              transfer_type: 'internal',
                              notes: ''
                            })
                            setShowTransferModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Transfer
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Inventory</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Location
                  </label>
                  <select
                    value={transferData.from_location}
                    onChange={(e) => setTransferData({ ...transferData, from_location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select location</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Location
                  </label>
                  <select
                    value={transferData.to_location}
                    onChange={(e) => setTransferData({ ...transferData, to_location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select location</option>
                    {uniqueLocations.filter(loc => loc !== transferData.from_location).map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transfer Type
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setTransferData({ ...transferData, transfer_type: 'internal' })}
                    className={`flex-1 py-2 px-4 rounded-md border ${
                      transferData.transfer_type === 'internal'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    Internal Transfer
                  </button>
                  <button
                    onClick={() => setTransferData({ ...transferData, transfer_type: 'vendor_replenishment' })}
                    className={`flex-1 py-2 px-4 rounded-md border ${
                      transferData.transfer_type === 'vendor_replenishment'
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    Vendor Replenishment
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Items to Transfer
                </label>
                <div className="border border-gray-300 rounded-md p-4 max-h-48 overflow-y-auto">
                  {transferData.variant_ids.map(variantId => {
                    const item = inventory.find(i => i.variant_id === variantId)
                    if (!item) return null
                    
                    return (
                      <div key={variantId} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">{item.product_title}</p>
                          <p className="text-sm text-gray-500">{item.variant_title} - {item.sku}</p>
                        </div>
                        <input
                          type="number"
                          min="1"
                          max={item.available_quantity}
                          value={transferData.quantities[variantId] || 0}
                          onChange={(e) => setTransferData({
                            ...transferData,
                            quantities: {
                              ...transferData.quantities,
                              [variantId]: parseInt(e.target.value) || 0
                            }
                          })}
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Qty"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={transferData.notes}
                  onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add any notes about this transfer..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={!transferData.from_location || !transferData.to_location || 
                         Object.values(transferData.quantities).every(q => q === 0)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}