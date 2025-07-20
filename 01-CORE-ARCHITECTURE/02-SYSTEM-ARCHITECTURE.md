# System Architecture

## Overview

The MedusaJS-powered affiliate marketplace platform is built on a modular architecture that extends MedusaJS's core e-commerce functionality with custom modules for vendor management, commission tracking, and delivery orchestration.

## High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  MedusaJS API   │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                         │
         │                       ├─── Stripe Connect ─────┤
         │                       ├─── DoorDash API ──────┤
         │                       ├─── SMS (Twilio) ──────┤
         │                       └─── Redis Cache ───────┘
         │
         └─── CDN (Images/Static Assets)
```

## MedusaJS Module Architecture

```typescript
// src/modules/index.ts
export const modules = {
  // Core MedusaJS modules
  productModule: {
    resolve: "@medusajs/product",
  },
  inventoryModule: {
    resolve: "@medusajs/inventory",
  },
  cartModule: {
    resolve: "@medusajs/cart",
  },
  
  // Custom modules
  affiliateMarketplace: {
    resolve: "./modules/affiliate-marketplace",
    options: {
      enableCommissionTracking: true,
      tierUpdateFrequency: "daily",
    },
  },
  deliveryNetwork: {
    resolve: "./modules/delivery-network",
    options: {
      providers: ["internal", "doordash"],
      defaultProvider: "internal",
    },
  },
  vendorManagement: {
    resolve: "./modules/vendor-management",
    options: {
      vendorTypes: ["shop", "brand", "distributor"],
    },
  },
}
```

## Service Layer Architecture

```
src/
├── api/
│   ├── admin/
│   │   ├── vendors/
│   │   ├── commissions/
│   │   └── analytics/
│   ├── store/
│   │   ├── products/
│   │   ├── cart/
│   │   └── checkout/
│   └── vendor/
│       ├── dashboard/
│       ├── products/
│       └── orders/
├── modules/
│   ├── affiliate-marketplace/
│   │   ├── models/
│   │   │   ├── shop-tier.ts
│   │   │   ├── commission-rule.ts
│   │   │   └── payout.ts
│   │   ├── services/
│   │   │   ├── commission-calculator.ts
│   │   │   ├── tier-manager.ts
│   │   │   └── payout-processor.ts
│   │   └── subscribers/
│   │       ├── order-completed.ts
│   │       └── monthly-tier-update.ts
│   ├── loyalty-points/
│   │   ├── models/
│   │   │   ├── points-balance.ts
│   │   │   ├── points-transaction.ts
│   │   │   └── rewards-tier.ts
│   │   ├── services/
│   │   │   ├── points-calculator.ts
│   │   │   ├── points-redeemer.ts
│   │   │   └── rewards-manager.ts
│   │   └── subscribers/
│   │       └── order-points-award.ts
│   ├── unified-catalog/
│   │   ├── models/
│   │   │   ├── master-product.ts
│   │   │   ├── product-variant.ts
│   │   │   └── vendor-product-mapping.ts
│   │   ├── services/
│   │   │   ├── product-matcher.ts
│   │   │   ├── catalog-synchronizer.ts
│   │   │   └── price-aggregator.ts
│   │   └── subscribers/
│   │       └── product-sync.ts
│   ├── stripe-connect/
│   │   ├── models/
│   │   │   ├── connected-account.ts
│   │   │   ├── payout-schedule.ts
│   │   │   └── platform-fee.ts
│   │   ├── services/
│   │   │   ├── account-onboarding.ts
│   │   │   ├── payment-splitter.ts
│   │   │   └── transfer-manager.ts
│   │   └── webhooks/
│   │       └── stripe-webhook-handler.ts
│   ├── delivery-network/
│   │   ├── models/
│   │   │   ├── driver.ts
│   │   │   ├── delivery-route.ts
│   │   │   └── delivery-assignment.ts
│   │   ├── services/
│   │   │   ├── driver-manager.ts
│   │   │   ├── route-optimizer.ts
│   │   │   ├── delivery-tracker.ts
│   │   │   └── provider-selector.ts
│   │   ├── providers/
│   │   │   ├── internal-driver.ts
│   │   │   ├── doordash.ts
│   │   │   └── provider-interface.ts
│   │   └── subscribers/
│   │       └── order-fulfillment.ts
│   └── vendor-management/
│       ├── models/
│       │   ├── vendor.ts
│       │   ├── vendor-product.ts
│       │   └── vendor-settings.ts
│       ├── services/
│       │   ├── vendor-onboarding.ts
│       │   ├── fee-calculator.ts
│       │   └── vendor-analytics.ts
│       └── strategies/
│           ├── shop-strategy.ts
│           ├── brand-strategy.ts
│           └── distributor-strategy.ts
```

## Key Architectural Decisions

### 1. MedusaJS Extension Strategy
- Leverage MedusaJS core modules for standard e-commerce functionality
- Build custom modules for marketplace-specific features
- Use MedusaJS's event system for module communication

### 2. Multi-Vendor Architecture
- Separate vendor contexts with role-based access control
- Unified product catalog with vendor-specific pricing
- Commission calculation at order completion

### 3. Payment Architecture
- Stripe Connect for automated payment splitting
- Platform holds funds initially, then distributes
- Separate payout schedules for different vendor types

### 4. Delivery Network
- Provider abstraction layer for multiple delivery services
- Internal driver network as primary, third-party as fallback
- Real-time tracking and status updates

## Infrastructure Requirements

### Production Environment
```yaml
production:
  compute:
    - type: "AWS ECS Fargate"
      instances: 4
      cpu: "2 vCPU"
      memory: "4 GB"
      auto_scaling:
        min: 2
        max: 10
        target_cpu: 70
    
  database:
    - type: "AWS RDS PostgreSQL"
      version: "14.x"
      instance: "db.r6g.xlarge"
      storage: "500 GB"
      multi_az: true
      read_replicas: 2
    
  cache:
    - type: "AWS ElastiCache Redis"
      version: "7.x"
      node_type: "cache.r6g.large"
      nodes: 3
      cluster_mode: true
    
  storage:
    - type: "AWS S3"
      buckets:
        - name: "platform-assets"
          purpose: "Product images, documents"
        - name: "platform-backups"
          purpose: "Database backups"
    
  cdn:
    - type: "AWS CloudFront"
      origins:
        - "S3 assets bucket"
        - "Application load balancer"
```

### Development Environment
```yaml
development:
  local:
    - docker_compose: true
    - services:
        - medusa_backend
        - postgres
        - redis
        - minio (S3 compatible)
    
  staging:
    - type: "AWS ECS"
      instances: 2
      database: "RDS PostgreSQL (smaller instance)"
      cache: "ElastiCache Redis (single node)"
```

## Security Architecture

### Network Security
```yaml
security_groups:
  - name: "medusa-backend"
    ingress:
      - port: 443
        source: "0.0.0.0/0"  # HTTPS from anywhere
      - port: 9000
        source: "10.0.0.0/16"  # Internal API
    egress:
      - port: 5432
        destination: "rds-security-group"  # PostgreSQL
      - port: 6379
        destination: "redis-security-group"  # Redis
      - port: 443
        destination: "0.0.0.0/0"  # External APIs
        
  - name: "rds-postgres"
    ingress:
      - port: 5432
        source: "medusa-backend"
        
  - name: "redis-cache"
    ingress:
      - port: 6379
        source: "medusa-backend"
```

### API Security
- JWT-based authentication with role-based permissions
- API rate limiting per endpoint and user type
- Request validation and sanitization
- CORS configuration for frontend domains

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers for easy scaling
- Database read replicas for query distribution
- Redis cluster for cache scaling
- CDN for static asset delivery

### Performance Optimization
- Database query optimization with proper indexing
- Redis caching for frequently accessed data
- Lazy loading and pagination for large datasets
- Background job processing for heavy operations

### Monitoring and Observability
- Application performance monitoring with Sentry
- Infrastructure monitoring with CloudWatch
- Custom business metrics tracking
- Real-time alerting for critical issues
