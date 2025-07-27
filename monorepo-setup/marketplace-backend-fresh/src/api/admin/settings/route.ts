import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { SETTINGS_MODULE } from "../../../modules/settings"
import SettingsModuleService from "../../../modules/settings/service"

// Settings are stored in a special system configuration
const SETTINGS_KEY = 'marketplace_settings'

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const settingsService: SettingsModuleService = req.scope.resolve(SETTINGS_MODULE)
  
  try {
    // Get current settings or return defaults
    const settings = await settingsService.getSettingByKey(SETTINGS_KEY)
    
    const defaultSettings = {
      general: {
        platformName: 'Multi-Vendor Marketplace',
        platformEmail: 'admin@marketplace.com',
        supportEmail: 'support@marketplace.com',
        timeZone: 'America/Los_Angeles',
        currency: 'USD',
        language: 'en',
      },
      commission: {
        shopPartners: {
          bronze: { min: 0, max: 50000, rate: 15 },
          silver: { min: 50000, max: 200000, rate: 20 },
          gold: { min: 200000, max: Infinity, rate: 25 }
        },
        brandPartners: { rate: 10 },
        distributorPartners: { rate: 5 }
      },
      fulfillment: {
        maxCapacity: 90,
        warningThreshold: 75,
        autoTransfer: true,
        priorityRouting: true,
        deliveryTargetHours: 3
      },
      notifications: {
        newOrders: true,
        vendorApplications: true,
        lowInventory: true,
        systemAlerts: true,
        dailyReports: false,
        weeklyAnalytics: true
      },
      security: {
        twoFactorAuth: true,
        sessionTimeout: 30,
        apiRateLimiting: true,
        sslEnabled: true
      },
      integrations: {
        stripe: { status: 'connected', lastSync: new Date().toISOString() },
        sendgrid: { status: 'connected', lastSync: new Date().toISOString() },
        s3: { status: 'connected', lastSync: new Date().toISOString() },
        analytics: { status: 'not_configured', lastSync: null }
      }
    }
    
    res.json(settings?.value || defaultSettings)
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching settings", 
      error: error.message 
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const settingsService: SettingsModuleService = req.scope.resolve(SETTINGS_MODULE)
  
  try {
    const updates = req.body
    
    // Get current settings
    const currentSettings = await settingsService.getSettingByKey(SETTINGS_KEY)
    
    // Merge updates with current settings
    const newSettings = {
      ...(currentSettings?.value || {}),
      ...(updates as Record<string, any>),
      updatedAt: new Date().toISOString()
    }
    
    // Save settings
    await settingsService.upsertSettings(SETTINGS_KEY, newSettings)
    
    res.json({ 
      success: true, 
      settings: newSettings 
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Error saving settings", 
      error: error.message 
    })
  }
}