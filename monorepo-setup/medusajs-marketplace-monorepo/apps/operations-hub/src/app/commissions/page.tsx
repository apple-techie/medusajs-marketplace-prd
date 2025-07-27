'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { formatCurrency, formatPercentage } from '@marketplace/ui/utils'
import { 
  CurrencyDollarIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  ClockIcon,
  XMarkIcon,
  CalendarIcon,
  ChartBarIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  DocumentCheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
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

interface Commission {
  id: string
  vendor: {
    id: string
    name: string
    type: 'shop_partner' | 'brand_partner' | 'distributor_partner'
  }
  order: {
    id: string
    number: string
    date: string
    customer: string
    total: number
  }
  product_sales: number
  commission_rate: number
  commission_amount: number
  status: 'pending' | 'approved' | 'paid' | 'disputed'
  payment_date: string | null
  payment_method: string | null
  payment_reference: string | null
  created_at: string
  updated_at: string
}

interface CommissionStats {
  total_pending: number
  total_approved: number
  total_paid: number
  total_disputed: number
  pending_count: number
  approved_count: number
  paid_count: number
  disputed_count: number
  average_commission_rate: number
  total_sales_volume: number
}

interface VendorCommissionSummary {
  vendor_id: string
  vendor_name: string
  vendor_type: string
  total_sales: number
  total_commission: number
  pending_commission: number
  paid_commission: number
  average_rate: number
  order_count: number
  commission_tier: string
}

export default function CommissionsPage() {
  const router = useRouter()
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [stats, setStats] = useState<CommissionStats | null>(null)
  const [vendorSummaries, setVendorSummaries] = useState<VendorCommissionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterVendorType, setFilterVendorType] = useState<string>('all')
  const [filterDateRange, setFilterDateRange] = useState<string>('all')
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [expandedVendors, setExpandedVendors] = useState<string[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    fetchCommissions()
    fetchStats()
    fetchVendorSummaries()
  }, [filterDateRange, selectedPeriod])

  const fetchCommissions = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockCommissions: Commission[] = [
        {
          id: 'comm_1',
          vendor: {
            id: 'v1',
            name: 'Green Valley Dispensary',
            type: 'shop_partner'
          },
          order: {
            id: 'order_1',
            number: 'ORD-2024-001',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            customer: 'John Doe',
            total: 25000
          },
          product_sales: 25000,
          commission_rate: 18,
          commission_amount: 4500,
          status: 'pending',
          payment_date: null,
          payment_method: null,
          payment_reference: null,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'comm_2',
          vendor: {
            id: 'v2',
            name: 'Premium Brands Co',
            type: 'brand_partner'
          },
          order: {
            id: 'order_2',
            number: 'ORD-2024-002',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            customer: 'Jane Smith',
            total: 45000
          },
          product_sales: 45000,
          commission_rate: 15,
          commission_amount: 6750,
          status: 'approved',
          payment_date: null,
          payment_method: null,
          payment_reference: null,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'comm_3',
          vendor: {
            id: 'v3',
            name: 'West Coast Distribution',
            type: 'distributor_partner'
          },
          order: {
            id: 'order_3',
            number: 'ORD-2024-003',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            customer: 'Acme Dispensary',
            total: 150000
          },
          product_sales: 150000,
          commission_rate: 5,
          commission_amount: 7500,
          status: 'paid',
          payment_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          payment_method: 'Stripe Connect',
          payment_reference: 'po_1234567890',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'comm_4',
          vendor: {
            id: 'v1',
            name: 'Green Valley Dispensary',
            type: 'shop_partner'
          },
          order: {
            id: 'order_4',
            number: 'ORD-2024-004',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            customer: 'Bob Johnson',
            total: 35000
          },
          product_sales: 35000,
          commission_rate: 20,
          commission_amount: 7000,
          status: 'paid',
          payment_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          payment_method: 'Stripe Connect',
          payment_reference: 'po_2345678901',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'comm_5',
          vendor: {
            id: 'v4',
            name: 'Herbal Wellness Shop',
            type: 'shop_partner'
          },
          order: {
            id: 'order_5',
            number: 'ORD-2024-005',
            date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            customer: 'Alice Brown',
            total: 18000
          },
          product_sales: 18000,
          commission_rate: 15,
          commission_amount: 2700,
          status: 'disputed',
          payment_date: null,
          payment_method: null,
          payment_reference: null,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ]

      setCommissions(mockCommissions)
    } catch (error) {
      console.error('Error fetching commissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Mock stats for demonstration
      const mockStats: CommissionStats = {
        total_pending: 1125000,
        total_approved: 2450000,
        total_paid: 8750000,
        total_disputed: 270000,
        pending_count: 125,
        approved_count: 245,
        paid_count: 875,
        disputed_count: 12,
        average_commission_rate: 15.5,
        total_sales_volume: 85000000
      }

      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchVendorSummaries = async () => {
    try {
      // Mock vendor summaries
      const mockSummaries: VendorCommissionSummary[] = [
        {
          vendor_id: 'v1',
          vendor_name: 'Green Valley Dispensary',
          vendor_type: 'shop_partner',
          total_sales: 3200000,
          total_commission: 576000,
          pending_commission: 45000,
          paid_commission: 531000,
          average_rate: 18,
          order_count: 342,
          commission_tier: 'Tier 3 (20-25%)'
        },
        {
          vendor_id: 'v2',
          vendor_name: 'Premium Brands Co',
          vendor_type: 'brand_partner',
          total_sales: 2850000,
          total_commission: 427500,
          pending_commission: 67500,
          paid_commission: 360000,
          average_rate: 15,
          order_count: 198,
          commission_tier: 'Fixed 15%'
        },
        {
          vendor_id: 'v3',
          vendor_name: 'West Coast Distribution',
          vendor_type: 'distributor_partner',
          total_sales: 5200000,
          total_commission: 260000,
          pending_commission: 35000,
          paid_commission: 225000,
          average_rate: 5,
          order_count: 425,
          commission_tier: 'Fixed 5%'
        },
        {
          vendor_id: 'v4',
          vendor_name: 'Herbal Wellness Shop',
          vendor_type: 'shop_partner',
          total_sales: 1250000,
          total_commission: 187500,
          pending_commission: 27000,
          paid_commission: 160500,
          average_rate: 15,
          order_count: 156,
          commission_tier: 'Tier 1 (15-20%)'
        }
      ]

      setVendorSummaries(mockSummaries)
    } catch (error) {
      console.error('Error fetching vendor summaries:', error)
    }
  }

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading commission data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load commission data</p>
        </div>
      </DashboardLayout>
    )
  }

  // Helper functions
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-blue-100 text-blue-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'disputed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-4 w-4" />
      case 'approved': return <DocumentCheckIcon className="h-4 w-4" />
      case 'paid': return <CheckIcon className="h-4 w-4" />
      case 'disputed': return <ExclamationTriangleIcon className="h-4 w-4" />
      default: return null
    }
  }

  const getVendorTypeIcon = (type: string) => {
    switch (type) {
      case 'shop_partner':
        return <BuildingStorefrontIcon className="h-4 w-4 text-blue-600" />
      case 'brand_partner':
        return <CubeIcon className="h-4 w-4 text-purple-600" />
      case 'distributor_partner':
        return <TruckIcon className="h-4 w-4 text-green-600" />
      default:
        return null
    }
  }

  const formatDateAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return `${diffMinutes}m ago`
  }

  // Filter commissions
  const filteredCommissions = commissions
    .filter(commission => {
      if (searchTerm && !commission.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !commission.order.number.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !commission.order.customer.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterStatus !== 'all' && commission.status !== filterStatus) {
        return false
      }
      if (filterVendorType !== 'all' && commission.vendor.type !== filterVendorType) {
        return false
      }
      // Date range filtering would be implemented here
      return true
    })

  const handleSelectAll = () => {
    if (selectedCommissions.length === filteredCommissions.length) {
      setSelectedCommissions([])
    } else {
      setSelectedCommissions(filteredCommissions.map(c => c.id))
    }
  }

  const handleSelectCommission = (commissionId: string) => {
    if (selectedCommissions.includes(commissionId)) {
      setSelectedCommissions(selectedCommissions.filter(id => id !== commissionId))
    } else {
      setSelectedCommissions([...selectedCommissions, commissionId])
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedCommissions.length === 0) return
    
    // In a real app, these would be API calls
    switch (action) {
      case 'approve':
        alert(`Approving ${selectedCommissions.length} commissions`)
        break
      case 'pay':
        alert(`Processing payment for ${selectedCommissions.length} commissions`)
        break
      case 'export':
        handleExport(selectedCommissions)
        break
    }
    setSelectedCommissions([])
  }

  const handleExport = (commissionIds?: string[]) => {
    const commissionsToExport = commissionIds 
      ? commissions.filter(c => commissionIds.includes(c.id))
      : filteredCommissions
    
    const headers = ['Order', 'Date', 'Vendor', 'Customer', 'Sales', 'Rate', 'Commission', 'Status', 'Payment Date']
    const rows = commissionsToExport.map(commission => [
      commission.order.number,
      new Date(commission.order.date).toLocaleDateString(),
      commission.vendor.name,
      commission.order.customer,
      formatCurrency(commission.product_sales),
      `${commission.commission_rate}%`,
      formatCurrency(commission.commission_amount),
      commission.status,
      commission.payment_date ? new Date(commission.payment_date).toLocaleDateString() : 'N/A'
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `commissions-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleVendorExpansion = (vendorId: string) => {
    if (expandedVendors.includes(vendorId)) {
      setExpandedVendors(expandedVendors.filter(id => id !== vendorId))
    } else {
      setExpandedVendors([...expandedVendors, vendorId])
    }
  }

  // Chart data
  const commissionStatusData = {
    labels: ['Pending', 'Approved', 'Paid', 'Disputed'],
    datasets: [{
      data: [stats.pending_count, stats.approved_count, stats.paid_count, stats.disputed_count],
      backgroundColor: [
        'rgba(251, 191, 36, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  }

  const commissionTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Commission Amount',
        data: [850000, 920000, 1100000, 980000, 1250000, 1450000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4
      },
      {
        label: 'Sales Volume',
        data: [5200000, 5800000, 6500000, 6000000, 7500000, 8500000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Commission Management</h2>
            <p className="text-gray-600 mt-1">
              Track and manage vendor commissions across the marketplace
            </p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button 
              onClick={() => handleExport()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Commission Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ClockIcon className="h-10 w-10 text-yellow-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(stats.total_pending)}</dd>
                    <dd className="text-sm text-gray-500">{stats.pending_count} orders</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <DocumentCheckIcon className="h-10 w-10 text-blue-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                    <dd className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(stats.total_approved)}</dd>
                    <dd className="text-sm text-gray-500">{stats.approved_count} orders</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <CheckIcon className="h-10 w-10 text-green-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Paid</dt>
                    <dd className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(stats.total_paid)}</dd>
                    <dd className="text-sm text-gray-500">{stats.paid_count} orders</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Disputed</dt>
                    <dd className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(stats.total_disputed)}</dd>
                    <dd className="text-sm text-gray-500">{stats.disputed_count} orders</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ChartBarIcon className="h-10 w-10 text-purple-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Rate</dt>
                    <dd className="mt-1 text-xl font-bold text-gray-900">{stats.average_commission_rate}%</dd>
                    <dd className="text-sm text-gray-500">Commission</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-10 w-10 text-indigo-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Sales Volume</dt>
                    <dd className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(stats.total_sales_volume)}</dd>
                    <dd className="text-sm text-gray-500">Total</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Trends</h3>
            <div className="h-80">
              <Line
                data={commissionTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  },
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      ticks: {
                        callback: function(value) {
                          return '$' + (value as number / 100).toLocaleString()
                        }
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      grid: {
                        drawOnChartArea: false,
                      },
                      ticks: {
                        callback: function(value) {
                          return '$' + (value as number / 100).toLocaleString()
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Status</h3>
            <div className="h-80">
              <Doughnut
                data={commissionStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Vendor Commission Summary */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Vendor Commission Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendorSummaries.map((summary) => {
                  const isExpanded = expandedVendors.includes(summary.vendor_id)
                  
                  return (
                    <React.Fragment key={summary.vendor_id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleVendorExpansion(summary.vendor_id)}
                              className="mr-2 text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? (
                                <ChevronDownIcon className="h-5 w-5" />
                              ) : (
                                <ChevronRightIcon className="h-5 w-5" />
                              )}
                            </button>
                            {getVendorTypeIcon(summary.vendor_type)}
                            <span className="ml-2 text-sm font-medium text-gray-900">{summary.vendor_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(summary.total_sales)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{formatCurrency(summary.total_commission)}</div>
                            <div className="text-gray-500">{summary.commission_tier}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                          {formatCurrency(summary.pending_commission)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {formatCurrency(summary.paid_commission)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {summary.average_rate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {summary.order_count}
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="text-sm">
                              <h4 className="font-medium text-gray-900 mb-2">Recent Commissions</h4>
                              <div className="space-y-2">
                                {commissions
                                  .filter(c => c.vendor.id === summary.vendor_id)
                                  .slice(0, 3)
                                  .map(commission => (
                                    <div key={commission.id} className="flex items-center justify-between">
                                      <div>
                                        <span className="text-gray-900">{commission.order.number}</span>
                                        <span className="ml-2 text-gray-500">• {commission.order.customer}</span>
                                      </div>
                                      <div className="flex items-center space-x-4">
                                        <span className="text-gray-900">{formatCurrency(commission.commission_amount)}</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(commission.status)}`}>
                                          {getStatusIcon(commission.status)}
                                          <span className="ml-1">{commission.status}</span>
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
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
                  placeholder="Search commissions..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="disputed">Disputed</option>
            </select>
            
            <select
              value={filterVendorType}
              onChange={(e) => setFilterVendorType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Vendors</option>
              <option value="shop_partner">Shop Partners</option>
              <option value="brand_partner">Brand Partners</option>
              <option value="distributor_partner">Distributors</option>
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
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedCommissions.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedCommissions.length} commission(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('pay')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Process Payment
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Export Selected
              </button>
              <button
                onClick={() => setSelectedCommissions([])}
                className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Commissions Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCommissions.length === filteredCommissions.length && filteredCommissions.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCommissions.map((commission) => (
                <tr key={commission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCommissions.includes(commission.id)}
                      onChange={() => handleSelectCommission(commission.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{commission.order.number}</div>
                      <div className="text-sm text-gray-500">{commission.order.customer}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getVendorTypeIcon(commission.vendor.type)}
                      <span className="ml-2 text-sm text-gray-900">{commission.vendor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{formatCurrency(commission.product_sales)}</div>
                      <div className="text-gray-500">Order total: {formatCurrency(commission.order.total)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{formatCurrency(commission.commission_amount)}</div>
                      <div className="text-gray-500">@ {commission.commission_rate}%</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(commission.status)}`}>
                      {getStatusIcon(commission.status)}
                      <span className="ml-1">{commission.status}</span>
                    </span>
                    {commission.payment_date && (
                      <div className="text-xs text-gray-500 mt-1">
                        Paid {new Date(commission.payment_date).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateAgo(commission.order.date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(commission.order.date).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCommissions.length === 0 && (
            <div className="text-center py-12">
              <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                No commissions found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}