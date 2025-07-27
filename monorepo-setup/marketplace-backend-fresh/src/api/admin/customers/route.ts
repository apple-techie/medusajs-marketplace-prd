import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { limit = 50, offset = 0, q } = req.query
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Build filters
    const filters: any = {}
    if (q && typeof q === 'string') {
      filters.$or = [
        { email: { $ilike: `%${q}%` } },
        { first_name: { $ilike: `%${q}%` } },
        { last_name: { $ilike: `%${q}%` } }
      ]
    }
    
    // Get customers with their order data
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: [
        "id",
        "email",
        "first_name", 
        "last_name",
        "phone",
        "created_at",
        "updated_at",
        "metadata",
        "orders.*",
        "addresses.*"
      ],
      filters,
      pagination: {
        skip: Number(offset),
        take: Number(limit)
      }
    })
    
    // Calculate customer metrics
    const customersWithMetrics = customers.map(customer => {
      const orders = customer.orders || []
      const totalSpent = orders.reduce((sum, order) => {
        if (!order) return sum
        return sum + (order.total || 0)
      }, 0)
      const lastOrderDate = orders.length > 0 
        ? Math.max(...orders.map(o => {
            if (!o || !o.created_at) return 0
            return new Date(o.created_at).getTime()
          }))
        : null
      
      return {
        id: customer.id,
        email: customer.email,
        name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Guest',
        phone: customer.phone,
        created_at: customer.created_at,
        total_orders: orders.length,
        total_spent: totalSpent,
        last_order_date: lastOrderDate ? new Date(lastOrderDate).toISOString() : null,
        addresses: customer.addresses || [],
        metadata: customer.metadata
      }
    })
    
    // Get total count
    const { data: countResult } = await query.graph({
      entity: "customer",
      fields: ["id"],
      filters
    })
    
    res.json({
      customers: customersWithMetrics,
      count: countResult.length,
      offset: Number(offset),
      limit: Number(limit)
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching customers", 
      error: error.message 
    })
  }
}