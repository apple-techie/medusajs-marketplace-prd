'use client'

import { useState, useEffect } from 'react'
import { 
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

interface Commission {
  id: string
  order_id: string
  order_display_id: string
  customer_name: string
  product_name: string
  order_date: string
  order_total: number
  commission_rate: number
  commission_amount: number
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
  paid_date?: string
  referral_code: string
  payout_id?: string
}

interface CommissionSummary {
  total_earned: number
  pending_amount: number
  paid_amount: number
  current_month_earned: number
  last_month_earned: number
  average_commission_rate: number
  total_orders: number
  current_tier: string
  tier_commission_rate: number
}

interface Payout {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  completed_at?: string
  reference?: string
  method: string
}

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [summary, setSummary] = useState<CommissionSummary | null>(null)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState('last_30_days')
  const [activeTab, setActiveTab] = useState<'commissions' | 'payouts'>('commissions')

  useEffect(() => {
    fetchCommissionData()
  }, [dateRange])

  const fetchCommissionData = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      
      // Fetch commissions
      const commissionsResponse = await fetch(`http://localhost:9000/vendor/shop/commissions?period=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (commissionsResponse.ok) {
        const commissionsData = await commissionsResponse.json()
        setCommissions(commissionsData.commissions || [])
      }
      
      // Fetch summary
      const summaryResponse = await fetch('http://localhost:9000/vendor/shop/commissions/summary', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json()
        setSummary(summaryData.summary)
      }
      
      // Fetch payouts
      const payoutsResponse = await fetch('http://localhost:9000/vendor/shop/payouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (payoutsResponse.ok) {
        const payoutsData = await payoutsResponse.json()
        setPayouts(payoutsData.payouts || [])
      }
    } catch (error) {
      console.error('Error fetching commission data:', error)
    } finally {
      setLoading(false)
    }
  }

  const requestPayout = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      const response = await fetch('http://localhost:9000/vendor/shop/payouts/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        await fetchCommissionData()
        // Show success message
      }
    } catch (error) {
      console.error('Error requesting payout:', error)
    }
  }

  const exportCommissions = () => {
    // In a real app, this would generate and download a CSV
    console.log('Exporting commissions...')
  }

  const filteredCommissions = commissions.filter(commission => {
    if (filterStatus === 'all') return true
    return commission.status === filterStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'approved':
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Commissions & Payouts</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track your earnings and manage payouts
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  ${(summary.total_earned / 100).toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {summary.total_orders} orders
                </p>
              </div>
              <CurrencyDollarIcon className="h-10 w-10 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  ${(summary.pending_amount / 100).toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Awaiting approval
                </p>
              </div>
              <ClockIcon className="h-10 w-10 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  ${(summary.current_month_earned / 100).toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  vs ${(summary.last_month_earned / 100).toFixed(2)} last
                </p>
              </div>
              <CalendarIcon className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {summary.tier_commission_rate}%
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {summary.current_tier} tier
                </p>
              </div>
              <BanknotesIcon className="h-10 w-10 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Request Payout Banner */}
      {summary && summary.pending_amount >= 5000 && ( // $50 minimum
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">
                You have ${(summary.pending_amount / 100).toFixed(2)} available for payout
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Minimum payout amount is $50. Payouts are processed weekly.
              </p>
            </div>
            <button
              onClick={requestPayout}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Request Payout
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('commissions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'commissions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Commission History
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payouts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payout History
          </button>
        </nav>
      </div>

      {activeTab === 'commissions' ? (
        /* Commission History */
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="last_7_days">Last 7 days</option>
                  <option value="last_30_days">Last 30 days</option>
                  <option value="last_90_days">Last 90 days</option>
                  <option value="this_month">This month</option>
                  <option value="last_month">Last month</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <button
                onClick={exportCommissions}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Order</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Customer</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Referral</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-900">Order Total</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Rate</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-900">Commission</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCommissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">#{commission.order_display_id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(commission.order_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{commission.customer_name}</td>
                    <td className="py-4 px-6 text-gray-600">{commission.product_name}</td>
                    <td className="py-4 px-6">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {commission.referral_code}
                      </code>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-900">
                      ${(commission.order_total / 100).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600">
                      {commission.commission_rate}%
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-green-600">
                      ${(commission.commission_amount / 100).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                        {commission.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Payout History */
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-4">
              {payouts.length > 0 ? (
                payouts.map((payout) => (
                  <div key={payout.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          ${(payout.amount / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Requested {new Date(payout.created_at).toLocaleDateString()}
                        </p>
                        {payout.reference && (
                          <p className="text-sm text-gray-500">
                            Reference: {payout.reference}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payout.status)}`}>
                          {payout.status === 'completed' && <CheckCircleIcon className="h-4 w-4 mr-1" />}
                          {payout.status === 'processing' && <ClockIcon className="h-4 w-4 mr-1" />}
                          {payout.status === 'failed' && <XCircleIcon className="h-4 w-4 mr-1" />}
                          {payout.status}
                        </span>
                        {payout.completed_at && (
                          <p className="text-sm text-gray-500 mt-2">
                            Completed {new Date(payout.completed_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No payout history</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}