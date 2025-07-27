'use client'

import { useState, useEffect } from 'react'
import { 
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { Button } from '@marketplace/ui'
import { Badge } from '@medusajs/ui'
import { formatCurrency } from '@/lib/utils'

type CommissionTier = {
  min_revenue: number
  max_revenue: number
  commission_rate: number
  tier_name: string
}

type FinancialSummary = {
  total_sales: number
  total_commission: number
  pending_payouts: number
  completed_payouts: number
  current_month_sales: number
  current_month_commission: number
  last_month_sales: number
  last_month_commission: number
  commission_rate: number
  current_tier: string
  next_tier_threshold?: number
  currency_code: string
}

type Payout = {
  id: string
  amount: number
  currency_code: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  completed_at?: string
  reference?: string
  method: string
}

type Transaction = {
  id: string
  order_id: string
  order_display_id: number
  amount: number
  commission_amount: number
  commission_rate: number
  currency_code: string
  status: 'pending' | 'completed' | 'refunded'
  created_at: string
}

const commissionTiers: CommissionTier[] = [
  { tier_name: 'Bronze', min_revenue: 0, max_revenue: 10000, commission_rate: 25 },
  { tier_name: 'Silver', min_revenue: 10000, max_revenue: 50000, commission_rate: 20 },
  { tier_name: 'Gold', min_revenue: 50000, max_revenue: Infinity, commission_rate: 15 }
]

export default function FinancialsPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('current_month')

  useEffect(() => {
    fetchFinancialData()
  }, [selectedPeriod])

  const fetchFinancialData = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      
      // Fetch summary
      const summaryResponse = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/financials/summary`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json()
        setSummary(summaryData.summary)
      }
      
      // Fetch payouts
      const payoutsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/financials/payouts`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (payoutsResponse.ok) {
        const payoutsData = await payoutsResponse.json()
        setPayouts(payoutsData.payouts || [])
      }
      
      // Fetch transactions
      const transactionsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/financials/transactions?period=${selectedPeriod}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData.transactions || [])
      }
    } catch (error) {
      console.error('Failed to fetch financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportTransactions = () => {
    // In a real implementation, this would download a CSV file
    alert('Export functionality coming soon!')
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No financial data available</p>
      </div>
    )
  }

  const getTierProgress = () => {
    const currentTier = commissionTiers.find(t => t.tier_name === summary.current_tier)
    const nextTier = commissionTiers.find(t => t.min_revenue > (currentTier?.max_revenue || 0))
    
    if (!currentTier || !nextTier) return null
    
    const progress = ((summary.current_month_sales - currentTier.min_revenue) / 
                     (nextTier.min_revenue - currentTier.min_revenue)) * 100
    
    return {
      currentTier,
      nextTier,
      progress: Math.min(100, Math.max(0, progress)),
      remainingToNext: nextTier.min_revenue - summary.current_month_sales
    }
  }

  const tierProgress = getTierProgress()

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Financials</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track your earnings, commissions, and payouts
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={exportTransactions}
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Sales
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(summary.total_sales, summary.currency_code)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Commission
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(summary.total_commission, summary.currency_code)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Payouts
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(summary.pending_payouts, summary.currency_code)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Payouts
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(summary.completed_payouts, summary.currency_code)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Tier Progress */}
      {tierProgress && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Tier</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Current Tier: {tierProgress.currentTier.tier_name}
                </p>
                <p className="text-sm text-gray-500">
                  {tierProgress.currentTier.commission_rate}% commission rate
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Next Tier: {tierProgress.nextTier.tier_name}
                </p>
                <p className="text-sm text-gray-500">
                  {tierProgress.nextTier.commission_rate}% commission rate
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Progress to {tierProgress.nextTier.tier_name}</span>
                <span className="text-gray-900 font-medium">
                  {formatCurrency(tierProgress.remainingToNext, summary.currency_code)} to go
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${tierProgress.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payouts */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Payouts</h3>
          <div className="space-y-4">
            {payouts.length === 0 ? (
              <p className="text-sm text-gray-500">No payouts yet</p>
            ) : (
              payouts.slice(0, 5).map((payout) => (
                <div key={payout.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(payout.amount, payout.currency_code)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(payout.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    color={
                      payout.status === 'completed' ? 'green' : 
                      payout.status === 'processing' ? 'blue' : 
                      payout.status === 'failed' ? 'red' : 'orange'
                    }
                    size="small"
                  >
                    {payout.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Comparison</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Current Month</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(summary.current_month_sales, summary.currency_code)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Commission</p>
                <p className="text-sm text-gray-700">
                  {formatCurrency(summary.current_month_commission, summary.currency_code)}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Last Month</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(summary.last_month_sales, summary.currency_code)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Commission</p>
                <p className="text-sm text-gray-700">
                  {formatCurrency(summary.last_month_commission, summary.currency_code)}
                </p>
              </div>
            </div>
            
            {summary.current_month_sales > summary.last_month_sales && (
              <div className="flex items-center text-green-600 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {((summary.current_month_sales - summary.last_month_sales) / summary.last_month_sales * 100).toFixed(1)}% increase
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border-gray-300 rounded-md"
            >
              <option value="current_month">Current Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="last_6_months">Last 6 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{transaction.order_display_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.amount, transaction.currency_code)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.commission_amount, transaction.currency_code)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.commission_rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      color={
                        transaction.status === 'completed' ? 'green' : 
                        transaction.status === 'refunded' ? 'red' : 'orange'
                      }
                      size="small"
                    >
                      {transaction.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {transactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No transactions found for the selected period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}