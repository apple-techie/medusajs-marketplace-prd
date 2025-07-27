import { MedusaError } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../service"

export interface VendorCartItem {
  vendor_id: string
  vendor_name: string
  vendor_type: string
  items: any[]
  subtotal: number
  commission: number
  vendor_total: number
}

export interface MultiVendorCart {
  cart_id: string
  vendor_carts: VendorCartItem[]
  total_amount: number
  total_commission: number
  total_vendor_payout: number
}

export class MultiVendorCartService {
  private marketplaceService: MarketplaceModuleService
  
  constructor(marketplaceService: MarketplaceModuleService) {
    this.marketplaceService = marketplaceService
  }
  
  /**
   * Process a cart and organize items by vendor
   */
  async processMultiVendorCart(cart: any): Promise<MultiVendorCart> {
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cart is empty or invalid"
      )
    }
    
    // Group items by vendor
    const vendorItemsMap = new Map<string, any[]>()
    
    for (const item of cart.items) {
      const productMetadata = item.product?.metadata || {}
      const vendorId = productMetadata.vendor_id
      
      if (!vendorId) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product ${item.product_id} does not have a vendor assigned`
        )
      }
      
      if (!vendorItemsMap.has(vendorId)) {
        vendorItemsMap.set(vendorId, [])
      }
      
      vendorItemsMap.get(vendorId)!.push(item)
    }
    
    // Calculate totals for each vendor
    const vendorCarts: VendorCartItem[] = []
    let totalAmount = 0
    let totalCommission = 0
    let totalVendorPayout = 0
    
    for (const [vendorId, items] of vendorItemsMap) {
      try {
        const vendor = await this.marketplaceService.retrieveVendor(vendorId)
        
        if (!vendor.is_active) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Vendor ${vendor.name} is not active`
          )
        }
        
        // Calculate subtotal for this vendor's items
        const subtotal = items.reduce((sum, item) => {
          const itemTotal = item.unit_price * item.quantity
          return sum + itemTotal
        }, 0)
        
        // Calculate commission
        const commissionResult = await this.marketplaceService.calculateCommission(
          vendorId,
          subtotal
        )
        
        const vendorCart: VendorCartItem = {
          vendor_id: vendorId,
          vendor_name: vendor.name,
          vendor_type: vendor.type,
          items: items,
          subtotal: subtotal,
          commission: commissionResult.commission_amount,
          vendor_total: commissionResult.net_amount
        }
        
        vendorCarts.push(vendorCart)
        
        totalAmount += subtotal
        totalCommission += commissionResult.commission_amount
        totalVendorPayout += commissionResult.net_amount
      } catch (error) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Error processing vendor ${vendorId}: ${error.message}`
        )
      }
    }
    
    return {
      cart_id: cart.id,
      vendor_carts: vendorCarts,
      total_amount: totalAmount,
      total_commission: totalCommission,
      total_vendor_payout: totalVendorPayout
    }
  }
  
  /**
   * Validate that all items in the cart can be fulfilled
   */
  async validateCartFulfillment(cart: any): Promise<boolean> {
    const multiVendorCart = await this.processMultiVendorCart(cart)
    
    // Check inventory for each vendor's items
    for (const vendorCart of multiVendorCart.vendor_carts) {
      for (const item of vendorCart.items) {
        // In a real implementation, you would check inventory levels here
        // For now, we'll assume all items are in stock
        if (item.quantity > 100) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Quantity ${item.quantity} exceeds available stock for item ${item.title}`
          )
        }
      }
    }
    
    return true
  }
  
  /**
   * Split a cart into vendor-specific orders
   */
  async splitCartIntoVendorOrders(cart: any): Promise<any[]> {
    const multiVendorCart = await this.processMultiVendorCart(cart)
    
    const vendorOrders: any[] = []
    
    for (const vendorCart of multiVendorCart.vendor_carts) {
      const vendorOrder = {
        vendor_id: vendorCart.vendor_id,
        vendor_name: vendorCart.vendor_name,
        vendor_type: vendorCart.vendor_type,
        items: vendorCart.items.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          title: item.title
        })),
        subtotal: vendorCart.subtotal,
        commission_amount: vendorCart.commission,
        vendor_payout: vendorCart.vendor_total,
        status: "pending"
      }
      
      vendorOrders.push(vendorOrder)
    }
    
    return vendorOrders
  }
  
  /**
   * Add vendor information to cart metadata
   */
  async enrichCartWithVendorData(cart: any): Promise<any> {
    const multiVendorCart = await this.processMultiVendorCart(cart)
    
    // Add vendor summary to cart metadata
    cart.metadata = cart.metadata || {}
    cart.metadata.vendor_summary = {
      vendor_count: multiVendorCart.vendor_carts.length,
      vendors: multiVendorCart.vendor_carts.map(vc => ({
        vendor_id: vc.vendor_id,
        vendor_name: vc.vendor_name,
        item_count: vc.items.length,
        subtotal: vc.subtotal
      })),
      total_commission: multiVendorCart.total_commission,
      total_vendor_payout: multiVendorCart.total_vendor_payout
    }
    
    return cart
  }
}

export default MultiVendorCartService