'use client'

import { useState, useEffect } from 'react'
import { 
  LinkIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  QrCodeIcon,
  ShareIcon,
  CheckIcon,
  PlusIcon,
  EyeIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'

interface ReferralLink {
  id: string
  name: string
  code: string
  url: string
  clicks: number
  conversions: number
  conversion_rate: number
  total_commission: number
  created_at: string
  is_active: boolean
  product_id?: string
  product_name?: string
  category?: string
}

interface ReferralStats {
  total_links: number
  active_links: number
  total_clicks: number
  total_conversions: number
  average_conversion_rate: number
  lifetime_commission: number
}

export default function ReferralsPage() {
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([])
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [newLinkData, setNewLinkData] = useState({
    name: '',
    product_id: '',
    category: 'general'
  })

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      
      // Fetch referral links
      const linksResponse = await fetch('http://localhost:9000/vendor/shop/referrals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (linksResponse.ok) {
        const linksData = await linksResponse.json()
        setReferralLinks(linksData.referral_links || [])
      }
      
      // Fetch stats
      const statsResponse = await fetch('http://localhost:9000/vendor/shop/referrals/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }
    } catch (error) {
      console.error('Error fetching referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createReferralLink = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      const response = await fetch('http://localhost:9000/vendor/shop/referrals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLinkData)
      })
      
      if (response.ok) {
        await fetchReferralData()
        setShowCreateModal(false)
        setNewLinkData({
          name: '',
          product_id: '',
          category: 'general'
        })
      }
    } catch (error) {
      console.error('Error creating referral link:', error)
    }
  }

  const toggleLinkStatus = async (linkId: string) => {
    try {
      const token = localStorage.getItem('vendor_token')
      const link = referralLinks.find(l => l.id === linkId)
      
      const response = await fetch(`http://localhost:9000/vendor/shop/referrals/${linkId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_active: !link?.is_active
        })
      })
      
      if (response.ok) {
        await fetchReferralData()
      }
    } catch (error) {
      console.error('Error updating link status:', error)
    }
  }

  const copyToClipboard = (url: string, linkId: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(linkId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const generateQRCode = (linkId: string) => {
    // In a real app, this would generate and download a QR code
    console.log('Generating QR code for link:', linkId)
  }

  const shareLink = (link: ReferralLink) => {
    if (navigator.share) {
      navigator.share({
        title: link.name,
        text: `Check out this product: ${link.product_name || 'Amazing deals'}`,
        url: link.url
      })
    }
  }

  const filteredLinks = referralLinks.filter(link => {
    const matchesSearch = link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (link.product_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    if (filterStatus === 'all') return matchesSearch
    if (filterStatus === 'active') return matchesSearch && link.is_active
    if (filterStatus === 'inactive') return matchesSearch && !link.is_active
    
    return matchesSearch
  })

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
        <h1 className="text-2xl font-bold text-gray-900">Referral Links</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create and manage your referral links to earn commissions
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Links</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_links}</p>
            <p className="mt-1 text-sm text-green-600">{stats.active_links} active</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Clicks</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_clicks}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Conversions</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_conversions}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Avg Conversion</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.average_conversion_rate.toFixed(1)}%</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <p className="text-sm font-medium text-gray-600">Lifetime Commission</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              ${(stats.lifetime_commission / 100).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, code, or product..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Links</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Link
            </button>
          </div>

          {/* Referral Links Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Clicks</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Conversions</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Rate</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Commission</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{link.name}</p>
                      <p className="text-sm text-gray-500">
                        Created {new Date(link.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{link.code}</code>
                    </td>
                    <td className="py-4 px-4">
                      {link.product_name ? (
                        <div>
                          <p className="text-sm text-gray-900">{link.product_name}</p>
                          <p className="text-xs text-gray-500">{link.category}</p>
                        </div>
                      ) : (
                        <span className="text-gray-500">General</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">{link.clicks}</td>
                    <td className="py-4 px-4 text-center">{link.conversions}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-medium">{link.conversion_rate.toFixed(1)}%</span>
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-green-600">
                      ${(link.total_commission / 100).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => toggleLinkStatus(link.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          link.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {link.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => copyToClipboard(link.url, link.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Copy link"
                        >
                          {copiedId === link.id ? (
                            <CheckIcon className="h-5 w-5 text-green-600" />
                          ) : (
                            <ClipboardDocumentIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => generateQRCode(link.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Generate QR code"
                        >
                          <QrCodeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => shareLink(link)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Share link"
                        >
                          <ShareIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View analytics"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create Referral Link</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Name
                </label>
                <input
                  type="text"
                  value={newLinkData.name}
                  onChange={(e) => setNewLinkData({ ...newLinkData, name: e.target.value })}
                  placeholder="e.g., Instagram Campaign, Blog Post"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product (Optional)
                </label>
                <select
                  value={newLinkData.product_id}
                  onChange={(e) => setNewLinkData({ ...newLinkData, product_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">General (All Products)</option>
                  <option value="prod_1">Premium THC Vape Pen</option>
                  <option value="prod_2">Organic CBD Tincture 1000mg</option>
                  <option value="prod_3">Delta-8 Gummies Pack</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newLinkData.category}
                  onChange={(e) => setNewLinkData({ ...newLinkData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="social_media">Social Media</option>
                  <option value="email">Email Campaign</option>
                  <option value="blog">Blog/Website</option>
                  <option value="offline">Offline/Print</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createReferralLink}
                disabled={!newLinkData.name}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}