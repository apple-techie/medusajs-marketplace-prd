# MedusaJS Marketplace Setup Guide

## Current Status ✅

The monorepo structure has been successfully created with the following components:

### Completed Setup:
1. ✅ Turborepo monorepo structure
2. ✅ Apps configured:
   - `@marketplace/backend` - MedusaJS backend (copied from existing)
   - `@marketplace/storefront` - Next.js Starter (customer-facing)
   - `@marketplace/vendor-portal` - Vendor dashboard (skeleton)
   - `@marketplace/operations-hub` - Operations dashboard (skeleton)
   - `@marketplace/admin-extended` - Extended admin (skeleton)
3. ✅ Shared packages created:
   - `@marketplace/ui` - UI components with shadcn/ui
   - `@marketplace/core` - Business logic (commission calculations implemented)
   - `@marketplace/types` - TypeScript types
4. ✅ Commission system fully implemented
5. ✅ Dependencies installed with `npm install --legacy-peer-deps`

## Next Steps

### 1. Start the MedusaJS Backend
First, ensure your original MedusaJS backend is running:
```bash
cd /Users/andrewpeltekci/Projects/medusajs-marketplace
npm run dev
```

### 2. Get a Publishable Key
Create a publishable key in your MedusaJS admin:
1. Go to http://localhost:9000/admin
2. Navigate to Settings → API Keys
3. Create a new publishable key
4. Update `apps/storefront/.env.local` with the actual key:
   ```
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_actual_key_here
   ```

### 3. Start the Storefront
```bash
cd apps/storefront
npm run dev
```
The storefront will run on http://localhost:8000

### 4. Build Packages (Optional)
To build the TypeScript packages:
```bash
cd packages/types
npm run build

cd ../marketplace-core
npm run build

cd ../ui
npm run build
```

## Known Issues & Solutions

### Issue: "turbo: command not found"
**Solution**: Use `npx turbo` instead of just `turbo`:
```bash
npx turbo dev
npx turbo build
```

### Issue: Dependency conflicts
**Solution**: Always use `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
```

### Issue: Backend build fails
**Note**: The backend doesn't need to be built for development. Just run it with:
```bash
cd apps/backend
npm run dev
```

## Development Workflow

### Working on Shared Packages
When developing shared packages, run in watch mode:
```bash
cd packages/ui
npm run dev  # This runs tsup in watch mode
```

### Running Multiple Apps
To run multiple apps simultaneously, open separate terminals:

**Terminal 1 - Backend:**
```bash
cd /Users/andrewpeltekci/Projects/medusajs-marketplace
npm run dev
```

**Terminal 2 - Storefront:**
```bash
cd /Users/andrewpeltekci/Projects/medusajs-marketplace-prd/monorepo-setup/medusajs-marketplace-monorepo/apps/storefront
npm run dev
```

**Terminal 3 - Vendor Portal (when ready):**
```bash
cd apps/vendor-portal
npm run dev
```

## Commission Structure Reference

The commission system is already implemented in `@marketplace/core`:

```typescript
// Shop Partners
Bronze: 15% (< $15,000/month)
Silver: 18% ($15,000 - $50,000/month)
Gold: 22% ($50,000+/month)
Gold+: 25% (Special status)

// Brand Partners
Starter: 10% ($0 - $100k/month)
Growth: 15% ($100k - $500k/month)
Enterprise: 20% ($500k+/month)

// Distributors
Pioneer: 3% (first 6 months)
Standard: 10%
Volume discounts: 10% → 7% → 5% → 3%
```

## Directory Structure
```
/Users/andrewpeltekci/Projects/
├── medusajs-marketplace/           # Original MedusaJS backend
└── medusajs-marketplace-prd/
    └── monorepo-setup/
        └── medusajs-marketplace-monorepo/  # New monorepo
            ├── apps/
            ├── packages/
            └── turbo.json
```

## Important Files
- Backend env: `/Users/andrewpeltekci/Projects/medusajs-marketplace/.env`
- Storefront env: `apps/storefront/.env.local`
- Commission logic: `packages/marketplace-core/src/commission/index.ts`
- Vendor types: `packages/types/src/index.ts`

## Support

If you encounter any issues:
1. Check the terminal output for specific error messages
2. Ensure all environment variables are set correctly
3. Make sure PostgreSQL and Redis are running
4. Use `--legacy-peer-deps` for any npm install commands