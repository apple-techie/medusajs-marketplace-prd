# Product Catalog Management

## Overview

The product catalog system manages all product listings, variations, pricing, and inventory across the multi-vendor marketplace. It supports complex product hierarchies, age-restricted items, and vendor-specific pricing.

## Product Structure

### Product Model
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  brand_id: string;
  tags: string[];
  is_active: boolean;
  requires_age_verification: boolean;
  minimum_age: number;
  metadata: {
    manufacturer: string;
    country_of_origin: string;
    compliance_certifications: string[];
  };
  created_at: Date;
  updated_at: Date;
}
```

### Product Variants
```typescript
interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  title: string;
  options: VariantOption[];
  price: Money;
  compare_at_price?: Money;
  cost?: Money;
  barcode?: string;
  weight: number;
  dimensions: Dimensions;
  inventory_quantity: number;
  track_inventory: boolean;
  requires_shipping: boolean;
  metadata: Record<string, any>;
}
```

## Category Management

### Hierarchical Categories
- Multi-level category structure (up to 4 levels deep)
- Category-specific attributes and filters
- Age restrictions at category level
- SEO-optimized category pages

### Category Structure
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  age_restriction?: number;
  metadata: {
    filters: CategoryFilter[];
    attributes: CategoryAttribute[];
  };
}
```

## Pricing & Promotions

### Dynamic Pricing
- Base price from brands
- Distributor markup rules
- Shop commission calculations
- Volume-based pricing tiers
- Time-based promotions

### Promotion Types
1. **Percentage Discounts**: X% off regular price
2. **Fixed Amount Discounts**: $X off
3. **BOGO Offers**: Buy one get one variations
4. **Bundle Deals**: Multi-product discounts
5. **Loyalty Points Multipliers**: Extra points on purchase

### Promotion Rules Engine
```typescript
interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'bundle' | 'points';
  value: number;
  conditions: PromotionCondition[];
  valid_from: Date;
  valid_to: Date;
  usage_limit?: number;
  usage_count: number;
  applicable_to: {
    products?: string[];
    categories?: string[];
    brands?: string[];
    customer_groups?: string[];
  };
}
```

## Search & Discovery

### Search Features
- Full-text search with Elasticsearch
- Faceted search with filters
- Search suggestions and autocomplete
- Typo tolerance and synonyms
- Search result ranking optimization

### Filter System
- Price ranges
- Brand selection
- Category filtering
- Product attributes (flavor, size, etc.)
- Availability status
- Customer ratings

### Recommendation Engine
- Personalized product recommendations
- "Frequently bought together" suggestions
- "Customers also viewed" sections
- Category-based recommendations
- Purchase history-based suggestions

## Inventory Management

### Multi-Location Inventory
- Real-time inventory tracking per hub
- Reserved inventory for pending orders
- Low stock alerts and reorder points
- Inventory synchronization across channels

### Inventory Operations
```typescript
interface InventoryLevel {
  variant_id: string;
  location_id: string;
  quantity_available: number;
  quantity_reserved: number;
  quantity_incoming: number;
  reorder_point: number;
  reorder_quantity: number;
  last_restock_date: Date;
  next_restock_date?: Date;
}
```

## Product Import/Export

### Bulk Operations
- CSV/Excel import for product catalogs
- Bulk price updates
- Mass inventory adjustments
- Product data export for analysis

### Import Validation
- SKU uniqueness checks
- Required field validation
- Image URL verification
- Category mapping validation
- Price sanity checks

## Media Management

### Product Images
- Multiple images per product/variant
- Image optimization and CDN delivery
- 360-degree product views
- Video support for product demos
- Alt text for accessibility

### Image Requirements
- Minimum resolution: 1000x1000px
- Supported formats: JPG, PNG, WebP
- Maximum file size: 5MB
- Automatic thumbnail generation

## Product Reviews & Ratings

### Review System
- Verified purchase reviews only
- 5-star rating system
- Review moderation workflow
- Helpful/unhelpful voting
- Brand response capability

### Review Display
- Average rating calculation
- Rating distribution chart
- Sort by helpfulness/date/rating
- Filter by rating level
- Review highlights extraction

## API Endpoints

### Product Management
```typescript
// List products with filtering
GET /api/products
Query params: category, brand, price_min, price_max, sort, page, limit

// Get single product with variants
GET /api/products/:id

// Create product (Brand users only)
POST /api/products

// Update product
PUT /api/products/:id

// Delete product (soft delete)
DELETE /api/products/:id

// Bulk operations
POST /api/products/bulk-import
POST /api/products/bulk-update
```

### Inventory Management
```typescript
// Get inventory levels
GET /api/inventory/levels
Query params: variant_id, location_id, low_stock

// Update inventory
POST /api/inventory/adjust

// Transfer inventory between locations
POST /api/inventory/transfer

// Get inventory history
GET /api/inventory/history/:variant_id
```

## Performance Optimization

### Caching Strategy
- Redis caching for product data
- CDN caching for product images
- Search result caching
- Category page caching
- Invalidation on updates

### Database Optimization
- Indexed fields for fast queries
- Materialized views for complex aggregations
- Partitioned tables for large datasets
- Read replicas for search queries

## Compliance & Regulations

### Age-Restricted Products
- Automatic age gate triggering
- Compliance with local regulations
- Audit trail for age verification
- Restricted product reporting

### Product Compliance
- FDA compliance for vape products
- State-specific restrictions
- Warning label requirements
- Ingredient disclosure
