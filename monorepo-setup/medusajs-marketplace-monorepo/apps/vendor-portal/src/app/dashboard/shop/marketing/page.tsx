'use client'

import { useState, useEffect } from 'react'
import { 
  PhotoIcon,
  DocumentTextIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  MegaphoneIcon,
  GiftIcon,
  HashtagIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline'

interface MarketingAsset {
  id: string
  name: string
  type: 'banner' | 'social_post' | 'email_template' | 'flyer' | 'product_image'
  category: string
  dimensions?: string
  file_size?: string
  preview_url: string
  download_url: string
  created_at: string
  tags: string[]
}

interface PromoCode {
  id: string
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_value?: number
  valid_from: string
  valid_until: string
  usage_count: number
  usage_limit?: number
  is_active: boolean
}

interface SocialTemplate {
  id: string
  platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok'
  title: string
  content: string
  hashtags: string[]
  character_count: number
  has_image: boolean
}

export default function MarketingToolsPage() {
  const [activeTab, setActiveTab] = useState<'assets' | 'promo' | 'social' | 'content'>('assets')
  const [assets, setAssets] = useState<MarketingAsset[]>([])
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [socialTemplates, setSocialTemplates] = useState<SocialTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchMarketingData()
  }, [])

  const fetchMarketingData = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      
      // Fetch marketing assets
      const assetsResponse = await fetch('http://localhost:9000/vendor/shop/marketing/assets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (assetsResponse.ok) {
        const assetsData = await assetsResponse.json()
        setAssets(assetsData.assets || [])
      }
      
      // Fetch promo codes
      const promoResponse = await fetch('http://localhost:9000/vendor/shop/marketing/promo-codes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (promoResponse.ok) {
        const promoData = await promoResponse.json()
        setPromoCodes(promoData.promo_codes || [])
      }
      
      // Fetch social templates
      const socialResponse = await fetch('http://localhost:9000/vendor/shop/marketing/social-templates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (socialResponse.ok) {
        const socialData = await socialResponse.json()
        setSocialTemplates(socialData.templates || [])
      }
    } catch (error) {
      console.error('Error fetching marketing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const downloadAsset = (asset: MarketingAsset) => {
    // In a real app, this would download the asset
    window.open(asset.download_url, '_blank')
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'banner':
        return ComputerDesktopIcon
      case 'social_post':
        return DevicePhoneMobileIcon
      case 'email_template':
        return DocumentTextIcon
      case 'flyer':
        return NewspaperIcon
      default:
        return PhotoIcon
    }
  }

  const filteredAssets = assets.filter(asset => 
    selectedCategory === 'all' || asset.category === selectedCategory
  )

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
        <h1 className="text-2xl font-bold text-gray-900">Marketing Tools</h1>
        <p className="mt-2 text-sm text-gray-600">
          Access promotional materials and tools to boost your referrals
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('assets')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Marketing Assets
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'promo'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Promo Codes
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'social'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Social Media
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Content Library
          </button>
        </nav>
      </div>

      {activeTab === 'assets' && (
        /* Marketing Assets */
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="banners">Banners</option>
                <option value="social">Social Media</option>
                <option value="email">Email</option>
                <option value="print">Print Materials</option>
                <option value="products">Product Images</option>
              </select>
            </div>
            <p className="text-sm text-gray-500">
              {filteredAssets.length} assets available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => {
              const Icon = getAssetIcon(asset.type)
              return (
                <div key={asset.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-t-lg">
                    <img
                      src={asset.preview_url}
                      alt={asset.name}
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{asset.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {asset.dimensions && `${asset.dimensions} • `}
                          {asset.file_size}
                        </p>
                      </div>
                      <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {asset.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadAsset(asset)}
                        className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                      <button
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'promo' && (
        /* Promo Codes */
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Promo Codes</h2>
              <p className="text-sm text-gray-600 mb-6">
                Share these exclusive codes with your audience to boost conversions
              </p>
              
              <div className="space-y-4">
                {promoCodes.map((promo) => (
                  <div key={promo.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <code className="text-lg font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded">
                            {promo.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(promo.code, promo.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {copiedId === promo.id ? (
                              <CheckIcon className="h-5 w-5 text-green-600" />
                            ) : (
                              <ClipboardDocumentIcon className="h-5 w-5" />
                            )}
                          </button>
                          {promo.is_active ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-gray-900">{promo.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            {promo.discount_type === 'percentage' 
                              ? `${promo.discount_value}% off`
                              : `$${promo.discount_value} off`
                            }
                          </span>
                          {promo.min_order_value && (
                            <span>Min order: ${promo.min_order_value / 100}</span>
                          )}
                          <span>
                            Valid: {new Date(promo.valid_from).toLocaleDateString()} - {new Date(promo.valid_until).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-500">Uses</p>
                        <p className="font-medium text-gray-900">
                          {promo.usage_count}{promo.usage_limit && `/${promo.usage_limit}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        /* Social Media Templates */
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{template.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 capitalize">{template.platform}</p>
                  </div>
                  {template.has_image && (
                    <PhotoIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{template.content}</p>
                </div>
                
                {template.hashtags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center flex-wrap gap-2">
                      <HashtagIcon className="h-4 w-4 text-gray-400" />
                      {template.hashtags.map((tag) => (
                        <span key={tag} className="text-blue-600 text-sm">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {template.character_count} characters
                  </span>
                  <button
                    onClick={() => copyToClipboard(
                      `${template.content}\n\n${template.hashtags.map(tag => `#${tag}`).join(' ')}`,
                      template.id
                    )}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {copiedId === template.id ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                        Copy Text
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        /* Content Library */
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <MegaphoneIcon className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Product Descriptions</h3>
                <p className="text-sm text-gray-600">
                  Pre-written product descriptions optimized for conversions
                </p>
              </div>
              
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <DocumentTextIcon className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Blog Post Templates</h3>
                <p className="text-sm text-gray-600">
                  Educational content templates about cannabis products
                </p>
              </div>
              
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <ShareIcon className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Email Campaigns</h3>
                <p className="text-sm text-gray-600">
                  Ready-to-use email templates for your subscriber list
                </p>
              </div>
              
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <GiftIcon className="h-8 w-8 text-orange-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Seasonal Promotions</h3>
                <p className="text-sm text-gray-600">
                  Holiday and seasonal campaign materials
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}