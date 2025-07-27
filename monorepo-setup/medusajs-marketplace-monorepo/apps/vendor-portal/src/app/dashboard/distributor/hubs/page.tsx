'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  CubeIcon,
  UsersIcon,
  TruckIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PauseCircleIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  CogIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

interface Hub {
  id: string
  name: string
  type: 'warehouse' | 'distribution_center' | 'fulfillment_hub'
  status: 'operational' | 'limited' | 'maintenance' | 'offline'
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  contact: {
    manager: string
    phone: string
    email: string
  }
  capacity: {
    total_sqft: number
    used_sqft: number
    storage_units: number
    used_units: number
  }
  inventory: {
    total_value: number
    total_items: number
    low_stock_items: number
    categories: {
      name: string
      count: number
      value: number
    }[]
  }
  staff: {
    total: number
    active: number
    shifts: {
      morning: number
      afternoon: number
      night: number
    }
  }
  performance: {
    fulfillment_rate: number
    avg_processing_time: number
    daily_throughput: number
    accuracy_rate: number
  }
  operating_hours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
}

interface HubStats {
  total_hubs: number
  operational_hubs: number
  total_capacity: number
  capacity_utilization: number
  total_staff: number
  total_inventory_value: number
  avg_fulfillment_rate: number
  total_daily_throughput: number
}

export default function DistributorHubsPage() {
  const router = useRouter()
  const [hubs, setHubs] = useState<Hub[]>([])
  const [stats, setStats] = useState<HubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null)
  const [showHubDetails, setShowHubDetails] = useState(false)
  const [showNewHub, setShowNewHub] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('vendor_token')
      const vendorType = localStorage.getItem('vendor_type')
      
      if (!token || vendorType !== 'distributor_partner') {
        router.push('/vendor/login')
      }
    }
    
    checkAuth()
    fetchHubs()
    fetchStats()
  }, [router])

  const fetchHubs = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockHubs: Hub[] = [
        {
          id: 'hub_1',
          name: 'Main Distribution Center',
          type: 'distribution_center',
          status: 'operational',
          address: {
            street: '1234 Industrial Blvd',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90001'
          },
          contact: {
            manager: 'John Smith',
            phone: '(555) 123-4567',
            email: 'john.smith@hub.com'
          },
          capacity: {
            total_sqft: 50000,
            used_sqft: 42500,
            storage_units: 1000,
            used_units: 850
          },
          inventory: {
            total_value: 2500000,
            total_items: 15000,
            low_stock_items: 23,
            categories: [
              { name: 'Flower', count: 5000, value: 1000000 },
              { name: 'Edibles', count: 4000, value: 600000 },
              { name: 'Concentrates', count: 3000, value: 500000 },
              { name: 'Accessories', count: 3000, value: 400000 }
            ]
          },
          staff: {
            total: 45,
            active: 42,
            shifts: {
              morning: 15,
              afternoon: 18,
              night: 9
            }
          },
          performance: {
            fulfillment_rate: 98.5,
            avg_processing_time: 2.3,
            daily_throughput: 450,
            accuracy_rate: 99.2
          },
          operating_hours: {
            monday: '6:00 AM - 10:00 PM',
            tuesday: '6:00 AM - 10:00 PM',
            wednesday: '6:00 AM - 10:00 PM',
            thursday: '6:00 AM - 10:00 PM',
            friday: '6:00 AM - 10:00 PM',
            saturday: '8:00 AM - 6:00 PM',
            sunday: '8:00 AM - 6:00 PM'
          }
        },
        {
          id: 'hub_2',
          name: 'Bay Area Warehouse',
          type: 'warehouse',
          status: 'limited',
          address: {
            street: '5678 Commerce Way',
            city: 'Oakland',
            state: 'CA',
            zip: '94601'
          },
          contact: {
            manager: 'Sarah Johnson',
            phone: '(555) 234-5678',
            email: 'sarah.johnson@hub.com'
          },
          capacity: {
            total_sqft: 35000,
            used_sqft: 15750,
            storage_units: 700,
            used_units: 315
          },
          inventory: {
            total_value: 1800000,
            total_items: 9000,
            low_stock_items: 45,
            categories: [
              { name: 'Flower', count: 3000, value: 700000 },
              { name: 'Edibles', count: 2500, value: 400000 },
              { name: 'Concentrates', count: 2000, value: 400000 },
              { name: 'Accessories', count: 1500, value: 300000 }
            ]
          },
          staff: {
            total: 30,
            active: 25,
            shifts: {
              morning: 10,
              afternoon: 12,
              night: 3
            }
          },
          performance: {
            fulfillment_rate: 92.3,
            avg_processing_time: 3.1,
            daily_throughput: 280,
            accuracy_rate: 97.8
          },
          operating_hours: {
            monday: '7:00 AM - 7:00 PM',
            tuesday: '7:00 AM - 7:00 PM',
            wednesday: '7:00 AM - 7:00 PM',
            thursday: '7:00 AM - 7:00 PM',
            friday: '7:00 AM - 7:00 PM',
            saturday: 'Closed',
            sunday: 'Closed'
          }
        },
        {
          id: 'hub_3',
          name: 'North Valley Hub',
          type: 'fulfillment_hub',
          status: 'operational',
          address: {
            street: '9012 Distribution Dr',
            city: 'Sacramento',
            state: 'CA',
            zip: '95814'
          },
          contact: {
            manager: 'Mike Chen',
            phone: '(555) 345-6789',
            email: 'mike.chen@hub.com'
          },
          capacity: {
            total_sqft: 25000,
            used_sqft: 18000,
            storage_units: 500,
            used_units: 360
          },
          inventory: {
            total_value: 1200000,
            total_items: 7500,
            low_stock_items: 12,
            categories: [
              { name: 'Flower', count: 2500, value: 500000 },
              { name: 'Edibles', count: 2000, value: 300000 },
              { name: 'Concentrates', count: 1500, value: 250000 },
              { name: 'Accessories', count: 1500, value: 150000 }
            ]
          },
          staff: {
            total: 25,
            active: 24,
            shifts: {
              morning: 8,
              afternoon: 10,
              night: 6
            }
          },
          performance: {
            fulfillment_rate: 96.7,
            avg_processing_time: 2.5,
            daily_throughput: 320,
            accuracy_rate: 98.5
          },
          operating_hours: {
            monday: '6:00 AM - 8:00 PM',
            tuesday: '6:00 AM - 8:00 PM',
            wednesday: '6:00 AM - 8:00 PM',
            thursday: '6:00 AM - 8:00 PM',
            friday: '6:00 AM - 8:00 PM',
            saturday: '8:00 AM - 4:00 PM',
            sunday: 'Closed'
          }
        },
        {
          id: 'hub_4',
          name: 'Desert Distribution',
          type: 'warehouse',
          status: 'maintenance',
          address: {
            street: '3456 Desert Commerce Pkwy',
            city: 'Palm Springs',
            state: 'CA',
            zip: '92262'
          },
          contact: {
            manager: 'Lisa Martinez',
            phone: '(555) 456-7890',
            email: 'lisa.martinez@hub.com'
          },
          capacity: {
            total_sqft: 15000,
            used_sqft: 2250,
            storage_units: 300,
            used_units: 45
          },
          inventory: {
            total_value: 300000,
            total_items: 2000,
            low_stock_items: 68,
            categories: [
              { name: 'Flower', count: 800, value: 120000 },
              { name: 'Edibles', count: 600, value: 80000 },
              { name: 'Concentrates', count: 400, value: 60000 },
              { name: 'Accessories', count: 200, value: 40000 }
            ]
          },
          staff: {
            total: 15,
            active: 8,
            shifts: {
              morning: 4,
              afternoon: 4,
              night: 0
            }
          },
          performance: {
            fulfillment_rate: 85.2,
            avg_processing_time: 4.2,
            daily_throughput: 120,
            accuracy_rate: 94.5
          },
          operating_hours: {
            monday: '8:00 AM - 5:00 PM',
            tuesday: '8:00 AM - 5:00 PM',
            wednesday: '8:00 AM - 5:00 PM',
            thursday: '8:00 AM - 5:00 PM',
            friday: '8:00 AM - 5:00 PM',
            saturday: 'Closed',
            sunday: 'Closed'
          }
        }
      ]

      setHubs(mockHubs)
    } catch (error) {
      console.error('Error fetching hubs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Mock stats for demonstration
      const mockStats: HubStats = {
        total_hubs: 4,
        operational_hubs: 2,
        total_capacity: 125000,
        capacity_utilization: 62.4,
        total_staff: 115,
        total_inventory_value: 5800000,
        avg_fulfillment_rate: 93.2,
        total_daily_throughput: 1170
      }

      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100'
      case 'limited':
        return 'text-yellow-600 bg-yellow-100'
      case 'maintenance':
        return 'text-orange-600 bg-orange-100'
      case 'offline':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon className="h-5 w-5" />
      case 'limited':
        return <ExclamationTriangleIcon className="h-5 w-5" />
      case 'maintenance':
        return <CogIcon className="h-5 w-5" />
      case 'offline':
        return <PauseCircleIcon className="h-5 w-5" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'distribution_center':
        return <BuildingStorefrontIcon className="h-5 w-5 text-blue-600" />
      case 'warehouse':
        return <CubeIcon className="h-5 w-5 text-gray-600" />
      case 'fulfillment_hub':
        return <TruckIcon className="h-5 w-5 text-purple-600" />
      default:
        return null
    }
  }

  const calculateCapacityPercentage = (hub: Hub) => {
    return Math.round((hub.capacity.used_sqft / hub.capacity.total_sqft) * 100)
  }

  const filteredHubs = hubs
    .filter(hub => {
      if (searchTerm && !hub.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !hub.address.city.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterStatus !== 'all' && hub.status !== filterStatus) {
        return false
      }
      if (filterType !== 'all' && hub.type !== filterType) {
        return false
      }
      return true
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load hub statistics</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hub Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your distribution centers, warehouses, and fulfillment hubs
          </p>
        </div>
        <button
          onClick={() => setShowNewHub(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Hub
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hubs</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_hubs}</p>
              <p className="mt-1 text-sm text-green-600">
                {stats.operational_hubs} operational
              </p>
            </div>
            <BuildingStorefrontIcon className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Capacity Used</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.capacity_utilization}%</p>
              <p className="mt-1 text-sm text-gray-500">
                {(stats.total_capacity / 1000).toFixed(0)}k sq ft total
              </p>
            </div>
            <CubeIcon className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_staff}</p>
              <p className="mt-1 text-sm text-gray-500">
                Across all locations
              </p>
            </div>
            <UsersIcon className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Throughput</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_daily_throughput}</p>
              <p className="mt-1 text-sm text-gray-500">
                Orders processed
              </p>
            </div>
            <ChartBarIcon className="h-10 w-10 text-indigo-600" />
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
              placeholder="Search by name or location..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="operational">Operational</option>
            <option value="limited">Limited</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="distribution_center">Distribution Center</option>
            <option value="warehouse">Warehouse</option>
            <option value="fulfillment_hub">Fulfillment Hub</option>
          </select>
        </div>
      </div>

      {/* Hubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHubs.map((hub) => (
          <div key={hub.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start">
                  {getTypeIcon(hub.type)}
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{hub.name}</h3>
                    <p className="text-sm text-gray-500">
                      {hub.address.city}, {hub.address.state}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hub.status)}`}>
                  {getStatusIcon(hub.status)}
                  <span className="ml-1">{hub.status}</span>
                </span>
              </div>

              {/* Capacity Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-medium text-gray-900">{calculateCapacityPercentage(hub)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${calculateCapacityPercentage(hub) > 85 ? 'bg-red-600' : calculateCapacityPercentage(hub) > 70 ? 'bg-yellow-600' : 'bg-green-600'}`}
                    style={{ width: `${calculateCapacityPercentage(hub)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {hub.capacity.used_sqft.toLocaleString()} / {hub.capacity.total_sqft.toLocaleString()} sq ft
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Inventory Value</p>
                  <p className="text-lg font-semibold text-gray-900">${(hub.inventory.total_value / 100).toLocaleString()}</p>
                  {hub.inventory.low_stock_items > 0 && (
                    <p className="text-xs text-red-600">{hub.inventory.low_stock_items} low stock alerts</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Daily Throughput</p>
                  <p className="text-lg font-semibold text-gray-900">{hub.performance.daily_throughput}</p>
                  <p className="text-xs text-gray-500">orders/day</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Fulfillment</p>
                  <p className="text-sm font-medium text-gray-900">{hub.performance.fulfillment_rate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Processing</p>
                  <p className="text-sm font-medium text-gray-900">{hub.performance.avg_processing_time}h</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Accuracy</p>
                  <p className="text-sm font-medium text-gray-900">{hub.performance.accuracy_rate}%</p>
                </div>
              </div>

              {/* Staff Info */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center">
                  <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-600">{hub.staff.active}/{hub.staff.total} active staff</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-600">
                    {hub.operating_hours.monday === 'Closed' ? 'Closed today' : 'Open today'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedHub(hub)
                    setShowHubDetails(true)
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </button>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-600 hover:text-gray-800">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <CogIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hub Details Modal */}
      {showHubDetails && selectedHub && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {getTypeIcon(selectedHub.type)}
                  <h2 className="text-xl font-bold text-gray-900 ml-3">{selectedHub.name}</h2>
                </div>
                <button
                  onClick={() => setShowHubDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Hub Status and Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedHub.status)}`}>
                    {getStatusIcon(selectedHub.status)}
                    <span className="ml-1">{selectedHub.status}</span>
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedHub.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Manager</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedHub.contact.manager}</p>
                </div>
              </div>

              {/* Address and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
                  <div className="text-sm text-gray-600">
                    <p>{selectedHub.address.street}</p>
                    <p>{selectedHub.address.city}, {selectedHub.address.state} {selectedHub.address.zip}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Contact</h3>
                  <div className="text-sm text-gray-600">
                    <p>{selectedHub.contact.phone}</p>
                    <p>{selectedHub.contact.email}</p>
                  </div>
                </div>
              </div>

              {/* Capacity Details */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Capacity Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Space</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedHub.capacity.total_sqft.toLocaleString()} sq ft</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Used Space</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedHub.capacity.used_sqft.toLocaleString()} sq ft</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Storage Units</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedHub.capacity.used_units}/{selectedHub.capacity.storage_units}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Utilization</p>
                    <p className="text-lg font-semibold text-gray-900">{calculateCapacityPercentage(selectedHub)}%</p>
                  </div>
                </div>
              </div>

              {/* Inventory Breakdown */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Inventory Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">% of Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedHub.inventory.categories.map((category) => (
                        <tr key={category.name}>
                          <td className="px-4 py-2 text-sm text-gray-900">{category.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{category.count.toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">${(category.value / 100).toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {Math.round((category.value / selectedHub.inventory.total_value) * 100)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Staff Schedule */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Staff Schedule</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600">Morning Shift</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedHub.staff.shifts.morning}</p>
                    <p className="text-xs text-blue-600">staff</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-orange-600">Afternoon Shift</p>
                    <p className="text-2xl font-bold text-orange-900">{selectedHub.staff.shifts.afternoon}</p>
                    <p className="text-xs text-orange-600">staff</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-purple-600">Night Shift</p>
                    <p className="text-2xl font-bold text-purple-900">{selectedHub.staff.shifts.night}</p>
                    <p className="text-xs text-purple-600">staff</p>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Operating Hours</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {Object.entries(selectedHub.operating_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{day}:</span>
                      <span className={`text-gray-900 ${hours === 'Closed' ? 'text-red-600' : ''}`}>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowHubDetails(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                  Edit Hub
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Hub Modal */}
      {showNewHub && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Hub</h2>
                <button
                  onClick={() => setShowNewHub(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Hub creation form would be implemented here
                </p>
                <button
                  onClick={() => setShowNewHub(false)}
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