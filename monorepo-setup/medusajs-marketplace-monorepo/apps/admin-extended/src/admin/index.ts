import VendorManagementWidget, { config as vendorManagementConfig } from "./widgets/vendor-management"

// Export admin extensions for Medusa v2
export const widgets = [
  {
    name: "vendor-management",
    Component: VendorManagementWidget,
    config: vendorManagementConfig,
  },
]

// Default export for Medusa admin extensions
export default {
  widgets,
}
