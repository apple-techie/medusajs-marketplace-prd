'use client'

import { useState } from 'react'
import { 
  DocumentArrowDownIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { Button } from '@marketplace/ui'

type ReportType = {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  available: boolean
}

const REPORT_TYPES: ReportType[] = [
  {
    id: 'sales',
    name: 'Sales Report',
    description: 'Detailed breakdown of sales, revenue, and order metrics',
    icon: CurrencyDollarIcon,
    available: true,
  },
  {
    id: 'products',
    name: 'Product Performance',
    description: 'Analysis of product sales, inventory turnover, and trends',
    icon: ShoppingBagIcon,
    available: true,
  },
  {
    id: 'customers',
    name: 'Customer Analytics',
    description: 'Customer behavior, retention, and lifetime value analysis',
    icon: ChartBarIcon,
    available: true,
  },
  {
    id: 'inventory',
    name: 'Inventory Report',
    description: 'Stock levels, turnover rates, and reorder recommendations',
    icon: DocumentArrowDownIcon,
    available: true,
  },
  {
    id: 'commission',
    name: 'Commission Statement',
    description: 'Monthly commission calculations and payout history',
    icon: CurrencyDollarIcon,
    available: true,
  },
]

const PERIODS = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'last_quarter', label: 'Last Quarter' },
  { value: 'this_year', label: 'This Year' },
  { value: 'last_year', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState('this_month')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [generating, setGenerating] = useState(false)

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      alert('Please select a report type')
      return
    }

    if (selectedPeriod === 'custom' && (!startDate || !endDate)) {
      alert('Please select start and end dates')
      return
    }

    setGenerating(true)
    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      const params = new URLSearchParams({
        type: selectedReport,
        period: selectedPeriod,
        ...(selectedPeriod === 'custom' && { start_date: startDate, end_date: endDate })
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/vendors/${vendorId}/reports?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        // Get the blob data
        const blob = await response.blob()
        
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        alert('Failed to generate report')
      }
    } catch (error) {
      console.error('Failed to generate report:', error)
      alert('Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="mt-2 text-sm text-gray-700">
          Generate and download detailed reports for your business
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Generate Report</h3>
          
          {/* Report Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Report Type
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {REPORT_TYPES.map((report) => {
                const Icon = report.icon
                const isSelected = selectedReport === report.id
                
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    disabled={!report.available}
                    className={`relative rounded-lg border p-4 text-left focus:outline-none ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500'
                        : report.available
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start">
                      <Icon className={`h-6 w-6 flex-shrink-0 ${
                        isSelected ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {report.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {report.description}
                        </p>
                      </div>
                    </div>
                    {!report.available && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Period Selection */}
          <div className="mb-6">
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
              Select Period
            </label>
            <select
              id="period"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {PERIODS.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Date Range */}
          {selectedPeriod === 'custom' && (
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleGenerateReport}
              disabled={!selectedReport || generating}
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              {generating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Reports</h3>
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              Your recently generated reports will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}