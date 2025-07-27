# MedusaJS Marketplace Architecture & Style Guide

This document defines the architectural patterns and code conventions for the MedusaJS multi-vendor marketplace to ensure consistency across all development.

## Table of Contents
1. [Core Architecture](#core-architecture)
2. [Backend Patterns](#backend-patterns)
3. [Frontend Patterns](#frontend-patterns)
4. [Code Style Conventions](#code-style-conventions)
5. [Extension Guidelines](#extension-guidelines)
6. [Integration Patterns](#integration-patterns)
7. [Quality Standards](#quality-standards)

## Core Architecture

### Technology Stack
- **Backend**: MedusaJS v2.0 (Node.js + TypeScript)
- **Frontend**: Next.js 14 (App Router + TypeScript)
- **Database**: PostgreSQL 14+
- **Cache**: Redis 6+
- **Styling**: Tailwind CSS v4
- **Package Manager**: npm
- **Monorepo**: npm workspaces

### Project Structure
```
/
├── monorepo-setup/
│   ├── marketplace-backend-fresh/          # MedusaJS backend
│   │   ├── src/
│   │   │   ├── api/                      # API routes
│   │   │   ├── modules/                  # Custom modules
│   │   │   ├── services/                 # Additional services
│   │   │   └── scripts/                  # Utility scripts
│   │   └── medusa-config.ts              # Core configuration
│   │
│   └── medusajs-marketplace-monorepo/    # Frontend apps
│       ├── apps/
│       │   ├── storefront/               # Customer app
│       │   ├── vendor-portal/            # Vendor app
│       │   └── operations-hub/           # Admin app
│       └── packages/
│           ├── ui/                       # Shared components
│           ├── types/                    # Shared TypeScript types
│           └── marketplace-core/         # Shared business logic
```

## Backend Patterns

### 1. MedusaJS Module Pattern

**ALWAYS** create custom functionality as MedusaJS modules:

```typescript
// src/modules/[module-name]/models/[entity].ts
import { model } from "@medusajs/framework/utils"

export const Entity = model.define("entity_name", {
  id: model.id().primaryKey(),
  name: model.text(),
  // Use MedusaJS field types - never define created_at/updated_at
})
```

```typescript
// src/modules/[module-name]/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import { Entity } from "./models"

class ModuleNameService extends MedusaService({
  Entity,
}) {
  // Custom methods here
  async customMethod() {
    // Use generated CRUD methods: listEntities, retrieveEntity, etc.
  }
}

export default ModuleNameService
```

```typescript
// src/modules/[module-name]/index.ts
import { Module } from "@medusajs/framework/utils"
import ModuleNameService from "./service"

export const MODULE_NAME = "module_name"

export default Module(MODULE_NAME, {
  service: ModuleNameService,
})
```

### 2. API Route Pattern

**ALWAYS** use this structure for API routes:

```typescript
// src/api/[admin|store]/[resource]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Resolve services
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const customService = req.scope.resolve("module_name")
  
  try {
    // Use query.graph for database queries
    const { data } = await query.graph({
      entity: "entity_name",
      fields: ["*"],
      filters: { /* ... */ }
    })
    
    res.json({ data })
  } catch (error) {
    res.status(500).json({ 
      message: "Error description", 
      error: error.message 
    })
  }
}
```

### 3. Service Resolution

**NEVER** use singleton patterns or direct imports. Always resolve services:

```typescript
// ❌ WRONG
const service = new MyService()

// ✅ CORRECT
const service = req.scope.resolve("service_name")
```

### 4. Database Queries

Use MedusaJS query system:

```typescript
// Simple query
const { data: vendors } = await query.graph({
  entity: "vendor",
  fields: ["id", "name", "type"],
  filters: { is_active: true }
})

// With relations
const { data: orders } = await query.graph({
  entity: "order",
  fields: ["*", "items.*", "customer.*"],
  filters: {
    created_at: { $gte: startDate }
  }
})
```

## Frontend Patterns

### 1. Next.js App Router Structure

```
app/
├── [countryCode]/
│   ├── (main)/           # Main layout group
│   │   ├── page.tsx      # Home page
│   │   └── products/     # Product pages
│   └── (checkout)/       # Checkout layout group
│       └── checkout/
├── layout.tsx            # Root layout
└── globals.css           # Global styles
```

### 2. Component Pattern

```typescript
// Server Component (default)
import { retrieveData } from "@lib/data"

export default async function ProductList() {
  const products = await retrieveData()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

// Client Component (only when needed)
'use client'

import { useState } from 'react'

export default function InteractiveComponent() {
  const [state, setState] = useState()
  // Component logic
}
```

### 3. Data Fetching Pattern

```typescript
// lib/medusa-client.ts pattern
export async function fetchAdmin(path: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}/admin${path}`
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login"
    }
    throw new Error(`API Error: ${response.status}`)
  }
  
  return response.json()
}
```

### 4. React Query Pattern

```typescript
// For client-side data fetching
import { useQuery } from '@tanstack/react-query'

const { data, isLoading, error } = useQuery({
  queryKey: ['resource', filters],
  queryFn: () => fetchAdmin('/resource', { params: filters })
})
```

## Code Style Conventions

### TypeScript Conventions

1. **Interfaces over Types** for object shapes:
```typescript
// ✅ Preferred
interface VendorData {
  id: string
  name: string
  type: VendorType
}

// Use type for unions/aliases
type VendorType = 'shop' | 'brand' | 'distributor'
```

2. **Enum Pattern** for constants:
```typescript
export enum VendorStatus {
  PENDING = "pending",
  ACTIVE = "active",
  SUSPENDED = "suspended"
}
```

3. **Explicit Return Types** for functions:
```typescript
async function calculateCommission(amount: number): Promise<number> {
  // Implementation
}
```

### Naming Conventions

1. **Files**: kebab-case
   - `vendor-service.ts`
   - `commission-calculator.ts`

2. **Components**: PascalCase
   - `VendorDashboard.tsx`
   - `ProductCard.tsx`

3. **Functions/Variables**: camelCase
   - `calculateTotalRevenue()`
   - `isVendorActive`

4. **Constants**: UPPER_SNAKE_CASE
   - `COMMISSION_TIERS`
   - `MAX_UPLOAD_SIZE`

### React/Next.js Conventions

1. **Component Structure**:
```typescript
// 1. Imports
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Types/Interfaces
interface Props {
  vendorId: string
}

// 3. Component
export default function VendorDashboard({ vendorId }: Props) {
  // 4. State/Hooks
  const [activeTab, setActiveTab] = useState('overview')
  const { data, isLoading } = useQuery(...)
  
  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, [])
  
  // 6. Handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }
  
  // 7. Render
  if (isLoading) return <LoadingSpinner />
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}
```

2. **Tailwind CSS Classes**:
```typescript
// Group related utilities
className="
  // Layout
  flex flex-col gap-4
  // Spacing
  p-6 mt-4
  // Colors
  bg-white text-gray-900
  // Borders
  border border-gray-200 rounded-lg
  // States
  hover:bg-gray-50 focus:ring-2
"
```

## Extension Guidelines

### Adding a New Feature

1. **Backend Module**:
```bash
# 1. Create module structure
mkdir -p src/modules/feature-name/{models,services}

# 2. Define models using MedusaJS DML
# 3. Create service extending MedusaService
# 4. Export module definition
# 5. Add to medusa-config.ts

# 6. Generate and run migrations
npx medusa db:generate feature-name
npx medusa db:migrate
```

2. **API Endpoints**:
```bash
# Admin endpoints
src/api/admin/feature-name/route.ts
src/api/admin/feature-name/[id]/route.ts

# Store endpoints  
src/api/store/feature-name/route.ts
```

3. **Frontend Integration**:
```bash
# Add to appropriate app
apps/[app-name]/src/app/feature-name/page.tsx

# Shared components
packages/ui/src/components/FeatureName/

# Shared types
packages/types/src/feature-name.ts
```

### Database Schema Extensions

Always follow MedusaJS patterns:

```typescript
// ✅ CORRECT - Let MedusaJS handle timestamps
export const NewEntity = model.define("new_entity", {
  id: model.id().primaryKey(),
  vendor_id: model.text().references(() => Vendor.id),
  amount: model.bigNumber(),
  metadata: model.json().nullable()
})

// ❌ WRONG - Don't define these fields
export const BadEntity = model.define("bad_entity", {
  id: model.id().primaryKey(),
  created_at: model.dateTime(), // MedusaJS adds this
  updated_at: model.dateTime(), // MedusaJS adds this
})
```

## Integration Patterns

### Stripe Integration

Follow existing pattern in `StripeConnectService`:

```typescript
class PaymentIntegration {
  private stripe: Stripe
  
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  
  async processPayment(amount: number, vendorId: string) {
    const vendor = await this.vendorService.retrieve(vendorId)
    
    if (!vendor.stripe_account_id) {
      throw new Error("Vendor not connected to Stripe")
    }
    
    // Use existing patterns
  }
}
```

### External Service Integration

```typescript
// Create service in module
class ExternalService {
  private client: ExternalClient
  
  constructor() {
    this.client = new ExternalClient({
      apiKey: process.env.EXTERNAL_API_KEY
    })
  }
  
  async syncData() {
    // Implementation
  }
}

// Register in module if needed
```

## Quality Standards

### Code Review Checklist

- [ ] Follows MedusaJS v2 module pattern
- [ ] Uses proper service resolution (no singletons)
- [ ] Implements error handling with try-catch
- [ ] Returns consistent API responses
- [ ] Uses TypeScript with proper types
- [ ] Follows naming conventions
- [ ] Includes necessary validations
- [ ] Uses existing UI components
- [ ] Implements loading states
- [ ] Handles authentication properly

### Testing Requirements

1. **Unit Tests**: Business logic and calculations
2. **Integration Tests**: API endpoints
3. **Manual Testing**: Full user flows
4. **Seed Data**: Test with marketplace seed scripts

### Documentation Requirements

1. Update `CLAUDE.md` with new features
2. Add JSDoc comments for complex functions
3. Document new API endpoints
4. Update README if adding new commands

## Common Pitfalls to Avoid

1. **❌ Creating standalone services** → ✅ Use MedusaJS modules
2. **❌ Direct database queries** → ✅ Use query.graph()
3. **❌ Singleton patterns** → ✅ Use dependency injection
4. **❌ Hardcoded values** → ✅ Use environment variables
5. **❌ Inconsistent error handling** → ✅ Use try-catch pattern
6. **❌ Missing TypeScript types** → ✅ Define all interfaces
7. **❌ Inline styles** → ✅ Use Tailwind classes
8. **❌ Client components by default** → ✅ Server components first

## Migration Guide

When updating existing code:

1. **Identify non-conforming patterns**
2. **Create new implementation following guide**
3. **Test thoroughly with existing data**
4. **Update gradually with backwards compatibility**
5. **Remove old code after verification**

Remember: Consistency is key. When in doubt, follow existing patterns in the codebase.