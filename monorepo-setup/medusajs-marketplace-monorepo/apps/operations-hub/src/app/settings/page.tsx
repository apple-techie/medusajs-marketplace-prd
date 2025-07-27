'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdmin } from '@/lib/medusa-client'
import { 
  InformationCircleIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  BellIcon,
  TruckIcon,
  UsersIcon,
  CogIcon,
  LinkIcon,
  KeyIcon
} from '@heroicons/react/24/outline'

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  checks: {
    database: { status: string; latency: number }
    cache: { status: string; memory: string }
    storage: { status: string; usage: string }
    api: { status: string; uptime: string }
  }
  lastChecked: string
}

interface Feature {
  id: string
  name: string
  description: string
  enabled: boolean
  beta?: boolean
  requirements?: string[]
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const queryClient = useQueryClient()
  
  // Fetch settings from API
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        return await fetchAdmin('/settings')
      } catch (error) {
        // Return null if settings endpoint doesn't exist
        return null
      }
    },
    retry: false,
    refetchOnWindowFocus: false
  })
  
  // Fetch integration status
  const { data: integrationData } = useQuery({
    queryKey: ['integrations-status'],
    queryFn: async () => {
      try {
        return await fetchAdmin('/integrations/status')
      } catch (error) {
        return null
      }
    },
    enabled: false, // Disable for now since endpoint doesn't exist
    retry: false,
    refetchOnWindowFocus: false
  })
  
  // Fetch security status
  const { data: securityData } = useQuery({
    queryKey: ['security-status'],
    queryFn: async () => {
      try {
        return await fetchAdmin('/security/status')
      } catch (error) {
        return null
      }
    },
    enabled: false, // Disable for now since endpoint doesn't exist
    retry: false,
    refetchOnWindowFocus: false
  })
  
  // Fetch system health (only if authenticated)
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('admin_token')
  const { data: healthData } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      try {
        return await fetchAdmin('/system/health')
      } catch (error) {
        // Silently fail for optional health check
        return null
      }
    },
    enabled: false, // Disable for now since endpoint doesn't exist
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false // Don't refetch on window focus
  })
  
  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'Multi-Vendor Marketplace',
    platformEmail: 'admin@marketplace.com',
    supportEmail: 'support@marketplace.com',
    timeZone: 'America/Los_Angeles',
    currency: 'USD',
    language: 'en',
    maintenanceMode: false,
    maintenanceMessage: 'We are performing scheduled maintenance. We\'ll be back soon!',
    logo: '/logo.png',
    favicon: '/favicon.ico',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US'
  })
  
  const [commissionSettings, setCommissionSettings] = useState({
    shopPartners: {
      bronze: { min: 0, max: 50000, rate: 15 },
      silver: { min: 50000, max: 200000, rate: 20 },
      gold: { min: 200000, max: Infinity, rate: 25 }
    },
    brandPartners: { rate: 10 },
    distributorPartners: { rate: 5 },
    payoutSchedule: 'weekly',
    minimumPayout: 50,
    payoutMethod: 'stripe',
    holdPeriod: 7
  })
  
  const [fulfillmentSettings, setFulfillmentSettings] = useState({
    maxCapacity: 90,
    warningThreshold: 75,
    autoTransfer: true,
    priorityRouting: true,
    deliveryTargetHours: 3,
    routingAlgorithm: 'smart',
    splitOrders: true,
    maxSplitCount: 3,
    deliveryZones: [
      { id: '1', name: 'Zone 1', maxDistance: 5, surcharge: 0 },
      { id: '2', name: 'Zone 2', maxDistance: 10, surcharge: 5 },
      { id: '3', name: 'Zone 3', maxDistance: 20, surcharge: 10 }
    ]
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    vendorApplications: true,
    lowInventory: true,
    systemAlerts: true,
    dailyReports: false,
    weeklyAnalytics: true,
    channels: {
      email: true,
      sms: false,
      push: true,
      slack: false
    },
    recipients: {
      admin: ['admin@marketplace.com'],
      operations: ['ops@marketplace.com'],
      finance: ['finance@marketplace.com']
    }
  })
  
  const [featureFlags, setFeatureFlags] = useState<Feature[]>([
    {
      id: 'multi_warehouse',
      name: 'Multi-Warehouse Support',
      description: 'Enable vendors to manage multiple warehouse locations',
      enabled: true,
      beta: false
    },
    {
      id: 'ai_recommendations',
      name: 'AI Product Recommendations',
      description: 'Machine learning based product recommendations',
      enabled: false,
      beta: true,
      requirements: ['ML service subscription']
    },
    {
      id: 'advanced_analytics',
      name: 'Advanced Analytics',
      description: 'Enhanced reporting and predictive analytics',
      enabled: true,
      beta: false
    },
    {
      id: 'subscription_orders',
      name: 'Subscription Orders',
      description: 'Support for recurring subscription-based orders',
      enabled: false,
      beta: true
    },
    {
      id: 'loyalty_program',
      name: 'Loyalty Program',
      description: 'Points-based customer loyalty program',
      enabled: true,
      beta: false
    },
    {
      id: 'live_chat',
      name: 'Live Chat Support',
      description: 'Integrated live chat for customer support',
      enabled: false,
      beta: false,
      requirements: ['Chat service integration']
    }
  ])
  
  // Mock system health data
  const systemHealth: SystemHealth = healthData || {
    status: 'healthy',
    checks: {
      database: { status: 'Connected', latency: 12 },
      cache: { status: 'Active', memory: '256MB/512MB' },
      storage: { status: 'Available', usage: '45.2GB/100GB' },
      api: { status: 'Running', uptime: '99.98%' }
    },
    lastChecked: new Date().toISOString()
  }
  
  // Update local state when settings are loaded
  useEffect(() => {
    if (settings && typeof settings === 'object') {
      if (settings.general) {
        setGeneralSettings(prev => ({
          ...prev,
          ...settings.general,
          maintenanceMode: Boolean(settings.general.maintenanceMode ?? prev.maintenanceMode)
        }))
      }
      if (settings.commission) setCommissionSettings(settings.commission)
      if (settings.fulfillment) {
        setFulfillmentSettings(prev => ({
          ...prev,
          ...settings.fulfillment,
          autoTransfer: Boolean(settings.fulfillment.autoTransfer ?? prev.autoTransfer),
          priorityRouting: Boolean(settings.fulfillment.priorityRouting ?? prev.priorityRouting),
          splitOrders: Boolean(settings.fulfillment.splitOrders ?? prev.splitOrders)
        }))
      }
      if (settings.notifications) {
        setNotificationSettings(prev => ({
          newOrders: Boolean(settings.notifications.newOrders ?? prev.newOrders),
          vendorApplications: Boolean(settings.notifications.vendorApplications ?? prev.vendorApplications),
          lowInventory: Boolean(settings.notifications.lowInventory ?? prev.lowInventory),
          systemAlerts: Boolean(settings.notifications.systemAlerts ?? prev.systemAlerts),
          dailyReports: Boolean(settings.notifications.dailyReports ?? prev.dailyReports),
          weeklyAnalytics: Boolean(settings.notifications.weeklyAnalytics ?? prev.weeklyAnalytics),
          channels: {
            email: Boolean(settings.notifications.channels?.email ?? prev.channels.email),
            sms: Boolean(settings.notifications.channels?.sms ?? prev.channels.sms),
            push: Boolean(settings.notifications.channels?.push ?? prev.channels.push),
            slack: Boolean(settings.notifications.channels?.slack ?? prev.channels.slack)
          },
          recipients: settings.notifications.recipients || prev.recipients
        }))
      }
      if (settings.features) setFeatureFlags(settings.features)
    }
  }, [settings])
  
  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to save settings')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      alert('Settings saved successfully!')
    },
    onError: () => {
      alert('Failed to save settings. Please try again.')
    }
  })
  
  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'commission', name: 'Commission', icon: CurrencyDollarIcon },
    { id: 'fulfillment', name: 'Fulfillment', icon: TruckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'integrations', name: 'Integrations', icon: LinkIcon },
    { id: 'features', name: 'Features', icon: CpuChipIcon },
    { id: 'system', name: 'System', icon: CloudArrowUpIcon }
  ]
  
  const handleSave = () => {
    // Compile all settings into one object
    const allSettings = {
      general: generalSettings,
      commission: commissionSettings,
      fulfillment: fulfillmentSettings,
      notifications: notificationSettings,
      features: featureFlags
    }
    
    // Save to backend
    saveMutation.mutate(allSettings)
  }
  
  const toggleFeature = (featureId: string) => {
    setFeatureFlags(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    )
  }
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">System Settings</h2>
            <p className="text-gray-600 mt-1">
              Configure marketplace settings, features, and integrations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {generalSettings.maintenanceMode && (
              <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md">
                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Maintenance Mode Active</span>
              </div>
            )}
            <button
              onClick={() => queryClient.invalidateQueries()}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowPathIcon className="h-4 w-4 inline mr-2" />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
          
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                  <div className="text-sm text-gray-500">
                    Last saved: {new Date().toLocaleString()}
                  </div>
                </div>
                
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Platform Information</h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value={generalSettings.platformName}
                        onChange={(e) => setGeneralSettings({...generalSettings, platformName: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Platform Email
                      </label>
                      <input
                        type="email"
                        value={generalSettings.platformEmail}
                        onChange={(e) => setGeneralSettings({...generalSettings, platformEmail: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={generalSettings.supportEmail}
                        onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Logo URL
                      </label>
                      <input
                        type="text"
                        value={generalSettings.logo}
                        onChange={(e) => setGeneralSettings({...generalSettings, logo: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Localization */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Localization</h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Time Zone
                      </label>
                      <select
                        value={generalSettings.timeZone}
                        onChange={(e) => setGeneralSettings({...generalSettings, timeZone: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="Europe/London">GMT (London)</option>
                        <option value="Europe/Paris">CET (Paris)</option>
                        <option value="Asia/Tokyo">JST (Tokyo)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Currency
                      </label>
                      <select
                        value={generalSettings.currency}
                        onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Language
                      </label>
                      <select
                        value={generalSettings.language}
                        onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="pt">Portuguese</option>
                        <option value="ja">Japanese</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date Format
                      </label>
                      <select
                        value={generalSettings.dateFormat}
                        onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Maintenance Mode */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                    Maintenance Mode
                  </h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!!generalSettings.maintenanceMode}
                        onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable maintenance mode</span>
                    </label>
                    
                    {generalSettings.maintenanceMode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Maintenance Message
                        </label>
                        <textarea
                          value={generalSettings.maintenanceMessage}
                          onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMessage: e.target.value})}
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Commission Settings */}
            {activeTab === 'commission' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Commission Settings</h3>
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Configure revenue sharing</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Shop Partner Tiers */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Shop Partners (Tiered Commission)
                    </h4>
                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Revenue Range</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Rate</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefits</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-900">Bronze</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">$0 - $50,000</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-900">15%</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">Basic support, Standard analytics</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-900">Silver</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">$50,000 - $200,000</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-900">20%</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">Priority support, Advanced analytics</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-900">Gold</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">$200,000+</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-900">25%</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">Premium support, Full analytics suite</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Fixed Commission Rates */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Fixed Commission Rates</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="bg-white p-4 rounded-md border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700">Brand Partners</label>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="number"
                              value={commissionSettings.brandPartners.rate}
                              onChange={(e) => setCommissionSettings({
                                ...commissionSettings,
                                brandPartners: { rate: Number(e.target.value) }
                              })}
                              className="block w-20 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <span className="ml-2 text-sm text-gray-500">%</span>
                          </div>
                          <span className="text-xs text-gray-500">Fixed rate for all brand partners</span>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700">Distributor Partners</label>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="number"
                              value={commissionSettings.distributorPartners.rate}
                              onChange={(e) => setCommissionSettings({
                                ...commissionSettings,
                                distributorPartners: { rate: Number(e.target.value) }
                              })}
                              className="block w-20 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <span className="ml-2 text-sm text-gray-500">%</span>
                          </div>
                          <span className="text-xs text-gray-500">Volume-based pricing available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payout Settings */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Payout Configuration</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Payout Schedule
                        </label>
                        <select
                          value={commissionSettings.payoutSchedule}
                          onChange={(e) => setCommissionSettings({...commissionSettings, payoutSchedule: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Minimum Payout Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            value={commissionSettings.minimumPayout}
                            onChange={(e) => setCommissionSettings({...commissionSettings, minimumPayout: Number(e.target.value)})}
                            className="pl-7 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Payout Method
                        </label>
                        <select
                          value={commissionSettings.payoutMethod}
                          onChange={(e) => setCommissionSettings({...commissionSettings, payoutMethod: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="stripe">Stripe Connect</option>
                          <option value="bank">Direct Bank Transfer</option>
                          <option value="paypal">PayPal</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Hold Period (days)
                        </label>
                        <input
                          type="number"
                          value={commissionSettings.holdPeriod}
                          onChange={(e) => setCommissionSettings({...commissionSettings, holdPeriod: Number(e.target.value)})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">Days to hold funds before payout eligibility</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Fulfillment Settings */}
            {activeTab === 'fulfillment' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Fulfillment Settings</h3>
                  <div className="flex items-center space-x-2">
                    <TruckIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Configure delivery and routing</span>
                  </div>
                </div>
                
                {/* Capacity Settings */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Capacity Management</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Maximum Hub Capacity (%)
                      </label>
                      <input
                        type="number"
                        value={fulfillmentSettings.maxCapacity}
                        onChange={(e) => setFulfillmentSettings({...fulfillmentSettings, maxCapacity: Number(e.target.value)})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Stop accepting orders at this capacity</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Warning Threshold (%)
                      </label>
                      <input
                        type="number"
                        value={fulfillmentSettings.warningThreshold}
                        onChange={(e) => setFulfillmentSettings({...fulfillmentSettings, warningThreshold: Number(e.target.value)})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Alert when capacity reaches this level</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Delivery Target (hours)
                      </label>
                      <input
                        type="number"
                        value={fulfillmentSettings.deliveryTargetHours}
                        onChange={(e) => setFulfillmentSettings({...fulfillmentSettings, deliveryTargetHours: Number(e.target.value)})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Standard delivery time goal</p>
                    </div>
                  </div>
                </div>
                
                {/* Routing Configuration */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Routing Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Routing Algorithm
                      </label>
                      <select
                        value={fulfillmentSettings.routingAlgorithm}
                        onChange={(e) => setFulfillmentSettings({...fulfillmentSettings, routingAlgorithm: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="smart">Smart Routing (AI-optimized)</option>
                        <option value="distance">Distance-based</option>
                        <option value="capacity">Capacity-based</option>
                        <option value="cost">Cost-optimized</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!fulfillmentSettings.autoTransfer}
                          onChange={(e) => setFulfillmentSettings({...fulfillmentSettings, autoTransfer: e.target.checked})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable automatic order transfers</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!fulfillmentSettings.priorityRouting}
                          onChange={(e) => setFulfillmentSettings({...fulfillmentSettings, priorityRouting: e.target.checked})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable priority routing</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!fulfillmentSettings.splitOrders}
                          onChange={(e) => setFulfillmentSettings({...fulfillmentSettings, splitOrders: e.target.checked})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Allow order splitting</span>
                      </label>
                    </div>
                    
                    {fulfillmentSettings.splitOrders && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Maximum Split Count
                        </label>
                        <input
                          type="number"
                          value={fulfillmentSettings.maxSplitCount}
                          onChange={(e) => setFulfillmentSettings({...fulfillmentSettings, maxSplitCount: Number(e.target.value)})}
                          className="mt-1 block w-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Delivery Zones */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Delivery Zones</h4>
                  <div className="space-y-3">
                    {fulfillmentSettings.deliveryZones.map((zone) => (
                      <div key={zone.id} className="bg-white p-3 rounded-md border border-gray-200">
                        <div className="grid grid-cols-3 gap-4 items-center">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{zone.name}</span>
                            <p className="text-xs text-gray-500">Up to {zone.maxDistance} miles</p>
                          </div>
                          <div className="text-sm text-gray-600">
                            Surcharge: ${zone.surcharge}
                          </div>
                          <div className="text-right">
                            <button className="text-sm text-indigo-600 hover:text-indigo-500">
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-500">
                      + Add Delivery Zone
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                  <div className="flex items-center space-x-2">
                    <BellIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Configure alerts and communications</span>
                  </div>
                </div>
                
                {/* Notification Types */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Types</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!notificationSettings.newOrders}
                          onChange={(e) => setNotificationSettings({...notificationSettings, newOrders: e.target.checked})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-700">New Orders</span>
                          <p className="text-xs text-gray-500">Alerts when new orders are placed</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Real-time</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!notificationSettings.vendorApplications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, vendorApplications: e.target.checked})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-700">Vendor Applications</span>
                          <p className="text-xs text-gray-500">New vendor registration requests</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Instant</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!notificationSettings.lowInventory}
                          onChange={(e) => setNotificationSettings({...notificationSettings, lowInventory: e.target.checked})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-700">Low Inventory</span>
                          <p className="text-xs text-gray-500">Products below reorder threshold</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Hourly</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!notificationSettings.systemAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, systemAlerts: e.target.checked})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-700">System Alerts</span>
                          <p className="text-xs text-gray-500">Performance issues and errors</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Critical</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!notificationSettings.dailyReports}
                          onChange={(e) => setNotificationSettings({...notificationSettings, dailyReports: e.target.checked})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-700">Daily Reports</span>
                          <p className="text-xs text-gray-500">Summary of daily activities</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">6:00 AM</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!notificationSettings.weeklyAnalytics}
                          onChange={(e) => setNotificationSettings({...notificationSettings, weeklyAnalytics: e.target.checked})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-700">Weekly Analytics</span>
                          <p className="text-xs text-gray-500">Performance insights and trends</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Mondays</span>
                    </label>
                  </div>
                </div>
                
                {/* Notification Channels */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Channels</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!notificationSettings.channels.email}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            channels: { ...notificationSettings.channels, email: e.target.checked }
                          })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Email</span>
                      </div>
                      <span className="text-xs text-green-600">Active</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!notificationSettings.channels.sms}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            channels: { ...notificationSettings.channels, sms: e.target.checked }
                          })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">SMS</span>
                      </div>
                      <span className="text-xs text-gray-400">Setup required</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!notificationSettings.channels.push}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            channels: { ...notificationSettings.channels, push: e.target.checked }
                          })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Push Notifications</span>
                      </div>
                      <span className="text-xs text-green-600">Active</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!notificationSettings.channels.slack}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            channels: { ...notificationSettings.channels, slack: e.target.checked }
                          })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Slack</span>
                      </div>
                      <span className="text-xs text-gray-400">Not configured</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Platform security configuration</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        Most security settings are managed through environment variables and hosting configuration.
                        Contact your system administrator to modify these settings.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Security Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Security Status</h4>
                  <div className="space-y-3">
                    {[
                      {
                        name: 'Two-Factor Authentication',
                        status: 'enabled',
                        description: 'Additional security layer for admin accounts',
                        icon: KeyIcon
                      },
                      {
                        name: 'SSL Certificate',
                        status: 'active',
                        description: 'Valid until December 2024',
                        icon: ShieldCheckIcon
                      },
                      {
                        name: 'Session Management',
                        status: 'configured',
                        description: '30 minute timeout, secure cookies enabled',
                        icon: ClockIcon
                      },
                      {
                        name: 'API Rate Limiting',
                        status: 'active',
                        description: '1000 requests per hour per IP',
                        icon: ShieldCheckIcon
                      },
                      {
                        name: 'Database Encryption',
                        status: 'enabled',
                        description: 'At-rest encryption with SSL connections',
                        icon: KeyIcon
                      }
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.name} className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                          <div className="flex items-start">
                            <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {item.status === 'enabled' || item.status === 'active' ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            ) : item.status === 'configured' ? (
                              <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Security Recommendations */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Security Recommendations</h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                      <p className="ml-3 text-sm text-gray-600">Enforce strong password policies</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                      <p className="ml-3 text-sm text-gray-600">Regular security audits and updates</p>
                    </div>
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <p className="ml-3 text-sm text-gray-600">Enable IP whitelisting for admin access</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                      <p className="ml-3 text-sm text-gray-600">Monitor suspicious login attempts</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Integrations */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Third-Party Integrations</h3>
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Connected services and APIs</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {[
                    {
                      key: 'stripe',
                      name: 'Stripe',
                      description: 'Payment processing and vendor payouts',
                      status: 'connected',
                      color: 'purple',
                      icon: '💳',
                      features: ['Payments', 'Subscriptions', 'Connect', 'Webhooks'],
                      lastSync: '2 minutes ago'
                    },
                    {
                      key: 'sendgrid',
                      name: 'SendGrid',
                      description: 'Transactional email delivery',
                      status: 'connected',
                      color: 'blue',
                      icon: '📧',
                      features: ['Email API', 'Templates', 'Analytics'],
                      lastSync: '1 hour ago'
                    },
                    {
                      key: 's3',
                      name: 'AWS S3',
                      description: 'Cloud storage for images and files',
                      status: 'connected',
                      color: 'orange',
                      icon: '☁️',
                      features: ['Object Storage', 'CDN', 'Backups'],
                      lastSync: 'Real-time'
                    },
                    {
                      key: 'segment',
                      name: 'Segment',
                      description: 'Customer data platform and analytics',
                      status: 'disconnected',
                      color: 'green',
                      icon: '📊',
                      features: ['Analytics', 'CDP', 'Destinations'],
                      lastSync: 'Never'
                    },
                    {
                      key: 'twilio',
                      name: 'Twilio',
                      description: 'SMS notifications and verification',
                      status: 'disconnected',
                      color: 'red',
                      icon: '📱',
                      features: ['SMS', 'Voice', 'Verify'],
                      lastSync: 'Never'
                    },
                    {
                      key: 'google_maps',
                      name: 'Google Maps',
                      description: 'Location services and routing',
                      status: 'connected',
                      color: 'green',
                      icon: '🗺️',
                      features: ['Geocoding', 'Directions', 'Places'],
                      lastSync: 'Real-time'
                    }
                  ].map((integration) => (
                    <div key={integration.key} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 bg-${integration.color}-100 rounded-lg flex items-center justify-center`}>
                            <span className="text-2xl">{integration.icon}</span>
                          </div>
                          <div className="ml-3">
                            <h5 className="text-sm font-medium text-gray-900">{integration.name}</h5>
                            <p className="text-xs text-gray-500">{integration.description}</p>
                          </div>
                        </div>
                        {integration.status === 'connected' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Disconnected
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {integration.features.map((feature) => (
                            <span key={feature} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-gray-500">
                            {integration.status === 'connected' ? `Last sync: ${integration.lastSync}` : 'Not configured'}
                          </span>
                          <button className={`text-xs font-medium ${
                            integration.status === 'connected' 
                              ? 'text-gray-600 hover:text-gray-800' 
                              : 'text-indigo-600 hover:text-indigo-800'
                          }`}>
                            {integration.status === 'connected' ? 'Settings' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Features */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Feature Flags</h3>
                  <div className="flex items-center space-x-2">
                    <CpuChipIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Enable or disable platform features</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {featureFlags.map((feature) => (
                    <div key={feature.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h5 className="text-sm font-medium text-gray-900">{feature.name}</h5>
                            {feature.beta && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                Beta
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                          {feature.requirements && (
                            <div className="mt-2 text-xs text-gray-500">
                              Requirements: {feature.requirements.join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() => toggleFeature(feature.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                              feature.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                feature.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        Feature flags allow you to gradually roll out new features and test them with specific user groups.
                        Changes take effect immediately but may require a page refresh.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* System */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">System Health</h3>
                  <div className="flex items-center space-x-2">
                    <CloudArrowUpIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Infrastructure and performance</span>
                  </div>
                </div>
                
                {/* System Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">System Status</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      systemHealth.status === 'healthy' 
                        ? 'bg-green-100 text-green-800' 
                        : systemHealth.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {systemHealth.status === 'healthy' ? 'All Systems Operational' : 
                       systemHealth.status === 'warning' ? 'Performance Degraded' : 'Critical Issues'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Database</span>
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-xs text-gray-500">{systemHealth.checks.database.status}</p>
                      <p className="text-xs text-gray-500">Latency: {systemHealth.checks.database.latency}ms</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Cache</span>
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-xs text-gray-500">{systemHealth.checks.cache.status}</p>
                      <p className="text-xs text-gray-500">Memory: {systemHealth.checks.cache.memory}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Storage</span>
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-xs text-gray-500">{systemHealth.checks.storage.status}</p>
                      <p className="text-xs text-gray-500">Usage: {systemHealth.checks.storage.usage}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">API</span>
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-xs text-gray-500">{systemHealth.checks.api.status}</p>
                      <p className="text-xs text-gray-500">Uptime: {systemHealth.checks.api.uptime}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500 text-right">
                    Last checked: {new Date(systemHealth.lastChecked).toLocaleTimeString()}
                  </div>
                </div>
                
                {/* System Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">System Information</h4>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Environment</dt>
                      <dd className="mt-1 text-sm text-gray-900">Production</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Version</dt>
                      <dd className="mt-1 text-sm text-gray-900">2.0.3</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Node.js</dt>
                      <dd className="mt-1 text-sm text-gray-900">v18.17.0</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Database</dt>
                      <dd className="mt-1 text-sm text-gray-900">PostgreSQL 15.2</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Cache</dt>
                      <dd className="mt-1 text-sm text-gray-900">Redis 7.0</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Server</dt>
                      <dd className="mt-1 text-sm text-gray-900">Ubuntu 22.04 LTS</dd>
                    </div>
                  </dl>
                </div>
                
                {/* Maintenance Actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Maintenance Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700">
                      Clear Cache
                    </button>
                    <button className="w-full text-left px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700">
                      Reindex Search
                    </button>
                    <button className="w-full text-left px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700">
                      Run Database Maintenance
                    </button>
                    <button className="w-full text-left px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700">
                      Export System Logs
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Save Button */}
          {(activeTab === 'general' || activeTab === 'commission' || activeTab === 'fulfillment' || activeTab === 'notifications') && (
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="flex items-center">
                <InformationCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Changes will take effect immediately after saving
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}