import { SETTINGS_MODULE } from "../modules/settings"
import SettingsModuleService from "../modules/settings/service"

export default async function testSettingsPersistence({ container }: { container: any }) {
  const settingsService: SettingsModuleService = container.resolve(SETTINGS_MODULE)
  
  console.log("Testing settings persistence...")
  
  // Test notification settings
  const testNotificationSettings = {
    general: {
      platformName: 'Multi-Vendor Marketplace',
      platformEmail: 'admin@marketplace.com',
      supportEmail: 'support@marketplace.com',
      timeZone: 'America/Los_Angeles',
      currency: 'USD',
      language: 'en',
    },
    notifications: {
      newOrders: false,  // Changed from true
      vendorApplications: true,
      lowInventory: false,  // Changed from true
      systemAlerts: true,
      dailyReports: true,  // Changed from false
      weeklyAnalytics: false  // Changed from true
    },
    commission: {
      shopPartners: {
        bronze: { min: 0, max: 50000, rate: 15 },
        silver: { min: 50000, max: 200000, rate: 20 },
        gold: { min: 200000, max: Infinity, rate: 25 }
      },
      brandPartners: { rate: 10 },
      distributorPartners: { rate: 5 }
    }
  }
  
  console.log("Saving test settings...")
  await settingsService.upsertSettings('marketplace_settings', testNotificationSettings)
  
  // Retrieve and verify
  console.log("\nRetrieving saved settings...")
  const savedSettings = await settingsService.getSettingByKey('marketplace_settings')
  
  if (savedSettings) {
    console.log("\nSaved settings found:")
    console.log("- General settings:", savedSettings.value.general)
    console.log("- Notification settings:", savedSettings.value.notifications)
    console.log("- Commission settings:", savedSettings.value.commission)
    
    // Verify notification settings were saved correctly
    const notifications = savedSettings.value.notifications as any
    console.log("\nVerifying notification settings:")
    console.log(`- newOrders: ${notifications.newOrders} (should be false)`)
    console.log(`- dailyReports: ${notifications.dailyReports} (should be true)`)
    console.log(`- weeklyAnalytics: ${notifications.weeklyAnalytics} (should be false)`)
    
    if (notifications.newOrders === false && 
        notifications.dailyReports === true && 
        notifications.weeklyAnalytics === false) {
      console.log("\n✅ Settings persistence is working correctly!")
    } else {
      console.log("\n❌ Settings were not saved correctly")
    }
  } else {
    console.log("\n❌ No settings found")
  }
}