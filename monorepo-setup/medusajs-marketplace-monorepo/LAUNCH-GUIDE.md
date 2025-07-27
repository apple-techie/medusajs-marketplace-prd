# MedusaJS Marketplace Monorepo Launch Guide

## Prerequisites

Before launching the applications, ensure you have:

1. **External Services Running**:
   - PostgreSQL (port 5432)
   - Redis (port 6379)

2. **Environment Variables Configured**:
   - `/apps/backend/.env` (MedusaJS backend)
   - `/apps/storefront/.env.local`
   - `/apps/vendor-portal/.env.local`
   - `/apps/operations-hub/.env.local`

## Launch Commands

### Launch All Applications Simultaneously
```bash
npm run dev:all
```

This will start all applications in parallel:
- **MedusaJS Backend**: http://localhost:9000 (Admin: http://localhost:9000/app)
- **Storefront**: http://localhost:8000
- **Vendor Portal**: http://localhost:3001
- **Operations Hub**: http://localhost:3002

### Launch Individual Applications

```bash
# Launch only the storefront
npm run dev:storefront

# Launch only the vendor portal
npm run dev:vendor

# Launch only the operations hub
npm run dev:ops
```

### Development Workflow

1. **Ensure External Services are Running**:
   - PostgreSQL and Redis must be running
   - Check connection in `/apps/backend/.env`

2. **Launch All Applications**:
   ```bash
   # From the monorepo root directory
   npm run dev:all
   ```

3. **Access the Applications**:
   - **Customer Storefront**: http://localhost:8000
     - Browse products, add to cart, checkout
     - Age verification for restricted products
   
   - **Vendor Portal**: http://localhost:3001
     - Choose vendor type (Shop/Brand/Distributor)
     - Access vendor-specific dashboards
     - Track commissions and sales
   
   - **Operations Hub**: http://localhost:3002
     - Platform-wide analytics
     - Order management
     - Vendor management
     - Fulfillment network monitoring

## Port Configuration

If you need to change the default ports, update the `dev` script in each app's `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3001"  // Change port number here
  }
}
```

## Troubleshooting

### "Cannot fetch regions" error
- Ensure MEDUSA_BACKEND_URL is set in `.env.local` (without NEXT_PUBLIC_ prefix for server-side)
- Verify the MedusaJS backend is running on port 9000

### Module resolution errors
- Run `npm install` in the root directory
- Ensure all workspace dependencies are properly linked

### Port conflicts
- Check if ports 8000, 3001, or 3002 are already in use
- Use `lsof -i :PORT` to find processes using specific ports

### SWC Binary Error
If you see "Failed to load SWC binary for darwin/arm64":
- This is a known issue with Next.js on Apple Silicon
- Try reinstalling dependencies: `rm -rf node_modules && npm install`
- Or install directly in each app folder if needed

## Next Steps

Once all applications are running:

1. **Set up regions in MedusaJS Admin** (http://localhost:7001)
2. **Create sample products** with age restrictions
3. **Register test vendors** of each type
4. **Place test orders** to verify the flow

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Storefront    │     │  Vendor Portal   │     │ Operations Hub  │
│  (Port 8000)    │     │  (Port 3001)     │     │  (Port 3002)    │
└────────┬────────┘     └────────┬─────────┘     └────────┬────────┘
         │                       │                          │
         └───────────────────────┴──────────────────────────┘
                                 │
                    ┌────────────┴─────────────┐
                    │   MedusaJS Backend API   │
                    │      (Port 9000)         │
                    │   (In same monorepo)     │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴─────────────┐
                    │   PostgreSQL & Redis     │
                    │     (External DBs)       │
                    └──────────────────────────┘
```