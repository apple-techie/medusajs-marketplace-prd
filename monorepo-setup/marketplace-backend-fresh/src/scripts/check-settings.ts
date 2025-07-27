import { SETTINGS_MODULE } from "../modules/settings"
import SettingsModuleService from "../modules/settings/service"

export default async function checkSettings({ container }) {
  const settingsService: SettingsModuleService = container.resolve(SETTINGS_MODULE)
  
  console.log("Checking settings module...")
  
  try {
    // List all settings
    const allSettings = await settingsService.listSettings()
    console.log("All settings in database:", allSettings)
    
    // Try to get marketplace settings
    const marketplaceSettings = await settingsService.getSettingByKey('marketplace_settings')
    console.log("Marketplace settings:", marketplaceSettings)
  } catch (error) {
    console.log("No settings found yet, which is expected if none have been saved")
  }
  
  // Test creating a setting
  console.log("\nTesting settings creation...")
  const testSetting = await settingsService.upsertSettings('test_key', { test: 'value' })
  console.log("Created test setting:", testSetting)
  
  // Verify it was saved
  const retrieved = await settingsService.getSettingByKey('test_key')
  console.log("Retrieved test setting:", retrieved)
}