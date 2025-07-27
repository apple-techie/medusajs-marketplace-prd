# Marketplace Cleanup and Deployment Guide

## Current Project Structure

You have two main setups that we'll consolidate:

1. **Active Backend**: `marketplace-backend-fresh/` - This is your working MedusaJS backend with all custom modules
2. **Active Monorepo**: `medusajs-marketplace-monorepo/` - Contains your three frontend applications
3. **Old/Duplicate Directories** to remove:
   - `medusajs-marketplace-backend/` - Old backend attempt
   - `marketplace-backend-fresh-storefront/` - Standalone storefront (using monorepo version instead)

## Cleanup Steps

### 1. Remove Old Directories
```bash
# Navigate to monorepo-setup directory
cd /Users/andrewpeltekci/Projects/medusajs-marketplace-prd/monorepo-setup/

# Remove old backend
rm -rf medusajs-marketplace-backend/

# Remove standalone storefront (we're using the monorepo version)
rm -rf marketplace-backend-fresh-storefront/
```

### 2. Clean Up Temporary Files
```bash
# Remove any log files
rm -f marketplace-backend-fresh/*.log
rm -f marketplace-backend-fresh/stripe-*.log

# Clean node_modules if needed to save space
# cd marketplace-backend-fresh && rm -rf node_modules
# cd medusajs-marketplace-monorepo && rm -rf node_modules
```

## Deployment Structure

Your production-ready structure should be:

```
medusajs-marketplace/
├── backend/                    # MedusaJS backend (from marketplace-backend-fresh)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── marketplace/   # Vendor management
│   │   │   └── age_verification/
│   │   └── scripts/
│   ├── medusa-config.ts
│   ├── package.json
│   └── .env
└── apps/                      # Frontend applications (from monorepo)
    ├── storefront/            # Customer-facing store
    ├── vendor-portal/         # Vendor dashboard
    └── operations-hub/        # Admin operations center
```

## Deployment Options

### Option 1: Docker Deployment (Recommended for Production)

Create a `docker-compose.yml` in your project root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "9000:9000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    depends_on:
      - postgres
      - redis

  storefront:
    build: ./apps/storefront
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: http://backend:9000
      NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: ${PUBLISHABLE_KEY}

  vendor-portal:
    build: ./apps/vendor-portal
    ports:
      - "3001:3001"
    environment:
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: http://backend:9000

  operations-hub:
    build: ./apps/operations-hub
    ports:
      - "3002:3002"
    environment:
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: http://backend:9000

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: marketplace_medusa
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}

volumes:
  postgres_data:
```

### Option 2: Cloud Deployment

#### Backend (MedusaJS) - Deploy to Railway/Render/AWS

1. **Railway Deployment**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init

# Deploy
railway up
```

2. **Environment Variables Required**:
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
COOKIE_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
ADMIN_CORS=https://admin.yourdomain.com
STORE_CORS=https://store.yourdomain.com
AUTH_CORS=https://store.yourdomain.com,https://vendor.yourdomain.com
```

#### Frontend Apps - Deploy to Vercel

1. **Deploy Storefront**:
```bash
cd apps/storefront
vercel --prod
```

2. **Deploy Vendor Portal**:
```bash
cd apps/vendor-portal
vercel --prod
```

3. **Deploy Operations Hub**:
```bash
cd apps/operations-hub
vercel --prod
```

### Option 3: AWS Infrastructure

Use AWS ECS for backend and Amplify/S3+CloudFront for frontends:

```bash
# Backend on ECS
aws ecs create-cluster --cluster-name marketplace-cluster
# ... ECS task definitions and services

# Frontend on Amplify
amplify init
amplify add hosting
amplify publish
```

## Pre-Deployment Checklist

- [ ] Update all `.env` files with production values
- [ ] Set up production database (PostgreSQL 14+)
- [ ] Set up production Redis instance
- [ ] Configure Stripe webhooks for production URLs
- [ ] Update CORS settings in medusa-config.ts
- [ ] Set up SSL certificates for all domains
- [ ] Configure CDN for static assets
- [ ] Set up monitoring (DataDog/Sentry)
- [ ] Configure backup strategies

## Local Development Commands

To run everything locally:

```bash
# Terminal 1: Backend
cd marketplace-backend-fresh
npm run dev

# Terminal 2: Storefront
cd medusajs-marketplace-monorepo
npm run dev:storefront

# Terminal 3: Vendor Portal
cd medusajs-marketplace-monorepo
npm run dev:vendor

# Terminal 4: Operations Hub
cd medusajs-marketplace-monorepo
npm run dev:operations

# Terminal 5: Stripe Webhooks (if needed)
./stripe-webhooks.sh
```

## Final Directory Structure After Cleanup

```
monorepo-setup/
├── marketplace-backend-fresh/     # Keep this - your backend
├── medusajs-marketplace-monorepo/ # Keep this - your frontends
├── BACKEND-SOLUTION.md
├── MONOREPO-SETUP-SUMMARY.md
├── SETUP-GUIDE.md
└── CLEANUP-AND-DEPLOYMENT-GUIDE.md
```

## Next Steps

1. Clean up old directories as shown above
2. Choose your deployment strategy
3. Set up CI/CD pipelines
4. Configure production environment variables
5. Deploy!