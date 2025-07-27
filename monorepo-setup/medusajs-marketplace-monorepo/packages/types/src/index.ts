// Shared TypeScript types for marketplace

// Vendor Types
export type VendorType = 'shop' | 'brand' | 'distributor'

export type CommissionTier = 1 | 2 | 3 | 4 // 15%, 18%, 22%, 25%

export type VerificationStatus = 'pending' | 'approved' | 'suspended'

export interface VendorCapabilities {
  can_fulfill_orders: boolean
  can_manage_inventory: boolean
  can_set_prices: boolean
  can_create_promotions: boolean
  requires_age_verification: boolean
}

export interface Vendor {
  id: string
  type: VendorType
  name: string
  handle: string
  commission_tier: CommissionTier
  capabilities: VendorCapabilities
  stripe_account_id?: string
  verification_status: VerificationStatus
  logo?: string
  description?: string
  created_at: Date
  updated_at: Date
}

// Commission Types
export interface CommissionRate {
  tier: CommissionTier
  rate: number // percentage (15, 18, 22, 25)
  threshold: number // monthly sales threshold in cents
}

export interface Commission {
  id: string
  vendor_id: string
  order_id: string
  amount: number // in cents
  rate: number // percentage
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
  created_at: Date
  paid_at?: Date
}

// Age Verification Types
export interface AgeRestriction {
  required: boolean
  minimum_age: number // 18 or 21
  verification_method: 'birthdate' | 'id_scan' | 'third_party'
}

export interface AgeVerificationSession {
  id: string
  customer_id: string
  verified: boolean
  verified_age?: number
  verification_method: string
  expires_at: Date
  created_at: Date
}

// Order Types
export interface VendorOrderItem {
  vendor_id: string
  vendor: Vendor
  items: OrderItem[]
  subtotal: number
  commission_amount: number
  fulfillment_location?: string
}

export interface OrderItem {
  id: string
  product_id: string
  variant_id: string
  quantity: number
  unit_price: number
  total: number
}

// Fulfillment Types
export interface FulfillmentHub {
  id: string
  name: string
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  capacity: number
  current_load: number
  vendor_ids: string[]
}

export interface FulfillmentRoute {
  order_id: string
  hub_id: string
  distance: number
  estimated_time: number
  cost_estimate: number
  priority_score: number
}

// Dashboard Types
export interface VendorDashboardMetrics {
  total_sales: number
  commission_earned: number
  orders_count: number
  average_order_value: number
  conversion_rate: number
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export interface ShopReferralMetrics extends VendorDashboardMetrics {
  referral_clicks: number
  referral_conversions: number
  top_products: Array<{
    product_id: string
    product_name: string
    sales_count: number
    commission_earned: number
  }>
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    total?: number
    limit?: number
  }
}

// Webhook Types
export interface VendorWebhookEvent {
  id: string
  type: 'vendor.created' | 'vendor.updated' | 'vendor.approved' | 'vendor.suspended'
  vendor_id: string
  data: Partial<Vendor>
  created_at: Date
}

export interface CommissionWebhookEvent {
  id: string
  type: 'commission.calculated' | 'commission.approved' | 'commission.paid'
  commission_id: string
  data: Commission
  created_at: Date
}