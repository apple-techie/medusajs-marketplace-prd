'use client'

import { useState, useEffect } from 'react'
import { 
  CurrencyDollarIcon,
  UserGroupIcon,
  LinkIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ChartBarIcon,
  GiftIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface DashboardStats {
  total_referrals: number
  active_referrals: number
  total_commission_earned: number
  pending_commission: number
  conversion_rate: number
  average_order_value: number
  total_clicks: number
  total_sales: number
  current_tier: string
  next_tier_progress: number
}

interface RecentReferral {
  id: string
  customer_name: string
  referred_date: string
  status: 'pending' | 'converted' | 'expired'
  order_value?: number
  commission_earned?: number
}

interface TopProduct {
  id: string
  product_name: string
  brand: string
  referral_count: number
  conversion_rate: number
  total_commission: number
}

export default function ShopDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentReferrals, setRecentReferrals] = useState<RecentReferral[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('last_30_days')

  useEffect(() => {
    fetchDashboardData()
  }, [dateRange])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      
      // Fetch stats
      const statsResponse = await fetch(`http://localhost:9000/vendor/shop/stats?period=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }
      
      // Fetch recent referrals
      const referralsResponse = await fetch('http://localhost:9000/vendor/shop/referrals/recent', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (referralsResponse.ok) {
        const referralsData = await referralsResponse.json()
        setRecentReferrals(referralsData.referrals || [])
      }
      
      // Fetch top products
      const productsResponse = await fetch('http://localhost:9000/vendor/shop/products/top', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setTopProducts(productsData.products || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
        <h1 className="text-2xl font-bold text-gray-900">Shop Partner Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track your referrals, commissions, and performance
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6 flex justify-end">
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
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_referrals}</p>
                <p className="mt-1 text-sm text-green-600">
                  {stats.active_referrals} active
                </p>
              </div>
              <UserGroupIcon className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  ${(stats.total_commission_earned / 100).toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-yellow-600">
                  ${(stats.pending_commission / 100).toFixed(2)} pending
                </p>
              </div>
              <CurrencyDollarIcon className="h-10 w-10 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.conversion_rate.toFixed(1)}%
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {stats.total_clicks} clicks
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-10 w-10 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  ${(stats.average_order_value / 100).toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {stats.total_sales} sales
                </p>
              </div>
              <ShoppingBagIcon className="h-10 w-10 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Commission Tier Progress */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Tier Progress</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Current Tier: {stats.current_tier}</span>
            <span className="text-sm text-gray-500">{stats.next_tier_progress}% to next tier</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${stats.next_tier_progress}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>Bronze (15%)</span>
            <span>Silver (20%)</span>
            <span>Gold (25%)</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Referrals */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Referrals</h2>
              <Link href="/dashboard/shop/referrals" className="text-sm text-blue-600 hover:text-blue-800">
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentReferrals.length > 0 ? (
                recentReferrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{referral.customer_name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(referral.referred_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        referral.status === 'converted' 
                          ? 'bg-green-100 text-green-800'
                          : referral.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {referral.status}
                      </span>
                      {referral.commission_earned && (
                        <p className="mt-1 text-sm font-medium text-green-600">
                          +${(referral.commission_earned / 100).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent referrals</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Products</h2>
              <Link href="/dashboard/shop/analytics" className="text-sm text-blue-600 hover:text-blue-800">
                View analytics →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.product_name}</p>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {product.referral_count} referrals
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.conversion_rate}% conversion
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(product.total_commission / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">earned</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No product data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link 
          href="/dashboard/shop/referrals"
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <LinkIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Manage Referrals</p>
              <p className="text-sm text-gray-500">Track and share links</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/dashboard/shop/commissions"
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">View Commissions</p>
              <p className="text-sm text-gray-500">Earnings history</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/dashboard/shop/marketing"
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <GiftIcon className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Marketing Tools</p>
              <p className="text-sm text-gray-500">Promotions & content</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/dashboard/shop/analytics"
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Analytics</p>
              <p className="text-sm text-gray-500">Performance insights</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}