'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { formatCurrency, formatPercentage } from '@marketplace/ui/utils'
import { 
  BuildingStorefrontIcon,
  CubeIcon,
  TruckIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  CalendarIcon,
  DocumentCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
)

interface VendorDetail {
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
    website?: string
    description?: string
  }
  commission_info: {
    commission_tier?: string
    base_commission_rate: number
    current_rate: number
    total_earned: number
    pending_payout: number
    last_payout_date?: string
    next_payout_date?: string
  }
  performance_metrics: {
    total_sales: number
    total_orders: number
    total_customers: number
    average_order_value: number
    return_rate: number
    fulfillment_rate: number
    average_fulfillment_time: number
    customer_satisfaction: number
  }
  compliance: {
    status: 'verified' | 'pending' | 'rejected' | 'expired'
    verified_date?: string
    expiry_date?: string
    documents: {
      id: string
      type: string
      name: string
      status: 'approved' | 'pending' | 'rejected'
      uploaded_at: string
      reviewed_at?: string
      reviewer?: string
    }[]
    notes?: string
  }
  financial_history: {
    date: string
    sales: number
    commission: number
    payout?: number
  }[]
  recent_orders: {
    id: string
    order_number: string
    customer_name: string
    total: number
    status: string
    created_at: string
  }[]
  products_summary: {
    total_products: number
    active_products: number
    out_of_stock: number
    low_stock: number
    categories: { name: string; count: number }[]
  }
  activity_log: {
    id: string
    action: string
    description: string
    timestamp: string
    user?: string
  }[]
}

export default function VendorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const vendorId = params.id as string
  
  const [vendor, setVendor] = useState<VendorDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'compliance' | 'activity'>('overview')

  useEffect(() => {
    fetchVendorDetails()
  }, [vendorId])

  const fetchVendorDetails = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockVendor: VendorDetail = {
        id: vendorId,
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
          license_expiry: '2025-12-31',
          website: 'https://greenvalley.com',
          description: 'Premium cannabis dispensary serving the Los Angeles area with a focus on quality products and customer education.'
        },
        commission_info: {
          commission_tier: 'tier_3',
          base_commission_rate: 15,
          current_rate: 25,
          total_earned: 5760000,
          pending_payout: 450000,
          last_payout_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          next_payout_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        performance_metrics: {
          total_sales: 32000000,
          total_orders: 1250,
          total_customers: 892,
          average_order_value: 25600,
          return_rate: 2.1,
          fulfillment_rate: 98.5,
          average_fulfillment_time: 1.2,
          customer_satisfaction: 4.8
        },
        compliance: {
          status: 'verified',
          verified_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          expiry_date: '2025-12-31',
          documents: [
            {
              id: 'doc_1',
              type: 'Business License',
              name: 'business_license_2025.pdf',
              status: 'approved',
              uploaded_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
              reviewed_at: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(),
              reviewer: 'Admin User'
            },
            {
              id: 'doc_2',
              type: 'Cannabis License',
              name: 'cannabis_license_c10.pdf',
              status: 'approved',
              uploaded_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
              reviewed_at: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(),
              reviewer: 'Admin User'
            },
            {
              id: 'doc_3',
              type: 'Insurance Certificate',
              name: 'insurance_cert_2025.pdf',
              status: 'approved',
              uploaded_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
              reviewed_at: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString(),
              reviewer: 'Compliance Team'
            }
          ],
          notes: 'All compliance documents verified and up to date.'
        },
        financial_history: [
          { date: 'Jan 2025', sales: 3200000, commission: 800000, payout: 750000 },
          { date: 'Dec 2024', sales: 3500000, commission: 875000, payout: 875000 },
          { date: 'Nov 2024', sales: 2800000, commission: 560000, payout: 560000 },
          { date: 'Oct 2024', sales: 3100000, commission: 620000, payout: 620000 },
          { date: 'Sep 2024', sales: 2900000, commission: 580000, payout: 580000 },
          { date: 'Aug 2024', sales: 3300000, commission: 660000, payout: 660000 }
        ],
        recent_orders: [
          {
            id: 'order_1',
            order_number: 'ORD-2025-0123',
            customer_name: 'John Doe',
            total: 12500,
            status: 'delivered',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'order_2',
            order_number: 'ORD-2025-0122',
            customer_name: 'Jane Smith',
            total: 8900,
            status: 'processing',
            created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'order_3',
            order_number: 'ORD-2025-0121',
            customer_name: 'Mike Johnson',
            total: 15600,
            status: 'shipped',
            created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'order_4',
            order_number: 'ORD-2025-0120',
            customer_name: 'Sarah Williams',
            total: 23400,
            status: 'delivered',
            created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'order_5',
            order_number: 'ORD-2025-0119',
            customer_name: 'Tom Brown',
            total: 9800,
            status: 'delivered',
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        products_summary: {
          total_products: 145,
          active_products: 132,
          out_of_stock: 8,
          low_stock: 15,
          categories: [
            { name: 'Flower', count: 45 },
            { name: 'Edibles', count: 38 },
            { name: 'Concentrates', count: 28 },
            { name: 'Vapes', count: 20 },
            { name: 'Accessories', count: 14 }
          ]
        },
        activity_log: [
          {
            id: 'log_1',
            action: 'Product Update',
            description: 'Updated pricing for 12 products',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            user: 'Vendor Admin'
          },
          {
            id: 'log_2',
            action: 'Stripe Connected',
            description: 'Stripe account verified and activated',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            user: 'System'
          },
          {
            id: 'log_3',
            action: 'Commission Payout',
            description: 'Commission payout of $4,500 processed',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            user: 'System'
          },
          {
            id: 'log_4',
            action: 'Document Upload',
            description: 'Insurance certificate updated',
            timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            user: 'Vendor Admin'
          },
          {
            id: 'log_5',
            action: 'Account Created',
            description: 'Vendor account created and approved',
            timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
            user: 'Admin User'
          }
        ]
      }
      
      setVendor(mockVendor)
    } catch (error) {
      console.error('Error fetching vendor details:', error)
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
            <p className="mt-4 text-gray-600">Loading vendor details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!vendor) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Vendor not found</p>
          <button
            onClick={() => router.push('/vendors')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Vendors
          </button>
        </div>
      </DashboardLayout>
    )
  }

  // Helper functions
  const getVendorTypeIcon = (type: string) => {
    switch (type) {
      case 'shop_partner':
        return <BuildingStorefrontIcon className="h-6 w-6 text-blue-600" />
      case 'brand_partner':
        return <CubeIcon className="h-6 w-6 text-purple-600" />
      case 'distributor_partner':
        return <TruckIcon className="h-6 w-6 text-green-600" />
      default:
        return null
    }
  }

  const getVendorTypeDisplay = (type: string) => {
    switch (type) {
      case 'shop_partner': return 'Shop Partner'
      case 'brand_partner': return 'Brand Partner'
      case 'distributor_partner': return 'Distributor Partner'
      default: return 'Unknown'
    }
  }

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-600" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
    }
  }

  // Chart configurations
  const salesChartData = {
    labels: vendor.financial_history.map(h => h.date).reverse(),
    datasets: [
      {
        label: 'Sales',
        data: vendor.financial_history.map(h => h.sales / 100).reverse(),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Commission',
        data: vendor.financial_history.map(h => h.commission / 100).reverse(),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  }

  const categoryChartData = {
    labels: vendor.products_summary.categories.map(c => c.name),
    datasets: [{
      label: 'Products',
      data: vendor.products_summary.categories.map(c => c.count),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  }

  const handleExport = () => {
    // In a real app, this would generate a comprehensive vendor report
    const data = {
      vendor_info: vendor.business_info,
      performance: vendor.performance_metrics,
      financial: vendor.commission_info,
      compliance: vendor.compliance
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `vendor-${vendor.id}-report.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.push('/vendors')}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h2 className="text-3xl font-bold text-gray-900">Vendor Details</h2>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getVendorTypeIcon(vendor.type)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
                  <p className="text-gray-600">{vendor.business_info.company_name}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.is_active)}`}>
                      {vendor.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(vendor.compliance.status)}`}>
                      Compliance: {vendor.compliance.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vendor.stripe_account_enabled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Stripe: {vendor.stripe_account_enabled ? 'Connected' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={() => router.push(`/vendors/${vendor.id}/edit`)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Vendor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('financials')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'financials'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Financials
              </button>
              <button
                onClick={() => setActiveTab('compliance')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'compliance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Compliance
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Activity Log
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Business Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {vendor.business_info.address}, {vendor.business_info.city}, {vendor.business_info.state} {vendor.business_info.zip}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{vendor.business_info.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{vendor.email}</span>
                    </div>
                    {vendor.business_info.website && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-400 mr-2">🌐</span>
                        <a href={vendor.business_info.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          {vendor.business_info.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Licensing</h4>
                  <div className="space-y-2">
                    {vendor.business_info.license_number && (
                      <div className="text-sm">
                        <span className="text-gray-600">License: </span>
                        <span className="font-medium text-gray-900">{vendor.business_info.license_number}</span>
                      </div>
                    )}
                    {vendor.business_info.license_expiry && (
                      <div className="text-sm">
                        <span className="text-gray-600">Expires: </span>
                        <span className="font-medium text-gray-900">
                          {new Date(vendor.business_info.license_expiry).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {vendor.business_info.ein && (
                      <div className="text-sm">
                        <span className="text-gray-600">EIN: </span>
                        <span className="font-medium text-gray-900">{vendor.business_info.ein}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {vendor.business_info.description && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <p className="text-sm text-gray-700">{vendor.business_info.description}</p>
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(vendor.performance_metrics.total_sales)}</p>
                  <p className="text-sm text-gray-600">Total Sales</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{vendor.performance_metrics.total_orders.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{vendor.performance_metrics.total_customers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(vendor.performance_metrics.average_order_value)}</p>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-900">{vendor.performance_metrics.fulfillment_rate}%</p>
                  <p className="text-sm text-gray-600">Fulfillment Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-900">{vendor.performance_metrics.average_fulfillment_time}h</p>
                  <p className="text-sm text-gray-600">Avg Fulfillment Time</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-900">{vendor.performance_metrics.return_rate}%</p>
                  <p className="text-sm text-gray-600">Return Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-900">⭐ {vendor.performance_metrics.customer_satisfaction}</p>
                  <p className="text-sm text-gray-600">Customer Rating</p>
                </div>
              </div>
            </div>

            {/* Products Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Products</span>
                    <span className="text-sm font-medium text-gray-900">{vendor.products_summary.total_products}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Products</span>
                    <span className="text-sm font-medium text-green-600">{vendor.products_summary.active_products}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Out of Stock</span>
                    <span className="text-sm font-medium text-red-600">{vendor.products_summary.out_of_stock}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Low Stock</span>
                    <span className="text-sm font-medium text-yellow-600">{vendor.products_summary.low_stock}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Bar
                    data={categoryChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                    height={200}
                  />
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {vendor.recent_orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                        <p className="text-xs text-gray-500">{order.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push(`/orders?vendor=${vendor.id}`)}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Orders →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-6">
            {/* Commission Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Commission Tier</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vendor.commission_info.commission_tier?.replace('tier_', 'Tier ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {vendor.commission_info.current_rate}% rate
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Earned</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(vendor.commission_info.total_earned)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Payout</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(vendor.commission_info.pending_payout)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Payout</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {vendor.commission_info.next_payout_date 
                      ? new Date(vendor.commission_info.next_payout_date).toLocaleDateString()
                      : 'Not scheduled'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Financial History Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financial History</h3>
              <div style={{ height: '300px' }}>
                <Line
                  data={salesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `$${(value as number).toLocaleString()}`
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Payout History */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Payout History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payout
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vendor.financial_history.map((record, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(record.sales)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(record.commission)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.payout ? formatCurrency(record.payout) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.payout ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.payout ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* Compliance Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getComplianceColor(vendor.compliance.status)}`}>
                    <ShieldCheckIcon className="h-4 w-4 mr-1" />
                    {vendor.compliance.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Verified Date</p>
                  <p className="text-lg font-medium text-gray-900">
                    {vendor.compliance.verified_date 
                      ? new Date(vendor.compliance.verified_date).toLocaleDateString()
                      : 'Not verified'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expiry Date</p>
                  <p className="text-lg font-medium text-gray-900">
                    {vendor.compliance.expiry_date || 'N/A'}
                  </p>
                </div>
              </div>
              {vendor.compliance.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{vendor.compliance.notes}</p>
                </div>
              )}
            </div>

            {/* Compliance Documents */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Compliance Documents</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {vendor.compliance.documents.map((doc) => (
                  <div key={doc.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.type}</p>
                          <p className="text-sm text-gray-500">{doc.name}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                            {doc.reviewed_at && ` • Reviewed ${new Date(doc.reviewed_at).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {getDocumentStatusIcon(doc.status)}
                          <span className={`ml-2 text-sm font-medium ${
                            doc.status === 'approved' ? 'text-green-600' : 
                            doc.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Request Document Update
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Activity Log</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {vendor.activity_log.map((activity) => (
                <div key={activity.id} className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                        {activity.user && ` • by ${activity.user}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Full History
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}