'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { formatCurrency } from '@marketplace/ui/utils'
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  BeakerIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CalendarIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface AgeVerification {
  id: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
  }
  verification_method: 'document' | 'third_party' | 'manual'
  verification_date: string
  expiry_date: string
  status: 'active' | 'expired' | 'pending' | 'rejected'
  document_type?: string
  document_number?: string
  verified_by?: string
  notes?: string
}

interface VendorCompliance {
  id: string
  vendor: {
    id: string
    name: string
    type: 'shop_partner' | 'brand_partner' | 'distributor_partner'
  }
  license_status: 'active' | 'expired' | 'pending' | 'suspended'
  license_number: string
  license_expiry: string
  insurance_status: 'active' | 'expired' | 'pending'
  insurance_expiry: string
  lab_testing_compliance: number // percentage
  warning_compliance: number // percentage
  last_audit_date: string
  next_audit_date: string
  compliance_score: number
  issues: ComplianceIssue[]
}

interface ComplianceIssue {
  id: string
  type: 'license' | 'insurance' | 'lab_test' | 'warning_label' | 'age_verification' | 'other'
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  created_at: string
  resolved_at?: string
  status: 'open' | 'in_progress' | 'resolved'
}

interface ProductCompliance {
  id: string
  product: {
    id: string
    title: string
    vendor_name: string
  }
  lab_test_status: 'passed' | 'failed' | 'pending' | 'not_tested'
  lab_test_date?: string
  lab_test_expiry?: string
  thc_content?: number
  cbd_content?: number
  contaminants?: {
    pesticides: 'pass' | 'fail'
    heavy_metals: 'pass' | 'fail'
    microbials: 'pass' | 'fail'
  }
  warning_labels: string[]
  age_restriction: 18 | 21
  compliance_status: 'compliant' | 'non_compliant' | 'pending_review'
}

interface ComplianceStats {
  total_verifications: number
  active_verifications: number
  expired_verifications: number
  pending_verifications: number
  compliant_vendors: number
  non_compliant_vendors: number
  vendor_compliance_rate: number
  compliant_products: number
  non_compliant_products: number
  product_compliance_rate: number
  open_issues: number
  critical_issues: number
  resolved_issues_mtd: number
}

export default function CompliancePage() {
  const router = useRouter()
  const [ageVerifications, setAgeVerifications] = useState<AgeVerification[]>([])
  const [vendorCompliance, setVendorCompliance] = useState<VendorCompliance[]>([])
  const [productCompliance, setProductCompliance] = useState<ProductCompliance[]>([])
  const [stats, setStats] = useState<ComplianceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'age' | 'vendor' | 'product'>('age')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  useEffect(() => {
    fetchComplianceData()
    fetchStats()
  }, [])

  const fetchComplianceData = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockAgeVerifications: AgeVerification[] = [
        {
          id: 'av_1',
          customer: {
            id: 'cust_1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890'
          },
          verification_method: 'document',
          verification_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          expiry_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          document_type: 'Drivers License',
          document_number: 'DL123456',
          verified_by: 'System',
          notes: 'Auto-verified via ID scanning'
        },
        {
          id: 'av_2',
          customer: {
            id: 'cust_2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+1234567891'
          },
          verification_method: 'third_party',
          verification_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          expiry_date: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          verified_by: 'IDVerify Service',
          notes: 'Verified through third-party service'
        },
        {
          id: 'av_3',
          customer: {
            id: 'cust_3',
            name: 'Bob Johnson',
            email: 'bob.johnson@example.com',
            phone: '+1234567892'
          },
          verification_method: 'document',
          verification_date: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
          expiry_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'expired',
          document_type: 'Passport',
          document_number: 'P987654',
          verified_by: 'Manual Review',
          notes: 'Verification expired - renewal required'
        },
        {
          id: 'av_4',
          customer: {
            id: 'cust_4',
            name: 'Alice Brown',
            email: 'alice.brown@example.com',
            phone: '+1234567893'
          },
          verification_method: 'manual',
          verification_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          expiry_date: new Date(Date.now() + 363 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          notes: 'Awaiting document review'
        }
      ]

      const mockVendorCompliance: VendorCompliance[] = [
        {
          id: 'vc_1',
          vendor: {
            id: 'v1',
            name: 'Green Valley Dispensary',
            type: 'shop_partner'
          },
          license_status: 'active',
          license_number: 'LIC-2024-001',
          license_expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          insurance_status: 'active',
          insurance_expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          lab_testing_compliance: 98.5,
          warning_compliance: 100,
          last_audit_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          next_audit_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          compliance_score: 96,
          issues: []
        },
        {
          id: 'vc_2',
          vendor: {
            id: 'v2',
            name: 'Premium Brands Co',
            type: 'brand_partner'
          },
          license_status: 'active',
          license_number: 'LIC-2024-002',
          license_expiry: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          insurance_status: 'pending',
          insurance_expiry: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          lab_testing_compliance: 95.0,
          warning_compliance: 98.5,
          last_audit_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          next_audit_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          compliance_score: 82,
          issues: [
            {
              id: 'issue_1',
              type: 'insurance',
              severity: 'high',
              description: 'Insurance renewal documentation pending',
              created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'open'
            }
          ]
        },
        {
          id: 'vc_3',
          vendor: {
            id: 'v3',
            name: 'West Coast Distribution',
            type: 'distributor_partner'
          },
          license_status: 'expired',
          license_number: 'LIC-2023-045',
          license_expiry: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          insurance_status: 'active',
          insurance_expiry: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString(),
          lab_testing_compliance: 88.0,
          warning_compliance: 92.0,
          last_audit_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          next_audit_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          compliance_score: 45,
          issues: [
            {
              id: 'issue_2',
              type: 'license',
              severity: 'critical',
              description: 'Operating license expired',
              created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'open'
            },
            {
              id: 'issue_3',
              type: 'lab_test',
              severity: 'medium',
              description: 'Multiple products missing recent lab tests',
              created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'in_progress'
            }
          ]
        }
      ]

      const mockProductCompliance: ProductCompliance[] = [
        {
          id: 'pc_1',
          product: {
            id: 'prod_1',
            title: 'Premium OG Kush',
            vendor_name: 'Green Valley Dispensary'
          },
          lab_test_status: 'passed',
          lab_test_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lab_test_expiry: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(),
          thc_content: 22.5,
          cbd_content: 0.8,
          contaminants: {
            pesticides: 'pass',
            heavy_metals: 'pass',
            microbials: 'pass'
          },
          warning_labels: ['Keep out of reach of children', 'Do not drive or operate machinery'],
          age_restriction: 21,
          compliance_status: 'compliant'
        },
        {
          id: 'pc_2',
          product: {
            id: 'prod_2',
            title: 'Relaxing Lavender Bath Bomb',
            vendor_name: 'Premium Brands Co'
          },
          lab_test_status: 'passed',
          lab_test_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          lab_test_expiry: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
          thc_content: 0,
          cbd_content: 100,
          contaminants: {
            pesticides: 'pass',
            heavy_metals: 'pass',
            microbials: 'pass'
          },
          warning_labels: ['For external use only'],
          age_restriction: 18,
          compliance_status: 'compliant'
        },
        {
          id: 'pc_3',
          product: {
            id: 'prod_3',
            title: 'Mango Haze Vape Cartridge',
            vendor_name: 'Premium Brands Co'
          },
          lab_test_status: 'pending',
          thc_content: 0,
          cbd_content: 0,
          warning_labels: [],
          age_restriction: 21,
          compliance_status: 'pending_review'
        },
        {
          id: 'pc_4',
          product: {
            id: 'prod_4',
            title: 'Chocolate Chip Cookies 10-Pack',
            vendor_name: 'Herbal Wellness Shop'
          },
          lab_test_status: 'failed',
          lab_test_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          thc_content: 105,
          cbd_content: 5,
          contaminants: {
            pesticides: 'pass',
            heavy_metals: 'pass',
            microbials: 'fail'
          },
          warning_labels: ['Contains THC', 'May contain allergens'],
          age_restriction: 21,
          compliance_status: 'non_compliant'
        }
      ]

      setAgeVerifications(mockAgeVerifications)
      setVendorCompliance(mockVendorCompliance)
      setProductCompliance(mockProductCompliance)
    } catch (error) {
      console.error('Error fetching compliance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Mock stats for demonstration
      const mockStats: ComplianceStats = {
        total_verifications: 15420,
        active_verifications: 14250,
        expired_verifications: 820,
        pending_verifications: 350,
        compliant_vendors: 145,
        non_compliant_vendors: 12,
        vendor_compliance_rate: 92.3,
        compliant_products: 2845,
        non_compliant_products: 125,
        product_compliance_rate: 95.8,
        open_issues: 45,
        critical_issues: 8,
        resolved_issues_mtd: 78
      }

      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading compliance data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load compliance data</p>
        </div>
      </DashboardLayout>
    )
  }

  // Helper functions
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
      case 'passed':
      case 'compliant':
        return 'bg-green-100 text-green-800'
      case 'expired':
      case 'failed':
      case 'non_compliant':
        return 'bg-red-100 text-red-800'
      case 'pending':
      case 'pending_review':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'suspended':
      case 'rejected':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
      case 'high':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
      case 'medium':
        return <InformationCircleIcon className="h-5 w-5 text-yellow-600" />
      case 'low':
        return <InformationCircleIcon className="h-5 w-5 text-blue-600" />
      default:
        return null
    }
  }

  const getComplianceScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
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

  const formatDaysUntil = (date: string) => {
    const now = new Date()
    const future = new Date(date)
    const diffMs = future.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days`
  }

  const handleExport = () => {
    // Export logic would go here
    alert('Exporting compliance report...')
  }

  const toggleItemExpansion = (itemId: string) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter(id => id !== itemId))
    } else {
      setExpandedItems([...expandedItems, itemId])
    }
  }

  // Chart data
  const complianceOverviewData = {
    labels: ['Vendors', 'Products', 'Age Verifications'],
    datasets: [{
      label: 'Compliance Rate',
      data: [stats.vendor_compliance_rate, stats.product_compliance_rate, 92.4],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)'
      ],
      borderWidth: 0
    }]
  }

  const issuesTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Issues',
        data: [45, 52, 38, 48, 35, 42],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: 'Resolved Issues',
        data: [38, 48, 42, 45, 40, 45],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  }

  const issuesSeverityData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: [stats.critical_issues, 12, 18, 7],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ],
      borderWidth: 0
    }]
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Compliance & Verification</h2>
            <p className="text-gray-600 mt-1">
              Manage compliance requirements and age verification across the marketplace
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => router.push('/compliance/audit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ClipboardDocumentCheckIcon className="h-4 w-4 mr-2" />
              Run Audit
            </button>
            <button 
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Compliance Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <UserGroupIcon className="h-10 w-10 text-blue-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Age Verifications</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{stats.active_verifications.toLocaleString()}</dd>
                    <dd className="text-sm text-gray-500">
                      <span className="text-green-600">{stats.active_verifications} active</span> • 
                      <span className="text-red-600 ml-1">{stats.expired_verifications} expired</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-10 w-10 text-purple-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Vendor Compliance</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{stats.vendor_compliance_rate}%</dd>
                    <dd className="text-sm text-gray-500">
                      <span className="text-green-600">{stats.compliant_vendors} compliant</span> • 
                      <span className="text-red-600 ml-1">{stats.non_compliant_vendors} issues</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <BeakerIcon className="h-10 w-10 text-green-600" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Product Testing</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{stats.product_compliance_rate}%</dd>
                    <dd className="text-sm text-gray-500">
                      <span className="text-green-600">{stats.compliant_products} tested</span> • 
                      <span className="text-red-600 ml-1">{stats.non_compliant_products} failed</span>
                    </dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Open Issues</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">{stats.open_issues}</dd>
                    <dd className="text-sm text-gray-500">
                      <span className="text-red-600">{stats.critical_issues} critical</span> • 
                      <span className="text-green-600 ml-1">{stats.resolved_issues_mtd} resolved</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Overview</h3>
            <div className="h-64">
              <Bar
                data={complianceOverviewData}
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
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: function(value) {
                          return value + '%'
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Issues Trend</h3>
            <div className="h-64">
              <Line
                data={issuesTrendData}
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
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Issues by Severity</h3>
            <div className="h-64">
              <Doughnut
                data={issuesSeverityData}
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

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('age')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'age'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Age Verification
              </button>
              <button
                onClick={() => setActiveTab('vendor')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'vendor'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vendor Compliance
              </button>
              <button
                onClick={() => setActiveTab('product')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'product'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Product Testing
              </button>
            </nav>
          </div>

          {/* Age Verification Tab */}
          {activeTab === 'age' && (
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search verifications..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <CheckBadgeIcon className="h-4 w-4 mr-2" />
                  New Verification
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expires
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ageVerifications.map((verification) => (
                      <tr key={verification.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{verification.customer.name}</div>
                            <div className="text-sm text-gray-500">{verification.customer.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{verification.verification_method.replace('_', ' ')}</div>
                          {verification.document_type && (
                            <div className="text-xs text-gray-500">{verification.document_type}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(verification.status)}`}>
                            {verification.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateAgo(verification.verification_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDaysUntil(verification.expiry_date)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(verification.expiry_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">View</button>
                          {verification.status === 'expired' && (
                            <button className="ml-4 text-green-600 hover:text-green-900">Renew</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vendor Compliance Tab */}
          {activeTab === 'vendor' && (
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search vendors..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Issues</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <ClipboardDocumentCheckIcon className="h-4 w-4 mr-2" />
                  Schedule Audit
                </button>
              </div>

              <div className="space-y-4">
                {vendorCompliance.map((vendor) => {
                  const isExpanded = expandedItems.includes(vendor.id)
                  
                  return (
                    <div key={vendor.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleItemExpansion(vendor.id)}
                              className="mr-3 text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? (
                                <ChevronDownIcon className="h-5 w-5" />
                              ) : (
                                <ChevronRightIcon className="h-5 w-5" />
                              )}
                            </button>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{vendor.vendor.name}</h4>
                              <p className="text-sm text-gray-500 capitalize">{vendor.vendor.type.replace('_', ' ')}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${getComplianceScoreColor(vendor.compliance_score)}`}>
                                {vendor.compliance_score}%
                              </div>
                              <div className="text-xs text-gray-500">Compliance Score</div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(vendor.license_status)}`}>
                                  License: {vendor.license_status}
                                </span>
                              </div>
                              <div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(vendor.insurance_status)}`}>
                                  Insurance: {vendor.insurance_status}
                                </span>
                              </div>
                              {vendor.issues.length > 0 && (
                                <div className="flex items-center text-sm text-red-600">
                                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                  {vendor.issues.length} issues
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h5 className="text-sm font-medium text-gray-900 mb-2">License Information</h5>
                                <dl className="text-sm space-y-1">
                                  <div className="flex justify-between">
                                    <dt className="text-gray-500">Number:</dt>
                                    <dd className="text-gray-900">{vendor.license_number}</dd>
                                  </div>
                                  <div className="flex justify-between">
                                    <dt className="text-gray-500">Expires:</dt>
                                    <dd className={vendor.license_status === 'expired' ? 'text-red-600' : 'text-gray-900'}>
                                      {formatDaysUntil(vendor.license_expiry)}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Compliance Metrics</h5>
                                <dl className="text-sm space-y-1">
                                  <div className="flex justify-between">
                                    <dt className="text-gray-500">Lab Testing:</dt>
                                    <dd className="text-gray-900">{vendor.lab_testing_compliance}%</dd>
                                  </div>
                                  <div className="flex justify-between">
                                    <dt className="text-gray-500">Warnings:</dt>
                                    <dd className="text-gray-900">{vendor.warning_compliance}%</dd>
                                  </div>
                                </dl>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Audit Schedule</h5>
                                <dl className="text-sm space-y-1">
                                  <div className="flex justify-between">
                                    <dt className="text-gray-500">Last Audit:</dt>
                                    <dd className="text-gray-900">{formatDateAgo(vendor.last_audit_date)}</dd>
                                  </div>
                                  <div className="flex justify-between">
                                    <dt className="text-gray-500">Next Audit:</dt>
                                    <dd className={new Date(vendor.next_audit_date) < new Date() ? 'text-red-600' : 'text-gray-900'}>
                                      {formatDaysUntil(vendor.next_audit_date)}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                            </div>
                            
                            {vendor.issues.length > 0 && (
                              <div className="mt-4">
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Open Issues</h5>
                                <div className="space-y-2">
                                  {vendor.issues.map((issue) => (
                                    <div key={issue.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                                      <div className="flex items-center">
                                        {getSeverityIcon(issue.severity)}
                                        <div className="ml-2">
                                          <p className="text-sm text-gray-900">{issue.description}</p>
                                          <p className="text-xs text-gray-500">Created {formatDateAgo(issue.created_at)}</p>
                                        </div>
                                      </div>
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusStyle(issue.status)}`}>
                                        {issue.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Product Testing Tab */}
          {activeTab === 'product' && (
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                    <option value="not_tested">Not Tested</option>
                  </select>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <BeakerIcon className="h-4 w-4 mr-2" />
                  Request Testing
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Test Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Potency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contaminants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Compliance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Test
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productCompliance.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.product.title}</div>
                            <div className="text-sm text-gray-500">{product.product.vendor_name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(product.lab_test_status)}`}>
                            {product.lab_test_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.thc_content !== undefined ? (
                            <div className="text-sm">
                              <div>THC: {product.thc_content}%</div>
                              <div>CBD: {product.cbd_content}%</div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {product.contaminants ? (
                            <div className="flex space-x-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                product.contaminants.pesticides === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                P
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                product.contaminants.heavy_metals === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                HM
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                product.contaminants.microbials === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                M
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(product.compliance_status)}`}>
                              {product.compliance_status.replace('_', ' ')}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">{product.age_restriction}+</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.lab_test_date ? (
                            <div className="text-sm">
                              <div className="text-gray-900">{formatDateAgo(product.lab_test_date)}</div>
                              {product.lab_test_expiry && (
                                <div className="text-xs text-gray-500">Expires {formatDaysUntil(product.lab_test_expiry)}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Never tested</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}