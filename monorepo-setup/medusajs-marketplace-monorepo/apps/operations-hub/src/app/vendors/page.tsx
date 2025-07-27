'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { formatCurrency, formatPercentage } from '@marketplace/ui/utils'
import { 
  BuildingStorefrontIcon,
  CubeIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  EyeIcon,
  BanknotesIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface Vendor {
  id: string
  name: string
  email: string
  type: 'shop_partner' | 'brand_partner' | 'distributor_partner'
  is_active: boolean
  stripe_account_id: string | null
  stripe_account_enabled: boolean
  created_at: string
  updated_at: string
  business_info: {
    company_name: string
    phone: string
    address: string
    city: string
    state: string
    zip: string
    ein?: string
    license_number?: string
    license_expiry?: string
  }
  commission_tier?: string
  total_sales?: number
  total_commission?: number
  pending_payouts?: number
  compliance_status?: 'verified' | 'pending' | 'rejected'
  product_count?: number
  order_count?: number
  customer_count?: number
  rating?: number
  last_activity?: string
}

export default function VendorsPage() {
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCompliance, setFilterCompliance] = useState<string>('all')
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'sales' | 'created' | 'activity'>('created')

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockVendors: Vendor[] = [
        {
          id: 'v1',
          name: 'Green Valley Dispensary',
          email: 'contact@greenvalley.com',
          type: 'shop_partner',
          is_active: true,
          stripe_account_id: 'acct_1234567890',
          stripe_account_enabled: true,
          created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          business_info: {
            company_name: 'Green Valley LLC',
            phone: '(555) 123-4567',
            address: '123 Main St',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90001',
            license_number: 'C10-0000123-LIC',
            license_expiry: '2025-12-31'
          },
          commission_tier: 'tier_3',
          total_sales: 32000000, // $320K
          total_commission: 5760000, // $57.6K
          pending_payouts: 450000, // $4.5K
          compliance_status: 'verified',
          product_count: 145,
          order_count: 1250,
          customer_count: 892,
          rating: 4.8,
          last_activity: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: 'v2',
          name: 'Premium Brands Co',
          email: 'sales@premiumbrands.com',
          type: 'brand_partner',
          is_active: true,
          stripe_account_id: 'acct_2345678901',
          stripe_account_enabled: true,
          created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          business_info: {
            company_name: 'Premium Brands Co',
            phone: '(555) 234-5678',
            address: '456 Industrial Blvd',
            city: 'Oakland',
            state: 'CA',
            zip: '94601',
            ein: '12-3456789'
          },
          total_sales: 28500000, // $285K
          total_commission: 4275000, // $42.75K
          pending_payouts: 325000, // $3.25K
          compliance_status: 'verified',
          product_count: 78,
          order_count: 980,
          customer_count: 0, // Brands don't have direct customers
          rating: 4.9,
          last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'v3',
          name: 'West Coast Distribution',
          email: 'ops@westcoastdist.com',
          type: 'distributor_partner',
          is_active: true,
          stripe_account_id: 'acct_3456789012',
          stripe_account_enabled: true,
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          business_info: {
            company_name: 'West Coast Distribution Inc',
            phone: '(555) 345-6789',
            address: '789 Distribution Dr',
            city: 'Sacramento',
            state: 'CA',
            zip: '95814',
            ein: '23-4567890'
          },
          total_sales: 52000000, // $520K
          total_commission: 2600000, // $26K
          pending_payouts: 850000, // $8.5K
          compliance_status: 'verified',
          product_count: 0, // Distributors don't have products
          order_count: 2100,
          customer_count: 125, // B2B customers
          rating: 4.6,
          last_activity: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        },
        {
          id: 'v4',
          name: 'Herbal Wellness Shop',
          email: 'info@herbalwellness.com',
          type: 'shop_partner',
          is_active: true,
          stripe_account_id: 'acct_4567890123',
          stripe_account_enabled: false,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          business_info: {
            company_name: 'Herbal Wellness LLC',
            phone: '(555) 456-7890',
            address: '321 Wellness Way',
            city: 'Santa Monica',
            state: 'CA',
            zip: '90401',
            license_number: 'C10-0000456-LIC',
            license_expiry: '2025-06-30'
          },
          commission_tier: 'tier_1',
          total_sales: 12500000, // $125K
          total_commission: 1875000, // $18.75K
          pending_payouts: 0,
          compliance_status: 'pending',
          product_count: 89,
          order_count: 456,
          customer_count: 234,
          rating: 4.5,
          last_activity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'v5',
          name: 'Elevated Brands',
          email: 'contact@elevatedbrands.com',
          type: 'brand_partner',
          is_active: false,
          stripe_account_id: null,
          stripe_account_enabled: false,
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          business_info: {
            company_name: 'Elevated Brands LLC',
            phone: '(555) 567-8901',
            address: '654 High St',
            city: 'Pasadena',
            state: 'CA',
            zip: '91101',
            ein: '34-5678901'
          },
          total_sales: 0,
          total_commission: 0,
          pending_payouts: 0,
          compliance_status: 'rejected',
          product_count: 23,
          order_count: 0,
          customer_count: 0,
          rating: 0,
          last_activity: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      setVendors(mockVendors)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vendors...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }
  
  // Helper functions
  const getVendorTypeIcon = (type: string) => {
    switch (type) {
      case 'shop_partner':
        return <BuildingStorefrontIcon className="h-5 w-5 text-blue-600" />
      case 'brand_partner':
        return <CubeIcon className="h-5 w-5 text-purple-600" />
      case 'distributor_partner':
        return <TruckIcon className="h-5 w-5 text-green-600" />
      default:
        return null
    }
  }

  const getVendorTypeStyle = (type: string) => {
    switch (type) {
      case 'shop_partner': return 'bg-blue-100 text-blue-800'
      case 'brand_partner': return 'bg-purple-100 text-purple-800'
      case 'distributor_partner': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVendorTypeDisplay = (type: string) => {
    switch (type) {
      case 'shop_partner': return 'Shop Partner'
      case 'brand_partner': return 'Brand Partner'
      case 'distributor_partner': return 'Distributor'
      default: return 'Unknown'
    }
  }

  const getStatusStyle = (status: boolean) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getComplianceStyle = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCommissionDisplay = (vendor: Vendor) => {
    if (vendor.type === 'shop_partner') {
      switch (vendor.commission_tier) {
        case 'tier_1': return '15%'
        case 'tier_2': return '20%'
        case 'tier_3': return '25%'
        default: return '15-25%'
      }
    }
    if (vendor.type === 'brand_partner') {
      return '10-20%'
    }
    if (vendor.type === 'distributor_partner') {
      return '5%'
    }
    return 'N/A'
  }

  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 30) return `${days}d ago`
    return date.toLocaleDateString()
  }

  // Filter and sort vendors
  const filteredVendors = vendors
    .filter(vendor => {
      if (searchTerm && !vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !vendor.business_info.company_name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterType !== 'all' && vendor.type !== filterType) {
        return false
      }
      if (filterStatus !== 'all') {
        if (filterStatus === 'active' && !vendor.is_active) return false
        if (filterStatus === 'inactive' && vendor.is_active) return false
        if (filterStatus === 'stripe_connected' && !vendor.stripe_account_enabled) return false
        if (filterStatus === 'stripe_pending' && vendor.stripe_account_enabled) return false
      }
      if (filterCompliance !== 'all' && vendor.compliance_status !== filterCompliance) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'sales':
          return (b.total_sales || 0) - (a.total_sales || 0)
        case 'activity':
          return new Date(b.last_activity || b.updated_at).getTime() - 
                 new Date(a.last_activity || a.updated_at).getTime()
        case 'created':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  // Count vendors by type
  const vendorCounts = {
    shop: vendors.filter(v => v.type === 'shop_partner').length,
    brand: vendors.filter(v => v.type === 'brand_partner').length,
    distributor: vendors.filter(v => v.type === 'distributor_partner').length,
    active: vendors.filter(v => v.is_active).length,
    inactive: vendors.filter(v => !v.is_active).length,
    verified: vendors.filter(v => v.compliance_status === 'verified').length
  }

  const handleSelectAll = () => {
    if (selectedVendors.length === filteredVendors.length) {
      setSelectedVendors([])
    } else {
      setSelectedVendors(filteredVendors.map(v => v.id))
    }
  }

  const handleSelectVendor = (vendorId: string) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId))
    } else {
      setSelectedVendors([...selectedVendors, vendorId])
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedVendors.length === 0) return
    
    // In a real app, these would be API calls
    switch (action) {
      case 'activate':
        alert(`Activating ${selectedVendors.length} vendors`)
        break
      case 'deactivate':
        alert(`Deactivating ${selectedVendors.length} vendors`)
        break
      case 'export':
        handleExport(selectedVendors)
        break
    }
    setSelectedVendors([])
  }
  
  const handleExport = (vendorIds?: string[]) => {
    const vendorsToExport = vendorIds 
      ? vendors.filter(v => vendorIds.includes(v.id))
      : filteredVendors
    
    const headers = ['Name', 'Email', 'Company', 'Type', 'Status', 'Compliance', 'Total Sales', 'Commission', 'Stripe Status', 'Joined Date']
    const rows = vendorsToExport.map(vendor => [
      vendor.name,
      vendor.email,
      vendor.business_info.company_name,
      getVendorTypeDisplay(vendor.type),
      vendor.is_active ? 'Active' : 'Inactive',
      vendor.compliance_status || 'N/A',
      formatCurrency(vendor.total_sales || 0),
      formatCurrency(vendor.total_commission || 0),
      vendor.stripe_account_enabled ? 'Connected' : 'Pending',
      new Date(vendor.created_at).toLocaleDateString()
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `vendors-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Vendor Management</h2>
            <p className="text-gray-600 mt-1">
              Manage all marketplace vendors and partners
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => handleExport()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
            <button 
              onClick={() => router.push('/vendors/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Vendor Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <BuildingStorefrontIcon className="h-10 w-10 text-blue-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Shop Partners</dt>
                    <dd className="text-2xl font-bold text-gray-900">{vendorCounts.shop}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <CubeIcon className="h-10 w-10 text-purple-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Brand Partners</dt>
                    <dd className="text-2xl font-bold text-gray-900">{vendorCounts.brand}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <TruckIcon className="h-10 w-10 text-green-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Distributors</dt>
                    <dd className="text-2xl font-bold text-gray-900">{vendorCounts.distributor}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <CheckIcon className="h-10 w-10 text-emerald-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                    <dd className="text-2xl font-bold text-gray-900">{vendorCounts.active}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <XMarkIcon className="h-10 w-10 text-red-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Inactive</dt>
                    <dd className="text-2xl font-bold text-gray-900">{vendorCounts.inactive}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-10 w-10 text-green-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Verified</dt>
                    <dd className="text-2xl font-bold text-gray-900">{vendorCounts.verified}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search vendors..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="shop_partner">Shop Partners</option>
              <option value="brand_partner">Brand Partners</option>
              <option value="distributor_partner">Distributors</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="stripe_connected">Stripe Connected</option>
              <option value="stripe_pending">Stripe Pending</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filterCompliance}
                onChange={(e) => setFilterCompliance(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Compliance</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created">Sort by Created Date</option>
                <option value="name">Sort by Name</option>
                <option value="sales">Sort by Sales</option>
                <option value="activity">Sort by Last Activity</option>
              </select>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedVendors.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedVendors.length} vendor(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Export Selected
              </button>
              <button
                onClick={() => setSelectedVendors([])}
                className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Vendors Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedVendors.length === filteredVendors.length && filteredVendors.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={() => handleSelectVendor(vendor.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getVendorTypeIcon(vendor.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.email}</div>
                        <div className="text-xs text-gray-400">{vendor.business_info.company_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getVendorTypeStyle(vendor.type)}`}>
                      {getVendorTypeDisplay(vendor.type)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {getCommissionDisplay(vendor)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <BanknotesIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-900">{formatCurrency(vendor.total_sales || 0)}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <ChartBarIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {vendor.order_count || 0} orders
                        </span>
                      </div>
                      {vendor.rating && vendor.rating > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          ⭐ {vendor.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(vendor.is_active)}`}>
                        {vendor.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getComplianceStyle(vendor.compliance_status || '')}`}>
                        {vendor.compliance_status || 'Unverified'}
                      </span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vendor.stripe_account_enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vendor.stripe_account_enabled ? 'Stripe ✓' : 'Stripe Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatLastActivity(vendor.last_activity || vendor.updated_at)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Joined {new Date(vendor.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => router.push(`/vendors/${vendor.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => router.push(`/vendors/${vendor.id}/edit`)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                No vendors found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}