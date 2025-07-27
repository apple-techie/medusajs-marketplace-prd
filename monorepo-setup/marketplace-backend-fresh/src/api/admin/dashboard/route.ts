import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { period = "7d" } = req.query
  
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const marketplaceService = req.scope.resolve("marketplace")
  const orderService = req.scope.resolve(Modules.ORDER)
  const productService = req.scope.resolve(Modules.PRODUCT)
  
  try {
    // Get date range
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const periodDays = period === "30d" ? 30 : period === "90d" ? 90 : 7
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - periodDays)
    
    // Get all vendors
    const vendors = await marketplaceService.listVendors()
    const activeVendors = vendors.filter(v => v.is_active)
    
    // Get vendor breakdown by type
    const vendorsByType = {
      shop: vendors.filter(v => v.type === 'shop' && v.is_active).length,
      brand: vendors.filter(v => v.type === 'brand' && v.is_active).length,  
      distributor: vendors.filter(v => v.type === 'distributor' && v.is_active).length,
    }
    
    // Get pending vendors
    const pendingVendors = vendors.filter(v => v.status === 'pending').length
    
    // Get all orders
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "status", 
        "total",
        "subtotal",
        "created_at",
        "items.*",
        "customer.*",
        "payment_collections.*"
      ],
      filters: {
        created_at: {
          $gte: startDate
        }
      }
    })
    
    // Calculate today's metrics
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate >= today
    })
    
    const todayMetrics = {
      orders: todayOrders.length,
      revenue: todayOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      newCustomers: new Set(todayOrders.map(o => o.customer?.id).filter(Boolean)).size,
      completedDeliveries: todayOrders.filter(o => (o.status as any) === 'delivered').length,
    }
    
    // Calculate total revenue and commissions
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalCommissions = totalRevenue * 0.15 // Average 15% commission
    
    // Get order status breakdown
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => (o.status as any) === 'processing' || (o.status as any) === 'confirmed').length,
      shipped: orders.filter(o => (o.status as any) === 'shipped').length,
      delivered: orders.filter(o => (o.status as any) === 'delivered' || o.status === 'completed').length,
      cancelled: orders.filter(o => (o.status as any) === 'cancelled' || o.status === 'canceled').length,
    }
    
    // Get products
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "status"],
      filters: {
        status: "published"
      }
    })
    
    // Calculate revenue by vendor (simplified - in production would use vendor orders)
    const revenueByVendor = activeVendors.slice(0, 5).map(vendor => ({
      vendor: vendor.name,
      revenue: Math.round(totalRevenue * (1 / activeVendors.length)),
      orders: Math.round(orders.length * (1 / activeVendors.length)),
    }))
    
    // Get recent alerts (in production, this would come from an alerts/notifications system)
    const recentAlerts = [
      {
        id: 1,
        type: pendingVendors > 0 ? 'info' : 'success',
        message: pendingVendors > 0 
          ? `${pendingVendors} vendor${pendingVendors > 1 ? 's' : ''} pending approval`
          : 'All vendors approved',
        time: 'Just now'
      },
      {
        id: 2,
        type: ordersByStatus.pending > 10 ? 'warning' : 'info',
        message: `${ordersByStatus.pending} orders pending processing`,
        time: '5 min ago'
      }
    ]
    
    res.json({
      stats: {
        totalRevenue,
        totalCommissions,
        activeOrders: orders.length,
        activeVendors: activeVendors.length,
        totalProducts: products.length,
        pendingVendors,
      },
      todayMetrics,
      vendorsByType,
      ordersByStatus,
      revenueByVendor,
      recentAlerts,
      period,
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching dashboard data", 
      error: error.message 
    })
  }
}