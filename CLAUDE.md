# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive Product Requirements Document (PRD) for a MedusaJS-powered multi-vendor marketplace platform. The documentation is structured for parallel development using git worktrees and provides detailed specifications for all marketplace components.

## Architecture & Tech Stack

### Backend
- **Framework**: MedusaJS 2.0 (Node.js e-commerce framework)
- **Database**: PostgreSQL 14+ with TypeORM
- **Cache**: Redis 6+
- **Queue**: Bull/Redis
- **Real-time**: Socket.io
- **Payment**: Stripe Connect for multi-vendor payment splitting

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Styling**: Tailwind CSS

### Infrastructure
- **Hosting**: AWS ECS/Fargate
- **CDN**: CloudFront
- **Storage**: S3
- **Monitoring**: DataDog/Sentry

## Key Architectural Patterns

### MedusaJS Module Structure
The platform extends MedusaJS core with custom modules:
- `affiliate-marketplace`: Commission tracking and tier management
- `delivery-network`: Driver management and route optimization
- `vendor-management`: Multi-vendor support (shop, brand, distributor)
- `unified-catalog`: Product aggregation across vendors
- `stripe-connect`: Payment splitting and vendor payouts

### API Architecture
- RESTful design with `/v1` versioning
- JWT authentication with role-based access
- WebSocket support for real-time updates (orders, inventory, delivery tracking)
- Rate limiting based on user roles

## Development Commands

Since this is a PRD repository without implementation code, common commands will depend on the implementation approach:

### For MedusaJS Backend Development
```bash
# Initial setup (when implementing)
npx create-medusa-app@latest marketplace --with-nextjs-starter

# Development
npm run dev:backend   # Start MedusaJS server
npm run dev:admin    # Start admin dashboard
npm run dev:storefront # Start Next.js storefront

# Database
npm run migration:create -- CreateVendorTables
npm run migration:run
npm run seed

# Testing
npm run test
npm run test:integration
```

### For Git Worktree Development
```bash
# Create worktrees for parallel development
git worktree add ../marketplace-core -b feature/core-architecture
git worktree add ../marketplace-vendors -b feature/vendor-management
git worktree add ../marketplace-orders -b feature/order-management

# List all worktrees
git worktree list

# Remove worktree after merging
git worktree remove ../marketplace-vendors
```

## Key Business Logic

### Vendor Types & Commission Structure
1. **Shop Partners**: Affiliate model with 15-25% commission tiers based on monthly revenue
2. **Brand Partners**: Direct suppliers managing their own inventory
3. **Distributor Partners**: Fulfillment centers handling multi-brand inventory

### Order Flow
1. Customer places order (potentially through shop referral)
2. System routes order items to optimal fulfillment locations
3. Distributor/brand fulfills their items
4. Driver network handles last-mile delivery
5. Commission calculated and distributed post-delivery

### Age Verification
- Configurable age gates (18+/21+) based on product categories
- Multiple verification methods supported
- Session-based verification with compliance logging

## Testing Approach

When implementing, follow these patterns:

```bash
# Unit tests for services
npm run test:unit -- commission-calculator.spec.ts

# Integration tests for API endpoints
npm run test:integration -- /api/vendors

# E2E tests for critical flows
npm run test:e2e -- checkout-flow.spec.ts
```

## Important Implementation Notes

1. **Use MedusaJS Next.js Starter** as the base for the storefront (see IMPLEMENTATION-RECOMMENDATIONS.md)
2. **Multi-vendor considerations**: Every API endpoint must respect vendor context and permissions
3. **Payment splitting**: All transactions go through Stripe Connect for automated commission handling
4. **Real-time requirements**: Order tracking, inventory updates, and driver locations need WebSocket implementation
5. **Fulfillment routing**: The algorithm in `02-FULFILLMENT-ROUTING.md` is critical for operational efficiency

## PRD Navigation

The documentation is organized into 11 main sections:
- `01-CORE-ARCHITECTURE/`: Platform overview, system design, database schema
- `02-VENDOR-MANAGEMENT/`: Vendor types, commissions, onboarding, dashboards
- `03-ORDER-MANAGEMENT/`: Order flow, fulfillment routing, operations
- `04-CUSTOMER-EXPERIENCE/`: Age verification, customer dashboard
- `05-OPERATIONS-HUB/`: Central operations dashboard
- `06-UI-UX/`: Design system and component specifications
- `07-COMMERCE-FEATURES/`: Product catalog, cart, payments
- `08-DELIVERY-NETWORK/`: Driver management, tracking, routing
- `09-ANALYTICS-REPORTING/`: Business intelligence
- `10-SECURITY-COMPLIANCE/`: Security architecture
- `11-TECHNICAL-SPECIFICATIONS/`: API documentation

Refer to `PRD-INDEX.md` for detailed navigation and `README.md` for implementation phases.