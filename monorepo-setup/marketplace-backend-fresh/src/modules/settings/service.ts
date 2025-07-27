import { MedusaService } from "@medusajs/framework/utils"
import { Settings } from "./models"

class SettingsModuleService extends MedusaService({
  Settings,
}) {
  async getSettingByKey(key: string) {
    const settings = await this.listSettings({ key } as any)
    return settings?.[0] || null
  }
  
  async upsertSettings(key: string, value: any) {
    const existing = await this.getSettingByKey(key)
    
    if (existing) {
      return await this.updateSettings({
        id: existing.id,
        value
      })
    }
    
    return await this.createSettings({
      key,
      value
    })
  }
}

export default SettingsModuleService