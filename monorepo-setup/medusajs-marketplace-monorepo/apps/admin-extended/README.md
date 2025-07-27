# Admin Extensions

This package contains Medusa admin UI extensions for the marketplace functionality.

## Overview

Unlike the other apps in this monorepo, this is **NOT a standalone frontend application**. Instead, these are admin UI extensions that get integrated directly into the Medusa admin dashboard.

## Integration

To use these admin extensions:

1. **Backend Integration**: These extensions need to be registered in the Medusa backend configuration (`medusa-config.ts`):

```typescript
// In marketplace-backend-fresh/medusa-config.ts
export default defineConfig({
  admin: {
    extensions: [
      {
        path: "../medusajs-marketplace-monorepo/apps/admin-extended/src/admin",
      },
    ],
  },
  // ... rest of config
})
```

2. **Build Process**: The extensions are built as part of the Medusa admin build process, not separately.

## Current Extensions

### Vendor Management Widget
- **Location**: Appears in the products section of the admin
- **Purpose**: Provides quick access to vendor management functionality
- **Zone**: `product.list.before`

## Authentication

Admin extensions use the same authentication as the Medusa admin dashboard - they inherit the admin session and don't need separate API keys.

## Development

Since these are admin extensions, they are developed and tested within the context of the Medusa admin dashboard, not as a standalone app.

## Current Status

This is a **placeholder structure** for Medusa admin extensions. The actual implementation will depend on the specific admin extension API available in your Medusa v2 setup.

### Integration Notes

1. **No TypeScript Errors**: Removed non-existent `@medusajs/admin-sdk` dependencies
2. **Simple React Components**: Using standard React components with basic styling
3. **Configuration Export**: Exports widget configuration for potential integration

### Next Steps

When ready to implement admin extensions:
1. Check the official Medusa v2 documentation for admin extension APIs
2. Update the integration method in the backend configuration
3. Add proper styling and functionality to the widgets
4. Test the integration with the Medusa admin dashboard

### Development

This package is currently a placeholder and should not be run as a standalone application. The components are designed to be integrated into the Medusa admin interface.
