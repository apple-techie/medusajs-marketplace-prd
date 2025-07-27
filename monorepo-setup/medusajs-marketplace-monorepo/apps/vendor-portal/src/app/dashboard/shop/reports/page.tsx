'use client'

import { useState, useEffect } from 'react'
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  TableCellsIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline'

interface ReportType {
  id: string
  name: string
  description: string
  category: 'financial' | 'performance' | 'customer' | 'operational'
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'on-demand'
  last_generated?: string
  size?: string
  icon: any
}

interface ScheduledReport {
  id: string
  report_type_id: string
  report_name: string
  frequency: string
  next_run: string
  email: string
  is_active: boolean
}

interface GeneratedReport {
  id: string
  report_name: string
  report_type: string
  generated_at: string
  file_size: string
  download_url: string
  status: 'completed' | 'processing' | 'failed'
}

export default function ReportsPage() {
  const [reportTypes, setReportTypes] = useState<ReportType[]>([])
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([])
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'available' | 'scheduled' | 'history'>('available')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)

  useEffect(() => {
    fetchReportsData()
  }, [])

  const fetchReportsData = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      
      // Fetch report types
      const typesResponse = await fetch('http://localhost:9000/vendor/shop/reports/types', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (typesResponse.ok) {
        const typesData = await typesResponse.json()
        setReportTypes(typesData.report_types || [])
      }
      
      // Fetch scheduled reports
      const scheduledResponse = await fetch('http://localhost:9000/vendor/shop/reports/scheduled', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (scheduledResponse.ok) {
        const scheduledData = await scheduledResponse.json()
        setScheduledReports(scheduledData.scheduled_reports || [])
      }
      
      // Fetch generated reports history
      const historyResponse = await fetch('http://localhost:9000/vendor/shop/reports/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        setGeneratedReports(historyData.reports || [])
      }
    } catch (error) {
      console.error('Error fetching reports data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (reportTypeId: string) => {
    try {
      setGeneratingReport(reportTypeId)
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch('http://localhost:9000/vendor/shop/reports/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ report_type_id: reportTypeId })
      })
      
      if (response.ok) {
        await fetchReportsData() // Refresh the data
        // Show success message
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setGeneratingReport(null)
    }
  }

  const scheduleReport = async (reportTypeId: string, frequency: string, email: string) => {
    try {
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch('http://localhost:9000/vendor/shop/reports/schedule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ report_type_id: reportTypeId, frequency, email })
      })
      
      if (response.ok) {
        await fetchReportsData() // Refresh the data
        // Show success message
      }
    } catch (error) {
      console.error('Error scheduling report:', error)
    }
  }

  const toggleScheduledReport = async (reportId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(`http://localhost:9000/vendor/shop/reports/scheduled/${reportId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: isActive })
      })
      
      if (response.ok) {
        await fetchReportsData() // Refresh the data
      }
    } catch (error) {
      console.error('Error updating scheduled report:', error)
    }
  }

  const downloadReport = (report: GeneratedReport) => {
    // In a real app, this would download the report file
    window.open(report.download_url, '_blank')
  }

  const filteredReportTypes = reportTypes.filter(report => 
    selectedCategory === 'all' || report.category === selectedCategory
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Mock report types data
  const mockReportTypes: ReportType[] = [
    {
      id: 'commission_summary',
      name: 'Commission Summary Report',
      description: 'Detailed breakdown of commissions earned by referral code and product',
      category: 'financial',
      frequency: 'monthly',
      icon: CurrencyDollarIcon
    },
    {
      id: 'referral_performance',
      name: 'Referral Performance Report',
      description: 'Analytics on referral link performance, conversion rates, and traffic sources',
      category: 'performance',
      frequency: 'weekly',
      icon: ChartBarIcon
    },
    {
      id: 'customer_insights',
      name: 'Customer Insights Report',
      description: 'Demographics and behavior patterns of referred customers',
      category: 'customer',
      frequency: 'monthly',
      icon: UserGroupIcon
    },
    {
      id: 'payout_history',
      name: 'Payout History Report',
      description: 'Complete history of commission payouts with transaction details',
      category: 'financial',
      frequency: 'on-demand',
      icon: DocumentArrowDownIcon
    },
    {
      id: 'conversion_funnel',
      name: 'Conversion Funnel Analysis',
      description: 'Detailed funnel analysis from clicks to purchases',
      category: 'performance',
      frequency: 'monthly',
      icon: FunnelIcon
    },
    {
      id: 'tax_summary',
      name: 'Tax Summary Report',
      description: 'Annual commission earnings summary for tax purposes',
      category: 'financial',
      frequency: 'quarterly',
      icon: TableCellsIcon
    },
    {
      id: 'product_performance',
      name: 'Product Performance Report',
      description: 'Which products generate the most referrals and commissions',
      category: 'performance',
      frequency: 'weekly',
      icon: PresentationChartBarIcon
    },
    {
      id: 'campaign_roi',
      name: 'Campaign ROI Report',
      description: 'Return on investment for different marketing campaigns',
      category: 'operational',
      frequency: 'monthly',
      icon: ChartBarIcon
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports Center</h1>
        <p className="mt-2 text-sm text-gray-600">
          Generate and download detailed reports for your shop partner activities
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'available'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Available Reports
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scheduled'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Scheduled Reports
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Report History
          </button>
        </nav>
      </div>

      {activeTab === 'available' && (
        /* Available Reports */
        <div>
          <div className="mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="financial">Financial</option>
              <option value="performance">Performance</option>
              <option value="customer">Customer</option>
              <option value="operational">Operational</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockReportTypes.map((report) => {
              const Icon = report.icon
              return (
                <div key={report.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <Icon className="h-8 w-8 text-blue-600 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{report.category}</span>
                      <span>•</span>
                      <span className="capitalize">{report.frequency}</span>
                    </div>
                    <button
                      onClick={() => generateReport(report.id)}
                      disabled={generatingReport === report.id}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {generatingReport === report.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'scheduled' && (
        /* Scheduled Reports */
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {scheduledReports.length > 0 ? (
              <div className="space-y-4">
                {scheduledReports.map((scheduled) => (
                  <div key={scheduled.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{scheduled.report_name}</h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <span>Frequency: {scheduled.frequency}</span>
                          <span className="mx-2">•</span>
                          <span>Next run: {new Date(scheduled.next_run).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>Email: {scheduled.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleScheduledReport(scheduled.id, !scheduled.is_active)}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            scheduled.is_active 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {scheduled.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No scheduled reports</p>
                <p className="text-sm text-gray-400 mt-2">
                  Schedule reports to receive them automatically via email
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        /* Report History */
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Report Name</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Generated</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Size</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {generatedReports.length > 0 ? (
                  generatedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">{report.report_name}</td>
                      <td className="py-4 px-6 text-gray-600">{report.report_type}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(report.generated_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-gray-600">{report.file_size}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {report.status === 'completed' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                          {report.status === 'processing' && <ClockIcon className="h-3 w-3 mr-1" />}
                          {report.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {report.status === 'completed' ? (
                          <button
                            onClick={() => downloadReport(report)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Download
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No reports generated yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}