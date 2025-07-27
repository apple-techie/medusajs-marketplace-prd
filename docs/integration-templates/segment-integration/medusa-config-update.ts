// Add this to your medusa-config.ts file

import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  projectConfig: {
    // ... existing config
  },
  modules: [
    // ... existing modules
    {
      resolve: "./modules/marketplace"
    },
    {
      resolve: "./modules/segment",
      options: {
        writeKey: process.env.SEGMENT_WRITE_KEY,
        flushAt: 20, // Number of events to batch before sending
        flushInterval: 10000, // Time in ms before sending events
      }
    }
  ]
})