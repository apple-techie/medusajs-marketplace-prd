import { MedusaError } from "@medusajs/framework/utils"
import { EntityManager } from "@mikro-orm/core"
import MarketplaceModuleService from "../service"
import { LocationType } from "../models/fulfillment-location"
import { RuleType, RuleOperator, RuleAction } from "../models/routing-rule"

export interface RoutingRequest {
  order_id?: string
  customer_address: {
    city: string
    state_province: string
    postal_code: string
    country_code: string
    latitude?: number
    longitude?: number
  }
  items: Array<{
    product_id: string
    variant_id: string
    quantity: number
    vendor_id: string
    metadata?: any
  }>
  shipping_option?: {
    provider_id: string
    service_level: "standard" | "express" | "overnight"
  }
  preferred_vendor_locations?: string[]
  exclude_locations?: string[]
}

export interface LocationScore {
  location_id: string
  location_name: string
  vendor_id: string
  vendor_name: string
  total_score: number
  can_fulfill: boolean
  factors: {
    inventory_score: number
    distance_score: number
    cost_score: number
    time_score: number
    reliability_score: number
  }
  constraints: {
    passed: boolean
    failed_rules: string[]
  }
  estimated_cost: number
  estimated_shipping_cost: number
  estimated_handling_cost: number
  estimated_delivery_days: number
  inventory_status: {
    available: boolean
    partial: boolean
    items_available: number
    items_missing: string[]
  }
}

export interface RoutingResult {
  request_id: string
  timestamp: Date
  optimal_routing: Array<{
    location_id: string
    vendor_id: string
    items: Array<{
      product_id: string
      variant_id: string
      quantity: number
    }>
    estimated_cost: number
    estimated_delivery_days: number
  }>
  alternative_routings: Array<RoutingResult["optimal_routing"]>
  total_estimated_cost: number
  total_estimated_delivery_days: number
  routing_metadata: {
    algorithm_version: string
    processing_time_ms: number
    locations_evaluated: number
    rules_applied: number
  }
}

// Scoring weights configuration
const SCORING_WEIGHTS = {
  inventory: 0.25,
  distance: 0.20,
  cost: 0.25,
  time: 0.20,
  reliability: 0.10
}

export class FulfillmentRoutingService {
  private marketplaceService: MarketplaceModuleService
  private manager: EntityManager | null
  
  constructor(marketplaceService: MarketplaceModuleService, manager: EntityManager | null) {
    this.marketplaceService = marketplaceService
    this.manager = manager
  }
  
  /**
   * Main routing algorithm - finds optimal fulfillment locations for an order
   */
  async calculateOptimalRouting(request: RoutingRequest): Promise<RoutingResult> {
    const startTime = Date.now()
    const requestId = `routing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // 1. Get all active fulfillment locations
      const locations = await this.getEligibleLocations(request)
      
      // 2. Apply routing rules and constraints
      const rulesResult = await this.applyRoutingRules(request, locations)
      
      // 3. Calculate scores for each location
      const locationScores = await this.scoreLocations(request, rulesResult.locations)
      
      // 4. Find optimal routing (may split across locations)
      const optimalRouting = await this.findOptimalRouting(request, locationScores)
      
      // 5. Generate alternative routings
      const alternatives = await this.generateAlternatives(request, locationScores, optimalRouting)
      
      const processingTime = Date.now() - startTime
      
      return {
        request_id: requestId,
        timestamp: new Date(),
        optimal_routing: optimalRouting,
        alternative_routings: alternatives,
        total_estimated_cost: this.calculateTotalCost(optimalRouting),
        total_estimated_delivery_days: this.calculateMaxDeliveryDays(optimalRouting),
        routing_metadata: {
          algorithm_version: "1.0.0",
          processing_time_ms: processingTime,
          locations_evaluated: locations.length,
          rules_applied: rulesResult.rulesApplied
        }
      }
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Routing calculation failed: ${error.message}`
      )
    }
  }
  
  /**
   * Get eligible fulfillment locations based on basic criteria
   */
  private async getEligibleLocations(request: RoutingRequest) {
    const allLocations = await this.marketplaceService.listFulfillmentLocations()
    
    // Filter active locations in the same country
    const locations = allLocations.filter(loc => 
      loc.is_active && 
      loc.country_code === request.customer_address.country_code
    )
    
    // Filter out excluded locations
    if (request.exclude_locations?.length) {
      return locations.filter(loc => !request.exclude_locations!.includes(loc.id))
    }
    
    return locations
  }
  
  /**
   * Apply routing rules to filter and modify location eligibility
   */
  private async applyRoutingRules(request: RoutingRequest, locations: any[]) {
    const allRules = await this.marketplaceService.listRoutingRules()
    
    // Filter active rules and sort by priority
    const rules = allRules
      .filter(rule => rule.is_active)
      .sort((a, b) => b.priority - a.priority)
    
    let filteredLocations = [...locations]
    let rulesApplied = 0
    
    for (const rule of rules) {
      if (this.shouldApplyRule(rule, request)) {
        filteredLocations = this.applyRule(rule, filteredLocations, request)
        rulesApplied++
      }
    }
    
    return {
      locations: filteredLocations,
      rulesApplied
    }
  }
  
  /**
   * Score each location based on multiple factors
   */
  private async scoreLocations(
    request: RoutingRequest, 
    locations: any[]
  ): Promise<LocationScore[]> {
    const scores: LocationScore[] = []
    
    for (const location of locations) {
      const score = await this.scoreLocation(request, location)
      scores.push(score)
    }
    
    // Sort by total score descending
    return scores.sort((a, b) => b.total_score - a.total_score)
  }
  
  /**
   * Score a single location
   */
  private async scoreLocation(request: RoutingRequest, location: any): Promise<LocationScore> {
    // Check inventory availability
    const inventoryStatus = await this.checkInventoryAvailability(request.items, location)
    
    // Calculate individual factor scores
    const inventoryScore = this.calculateInventoryScore(inventoryStatus)
    const distanceScore = await this.calculateDistanceScore(request.customer_address, location)
    const costScore = await this.calculateCostScore(request, location)
    const timeScore = this.calculateTimeScore(request, location)
    const reliabilityScore = this.calculateReliabilityScore(location)
    
    // Calculate weighted total score
    const totalScore = 
      (inventoryScore * SCORING_WEIGHTS.inventory) +
      (distanceScore * SCORING_WEIGHTS.distance) +
      (costScore * SCORING_WEIGHTS.cost) +
      (timeScore * SCORING_WEIGHTS.time) +
      (reliabilityScore * SCORING_WEIGHTS.reliability)
    
    // Estimate costs
    const shippingCost = await this.estimateShippingCost(request, location)
    const handlingCost = this.calculateHandlingCost(request.items, location)
    
    // Get vendor info
    const vendor = location.vendor_id 
      ? await this.marketplaceService.retrieveVendor(location.vendor_id)
      : null
    
    return {
      location_id: location.id,
      location_name: location.name,
      vendor_id: location.vendor_id || "marketplace",
      vendor_name: vendor?.name || "Marketplace Fulfillment",
      total_score: totalScore,
      can_fulfill: inventoryStatus.available || inventoryStatus.partial,
      factors: {
        inventory_score: inventoryScore,
        distance_score: distanceScore,
        cost_score: costScore,
        time_score: timeScore,
        reliability_score: reliabilityScore
      },
      constraints: {
        passed: true, // TODO: Implement constraint checking
        failed_rules: []
      },
      estimated_cost: shippingCost + handlingCost,
      estimated_shipping_cost: shippingCost,
      estimated_handling_cost: handlingCost,
      estimated_delivery_days: this.estimateDeliveryDays(request, location),
      inventory_status: inventoryStatus
    }
  }
  
  /**
   * Calculate inventory availability score (0-100)
   */
  private calculateInventoryScore(inventoryStatus: any): number {
    if (inventoryStatus.available && inventoryStatus.items_available >= inventoryStatus.total_requested) {
      return 100 // Full availability
    } else if (inventoryStatus.partial) {
      // Partial availability score based on percentage available
      const percentAvailable = inventoryStatus.items_available / inventoryStatus.total_requested
      return Math.round(percentAvailable * 80) // Max 80 for partial
    }
    return 0 // No availability
  }
  
  /**
   * Calculate distance score (0-100) - closer is better
   */
  private async calculateDistanceScore(customerAddress: any, location: any): Promise<number> {
    // If we have coordinates, use Haversine formula
    if (customerAddress.latitude && customerAddress.longitude && 
        location.latitude && location.longitude) {
      const distance = this.calculateHaversineDistance(
        customerAddress.latitude,
        customerAddress.longitude,
        location.latitude,
        location.longitude
      )
      
      // Score based on distance tiers (in miles)
      if (distance < 50) return 100
      if (distance < 150) return 90
      if (distance < 300) return 80
      if (distance < 500) return 70
      if (distance < 1000) return 50
      if (distance < 2000) return 30
      return 10
    }
    
    // Fallback to state/region matching
    if (customerAddress.state_province === location.state_province) {
      return 85 // Same state
    }
    
    // Check if in shipping zones
    if (location.shipping_zones?.includes(customerAddress.state_province)) {
      return 70 // In shipping zone
    }
    
    return 40 // Default score
  }
  
  /**
   * Calculate cost score (0-100) - lower cost is better
   */
  private async calculateCostScore(request: RoutingRequest, location: any): Promise<number> {
    const estimatedCost = await this.estimateShippingCost(request, location)
    const handlingCost = this.calculateHandlingCost(request.items, location)
    const totalCost = estimatedCost + handlingCost
    
    // Score based on cost tiers (in cents)
    if (totalCost < 500) return 100
    if (totalCost < 1000) return 90
    if (totalCost < 1500) return 80
    if (totalCost < 2000) return 70
    if (totalCost < 3000) return 50
    if (totalCost < 5000) return 30
    return 10
  }
  
  /**
   * Calculate time score (0-100) - faster is better
   */
  private calculateTimeScore(request: RoutingRequest, location: any): number {
    const estimatedDays = this.estimateDeliveryDays(request, location)
    
    // Score based on delivery time
    if (estimatedDays <= 1) return 100 // Next day
    if (estimatedDays <= 2) return 90  // 2 days
    if (estimatedDays <= 3) return 80  // 3 days
    if (estimatedDays <= 5) return 60  // 5 days
    if (estimatedDays <= 7) return 40  // Week
    return 20 // More than a week
  }
  
  /**
   * Calculate reliability score based on historical performance
   */
  private calculateReliabilityScore(location: any): number {
    const fulfillmentRate = location.fulfillment_rate || 0.95
    const errorRate = location.error_rate || 0.02
    
    // Combined score based on fulfillment success and low errors
    const reliabilityScore = (fulfillmentRate * 100) * (1 - errorRate)
    return Math.round(reliabilityScore)
  }
  
  /**
   * Haversine formula to calculate distance between two coordinates
   */
  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959 // Radius of Earth in miles
    const dLat = this.toRad(lat2 - lat1)
    const dLon = this.toRad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
  
  private toRad(deg: number): number {
    return deg * (Math.PI/180)
  }
  
  /**
   * Check inventory availability at a location
   */
  private async checkInventoryAvailability(items: any[], location: any) {
    // TODO: Integrate with MedusaJS inventory module
    // For now, return mock data
    const totalRequested = items.reduce((sum, item) => sum + item.quantity, 0)
    const available = Math.random() > 0.3 // 70% chance of availability
    const partial = !available && Math.random() > 0.5 // 50% chance of partial if not fully available
    
    return {
      available,
      partial,
      total_requested: totalRequested,
      items_available: available ? totalRequested : (partial ? Math.floor(totalRequested * 0.6) : 0),
      items_missing: available ? [] : items.slice(0, 2).map(i => i.product_id)
    }
  }
  
  /**
   * Estimate shipping cost
   */
  private async estimateShippingCost(request: RoutingRequest, location: any): Promise<number> {
    // TODO: Integrate with shipping providers
    // Basic estimation based on distance
    const distance = await this.calculateDistanceScore(request.customer_address, location)
    const baseRate = 799 // $7.99 base
    const distanceMultiplier = (100 - distance) / 100 // Higher distance = higher cost
    return Math.round(baseRate * (1 + distanceMultiplier))
  }
  
  /**
   * Calculate handling costs
   */
  private calculateHandlingCost(items: any[], location: any): number {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const handlingFee = location.handling_fee_cents || 0
    const pickPackFee = location.pick_pack_fee_cents || 0
    return handlingFee + (pickPackFee * itemCount)
  }
  
  /**
   * Estimate delivery days
   */
  private estimateDeliveryDays(request: RoutingRequest, location: any): number {
    const processingTime = location.processing_time_hours || 24
    const processingDays = Math.ceil(processingTime / 24)
    
    // Add transit time based on service level
    let transitDays = 3 // Default standard shipping
    if (request.shipping_option?.service_level === "express") {
      transitDays = 2
    } else if (request.shipping_option?.service_level === "overnight") {
      transitDays = 1
    }
    
    return processingDays + transitDays
  }
  
  /**
   * Find optimal routing - may split order across locations
   */
  private async findOptimalRouting(request: RoutingRequest, scores: LocationScore[]): Promise<any[]> {
    // For now, use single best location
    // TODO: Implement split shipment optimization
    const bestLocation = scores.find(s => s.can_fulfill)
    
    if (!bestLocation) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "No fulfillment location can fulfill this order"
      )
    }
    
    return [{
      location_id: bestLocation.location_id,
      vendor_id: bestLocation.vendor_id,
      items: request.items,
      estimated_cost: bestLocation.estimated_cost,
      estimated_delivery_days: bestLocation.estimated_delivery_days
    }]
  }
  
  /**
   * Generate alternative routing options
   */
  private async generateAlternatives(
    request: RoutingRequest, 
    scores: LocationScore[], 
    optimal: any[]
  ): Promise<any[]> {
    // Return top 3 alternatives that can fulfill
    const alternatives = scores
      .filter(s => s.can_fulfill && !optimal.some(o => o.location_id === s.location_id))
      .slice(0, 3)
      .map(score => [{
        location_id: score.location_id,
        vendor_id: score.vendor_id,
        items: request.items,
        estimated_cost: score.estimated_cost,
        estimated_delivery_days: score.estimated_delivery_days
      }])
    
    return alternatives
  }
  
  /**
   * Check if a rule should be applied to this request
   */
  private shouldApplyRule(rule: any, request: RoutingRequest): boolean {
    // TODO: Implement rule condition checking
    return true
  }
  
  /**
   * Apply a routing rule to filter locations
   */
  private applyRule(rule: any, locations: any[], request: RoutingRequest): any[] {
    // TODO: Implement rule application logic
    return locations
  }
  
  /**
   * Calculate total cost for a routing
   */
  private calculateTotalCost(routing: any[]): number {
    return routing.reduce((sum, route) => sum + route.estimated_cost, 0)
  }
  
  /**
   * Calculate maximum delivery days for a routing
   */
  private calculateMaxDeliveryDays(routing: any[]): number {
    return Math.max(...routing.map(route => route.estimated_delivery_days))
  }
}

export default FulfillmentRoutingService