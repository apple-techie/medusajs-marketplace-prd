'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BuildingStorefrontIcon,
  UserCircleIcon,
  BanknotesIcon,
  BellIcon,
  ShieldCheckIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { Button } from '@marketplace/ui'
import { Input } from '@medusajs/ui'

type VendorSettings = {
  vendor: {
    id: string
    name: string
    email: string
    description: string
    website?: string
    type: string
    commission_rate: number
    is_active: boolean
    stripe_account_id?: string
    stripe_onboarding_completed: boolean
    metadata?: {
      business_address?: string
      phone?: string
      logo_url?: string
      banner_url?: string
      social_media?: {
        facebook?: string
        instagram?: string
        twitter?: string
      }
    }
  }
  admin: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  notifications: {
    new_order: boolean
    order_fulfilled: boolean
    payout_completed: boolean
    product_low_stock: boolean
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<VendorSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    phone: '',
    business_address: '',
    facebook: '',
    instagram: '',
    twitter: '',
    admin_first_name: '',
    admin_last_name: '',
    admin_email: '',
    notifications: {
      new_order: true,
      order_fulfilled: true,
      payout_completed: true,
      product_low_stock: true
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/settings`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
        
        // Initialize form data
        setFormData({
          name: data.settings.vendor.name,
          description: data.settings.vendor.description || '',
          website: data.settings.vendor.website || '',
          phone: data.settings.vendor.metadata?.phone || '',
          business_address: data.settings.vendor.metadata?.business_address || '',
          facebook: data.settings.vendor.metadata?.social_media?.facebook || '',
          instagram: data.settings.vendor.metadata?.social_media?.instagram || '',
          twitter: data.settings.vendor.metadata?.social_media?.twitter || '',
          admin_first_name: data.settings.admin.first_name,
          admin_last_name: data.settings.admin.last_name,
          admin_email: data.settings.admin.email,
          notifications: data.settings.notifications
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const token = localStorage.getItem('vendor_token')
      
      const updateData = {
        vendor: {
          name: formData.name,
          description: formData.description,
          website: formData.website,
          metadata: {
            ...settings?.vendor.metadata,
            phone: formData.phone,
            business_address: formData.business_address,
            social_media: {
              facebook: formData.facebook,
              instagram: formData.instagram,
              twitter: formData.twitter
            }
          }
        },
        admin: {
          first_name: formData.admin_first_name,
          last_name: formData.admin_last_name,
          email: formData.admin_email
        },
        notifications: formData.notifications
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/settings`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      )
      
      if (response.ok) {
        await fetchSettings()
        alert('Settings updated successfully!')
      } else {
        alert('Failed to update settings')
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
      alert('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  const handleStripeConnect = () => {
    // In a real implementation, this would redirect to Stripe Connect
    window.location.href = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/stripe/connect`
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!settings) {
    return null
  }

  const tabs = [
    { id: 'general', name: 'General', icon: BuildingStorefrontIcon },
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'payments', name: 'Payments', icon: BanknotesIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'media', name: 'Media', icon: PhotoIcon }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your vendor account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">General Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="business_address" className="block text-sm font-medium text-gray-700">
                  Business Address
                </label>
                <Input
                  id="business_address"
                  type="text"
                  value={formData.business_address}
                  onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Tell customers about your business..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Admin Profile</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="admin_first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  id="admin_first_name"
                  type="text"
                  value={formData.admin_first_name}
                  onChange={(e) => setFormData({ ...formData, admin_first_name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="admin_last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  id="admin_last_name"
                  type="text"
                  value={formData.admin_last_name}
                  onChange={(e) => setFormData({ ...formData, admin_last_name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="admin_email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="admin_email"
                  type="email"
                  value={formData.admin_email}
                  onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Social Media</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                    Facebook
                  </label>
                  <Input
                    id="facebook"
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                    Instagram
                  </label>
                  <Input
                    id="instagram"
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                    Twitter
                  </label>
                  <Input
                    id="twitter"
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="https://twitter.com/..."
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payments' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Commission Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Vendor Type:</dt>
                      <dd className="text-sm font-medium text-gray-900 capitalize">{settings.vendor.type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Commission Rate:</dt>
                      <dd className="text-sm font-medium text-gray-900">{settings.vendor.commission_rate}%</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Stripe Connect</h4>
                {settings.vendor.stripe_onboarding_completed ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-green-400 mr-2" />
                      <p className="text-sm text-green-800">
                        Stripe account connected and verified
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Account ID: {settings.vendor.stripe_account_id}
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 mb-3">
                      Connect your Stripe account to receive payouts
                    </p>
                    <Button
                      type="button"
                      onClick={handleStripeConnect}
                      variant="primary"
                      size="sm"
                    >
                      Connect Stripe Account
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">New Order</p>
                  <p className="text-sm text-gray-500">Get notified when you receive a new order</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications.new_order}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, new_order: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order Fulfilled</p>
                  <p className="text-sm text-gray-500">Get notified when an order is fulfilled</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications.order_fulfilled}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, order_fulfilled: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Payout Completed</p>
                  <p className="text-sm text-gray-500">Get notified when a payout is completed</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications.payout_completed}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, payout_completed: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Low Stock Alert</p>
                  <p className="text-sm text-gray-500">Get notified when product stock is low</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications.product_low_stock}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, product_low_stock: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Media Settings */}
        {activeTab === 'media' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Media & Branding</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                    {settings.vendor.metadata?.logo_url ? (
                      <img
                        className="h-full w-full object-cover"
                        src={settings.vendor.metadata.logo_url}
                        alt="Logo"
                      />
                    ) : (
                      <PhotoIcon className="h-full w-full text-gray-300" />
                    )}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="ml-5"
                  >
                    Change
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <div className="mt-1">
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    {settings.vendor.metadata?.banner_url ? (
                      <img
                        className="h-full w-full object-cover"
                        src={settings.vendor.metadata.banner_url}
                        alt="Banner"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <PhotoIcon className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                  >
                    Change Banner
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}