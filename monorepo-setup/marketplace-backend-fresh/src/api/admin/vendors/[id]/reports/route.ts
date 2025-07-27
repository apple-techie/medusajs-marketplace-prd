import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/vendors/:id/reports - Generate vendor reports
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorId = req.params.id
  const { type, period, start_date, end_date } = req.query as {
    type: string
    period: string
    start_date?: string
    end_date?: string
  }
  
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Validate report type
    const validTypes = ['sales', 'products', 'customers', 'inventory', 'commission']
    if (!type || !validTypes.includes(type)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid report type"
      )
    }

    // Calculate date range based on period
    let startDate: Date
    let endDate: Date = new Date()
    endDate.setHours(23, 59, 59, 999)
    
    if (period === 'custom' && start_date && end_date) {
      startDate = new Date(start_date)
      endDate = new Date(end_date)
      endDate.setHours(23, 59, 59, 999)
    } else {
      startDate = calculateStartDate(period, endDate)
    }

    // Generate report based on type
    let reportData: any[]
    let filename: string
    
    switch (type) {
      case 'sales':
        reportData = await generateSalesReport(vendorId, startDate, endDate, query)
        filename = `sales-report-${formatDateForFilename(startDate)}-to-${formatDateForFilename(endDate)}`
        break
      case 'products':
        reportData = await generateProductsReport(vendorId, startDate, endDate, query)
        filename = `products-report-${formatDateForFilename(startDate)}-to-${formatDateForFilename(endDate)}`
        break
      case 'customers':
        reportData = await generateCustomersReport(vendorId, startDate, endDate, query)
        filename = `customers-report-${formatDateForFilename(startDate)}-to-${formatDateForFilename(endDate)}`
        break
      case 'inventory':
        reportData = await generateInventoryReport(vendorId, query)
        filename = `inventory-report-${formatDateForFilename(new Date())}`
        break
      case 'commission':
        reportData = await generateCommissionReport(vendorId, startDate, endDate, query)
        filename = `commission-statement-${formatDateForFilename(startDate)}-to-${formatDateForFilename(endDate)}`
        break
      default:
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Report type not implemented"
        )
    }

    // Convert to CSV
    const csv = convertToCSV(reportData)
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`)
    
    res.send(csv)
  } catch (error) {
    res.status(500).json({ 
      message: "Error generating report", 
      error: error.message 
    })
  }
}

function calculateStartDate(period: string, endDate: Date): Date {
  const startDate = new Date(endDate)
  startDate.setHours(0, 0, 0, 0)
  
  switch (period) {
    case 'this_month':
      startDate.setDate(1)
      break
    case 'last_month':
      startDate.setMonth(startDate.getMonth() - 1)
      startDate.setDate(1)
      endDate.setDate(0) // Last day of previous month
      break
    case 'this_quarter':
      const thisQuarter = Math.floor(startDate.getMonth() / 3)
      startDate.setMonth(thisQuarter * 3)
      startDate.setDate(1)
      break
    case 'last_quarter':
      const lastQuarter = Math.floor(startDate.getMonth() / 3) - 1
      startDate.setMonth(lastQuarter * 3)
      startDate.setDate(1)
      endDate.setMonth(startDate.getMonth() + 3)
      endDate.setDate(0)
      break
    case 'this_year':
      startDate.setMonth(0)
      startDate.setDate(1)
      break
    case 'last_year':
      startDate.setFullYear(startDate.getFullYear() - 1)
      startDate.setMonth(0)
      startDate.setDate(1)
      endDate.setFullYear(endDate.getFullYear() - 1)
      endDate.setMonth(11)
      endDate.setDate(31)
      break
    default:
      // Default to this month
      startDate.setDate(1)
  }
  
  return startDate
}

function formatDateForFilename(date: Date): string {
  return date.toISOString().split('T')[0]
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''
  
  // Get headers from first object
  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')
  
  // Convert data rows
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      // Escape quotes and wrap in quotes if contains comma or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value ?? ''
    }).join(',')
  })
  
  return [csvHeaders, ...csvRows].join('\n')
}

async function generateSalesReport(
  vendorId: string, 
  startDate: Date, 
  endDate: Date, 
  query: any
): Promise<any[]> {
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "created_at",
      "status",
      "fulfillment_status",
      "payment_status",
      "total",
      "subtotal",
      "tax_total",
      "discount_total",
      "shipping_total",
      "currency_code",
      "customer.email",
      "customer.first_name",
      "customer.last_name",
      "shipping_address.*",
      "items.*",
      "items.variant.*",
      "items.product.*",
    ],
    filters: {
      created_at: {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString(),
      }
    },
  })

  // Filter and transform orders with vendor's products
  const reportData: any[] = []
  
  orders.forEach((order: any) => {
    const vendorItems = order.items.filter(
      (item: any) => item.product?.metadata?.vendor_id === vendorId
    )
    
    if (vendorItems.length > 0) {
      vendorItems.forEach((item: any) => {
        reportData.push({
          order_date: new Date(order.created_at).toLocaleDateString(),
          order_id: order.display_id || order.id,
          customer_name: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || 'Guest',
          customer_email: order.customer?.email || '',
          product_title: item.title,
          variant_title: item.variant?.title || '',
          sku: item.variant?.sku || '',
          quantity: item.quantity,
          unit_price: (item.unit_price / 100).toFixed(2),
          subtotal: ((item.unit_price * item.quantity) / 100).toFixed(2),
          commission_rate: item.product?.metadata?.commission_rate || '0',
          commission_amount: (((item.unit_price * item.quantity) * (parseFloat(item.product?.metadata?.commission_rate || '0') / 100)) / 100).toFixed(2),
          order_status: order.status,
          fulfillment_status: order.fulfillment_status || 'unfulfilled',
          payment_status: order.payment_status,
          shipping_city: order.shipping_address?.city || '',
          shipping_state: order.shipping_address?.province || '',
          shipping_country: order.shipping_address?.country_code || '',
        })
      })
    }
  })
  
  return reportData
}

async function generateProductsReport(
  vendorId: string,
  startDate: Date,
  endDate: Date,
  query: any
): Promise<any[]> {
  // Get vendor products
  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "handle",
      "status",
      "created_at",
      "variants.*",
      "variants.inventory_items.*",
      "variants.inventory_items.inventory_levels.*",
      "categories.*",
      "metadata",
    ],
    filters: {
      metadata: {
        vendor_id: vendorId
      }
    },
  })

  // Get orders for the period to calculate sales
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "items.*",
      "items.variant.*",
      "items.product.*",
    ],
    filters: {
      created_at: {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString(),
      }
    },
  })

  // Calculate sales by variant
  const salesByVariant: Record<string, { quantity: number; revenue: number }> = {}
  
  orders.forEach((order: any) => {
    order.items
      .filter((item: any) => item.product?.metadata?.vendor_id === vendorId)
      .forEach((item: any) => {
        const variantId = item.variant_id
        if (!salesByVariant[variantId]) {
          salesByVariant[variantId] = { quantity: 0, revenue: 0 }
        }
        salesByVariant[variantId].quantity += item.quantity
        salesByVariant[variantId].revenue += item.unit_price * item.quantity
      })
  })

  // Build report data
  const reportData: any[] = []
  
  products.forEach((product: any) => {
    product.variants.forEach((variant: any) => {
      const sales = salesByVariant[variant.id] || { quantity: 0, revenue: 0 }
      const inventory = variant.inventory_items?.[0]?.inventory_levels?.[0]?.stocked_quantity || 0
      
      reportData.push({
        product_title: product.title,
        variant_title: variant.title || 'Default',
        sku: variant.sku || '',
        barcode: variant.barcode || '',
        status: product.status,
        category: product.categories?.[0]?.name || '',
        current_inventory: inventory,
        units_sold: sales.quantity,
        revenue: (sales.revenue / 100).toFixed(2),
        commission_rate: product.metadata?.commission_rate || '0',
        commission_earned: ((sales.revenue * (parseFloat(product.metadata?.commission_rate || '0') / 100)) / 100).toFixed(2),
        created_date: new Date(product.created_at).toLocaleDateString(),
      })
    })
  })
  
  return reportData
}

async function generateCustomersReport(
  vendorId: string,
  startDate: Date,
  endDate: Date,
  query: any
): Promise<any[]> {
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "total",
      "created_at",
      "customer.*",
      "shipping_address.*",
      "items.*",
      "items.product.*",
    ],
    filters: {
      created_at: {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString(),
      }
    },
  })

  // Group by customer
  const customerData: Record<string, any> = {}
  
  orders.forEach((order: any) => {
    const vendorItems = order.items.filter(
      (item: any) => item.product?.metadata?.vendor_id === vendorId
    )
    
    if (vendorItems.length > 0 && order.customer) {
      const customerId = order.customer.id
      const vendorRevenue = vendorItems.reduce(
        (sum: number, item: any) => sum + (item.unit_price * item.quantity),
        0
      )
      
      if (!customerData[customerId]) {
        customerData[customerId] = {
          customer_email: order.customer.email,
          customer_name: `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim(),
          customer_since: new Date(order.customer.created_at).toLocaleDateString(),
          city: order.shipping_address?.city || '',
          state: order.shipping_address?.province || '',
          country: order.shipping_address?.country_code || '',
          total_orders: 0,
          total_spent: 0,
          total_items: 0,
          last_order_date: null,
        }
      }
      
      customerData[customerId].total_orders += 1
      customerData[customerId].total_spent += vendorRevenue
      customerData[customerId].total_items += vendorItems.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      )
      
      const orderDate = new Date(order.created_at)
      if (!customerData[customerId].last_order_date || 
          orderDate > new Date(customerData[customerId].last_order_date)) {
        customerData[customerId].last_order_date = orderDate.toLocaleDateString()
      }
    }
  })
  
  // Convert to array and format
  return Object.values(customerData).map(customer => ({
    ...customer,
    total_spent: (customer.total_spent / 100).toFixed(2),
    average_order_value: ((customer.total_spent / customer.total_orders) / 100).toFixed(2),
  }))
}

async function generateInventoryReport(
  vendorId: string,
  query: any
): Promise<any[]> {
  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "handle",
      "status",
      "variants.*",
      "variants.prices.*",
      "variants.inventory_items.*",
      "variants.inventory_items.inventory_levels.*",
      "variants.inventory_items.inventory_levels.location.*",
      "categories.*",
      "metadata",
    ],
    filters: {
      metadata: {
        vendor_id: vendorId
      }
    },
  })

  const reportData: any[] = []
  
  products.forEach((product: any) => {
    product.variants.forEach((variant: any) => {
      const inventoryItem = variant.inventory_items?.[0]
      const inventoryLevels = inventoryItem?.inventory_levels || []
      
      // If no inventory levels, add a single row with 0 quantity
      if (inventoryLevels.length === 0) {
        reportData.push({
          product_title: product.title,
          variant_title: variant.title || 'Default',
          sku: variant.sku || '',
          barcode: variant.barcode || '',
          status: product.status,
          category: product.categories?.[0]?.name || '',
          location: 'Default',
          stocked_quantity: 0,
          reserved_quantity: 0,
          available_quantity: 0,
          reorder_point: inventoryItem?.metadata?.reorder_point || 0,
          unit_cost: ((variant.prices?.[0]?.amount || 0) / 100).toFixed(2),
          total_value: '0.00',
        })
      } else {
        inventoryLevels.forEach((level: any) => {
          const available = level.stocked_quantity - level.reserved_quantity
          const unitCost = (variant.prices?.[0]?.amount || 0) / 100
          
          reportData.push({
            product_title: product.title,
            variant_title: variant.title || 'Default',
            sku: variant.sku || '',
            barcode: variant.barcode || '',
            status: product.status,
            category: product.categories?.[0]?.name || '',
            location: level.location?.name || 'Default',
            stocked_quantity: level.stocked_quantity,
            reserved_quantity: level.reserved_quantity,
            available_quantity: available,
            reorder_point: inventoryItem?.metadata?.reorder_point || 0,
            unit_cost: unitCost.toFixed(2),
            total_value: (available * unitCost).toFixed(2),
          })
        })
      }
    })
  })
  
  return reportData
}

async function generateCommissionReport(
  vendorId: string,
  startDate: Date,
  endDate: Date,
  query: any
): Promise<any[]> {
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "created_at",
      "status",
      "fulfillment_status",
      "payment_status",
      "items.*",
      "items.variant.*",
      "items.product.*",
    ],
    filters: {
      created_at: {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString(),
      },
      status: {
        $ne: "canceled"
      }
    },
  })

  const reportData: any[] = []
  const monthlyTotals: Record<string, { revenue: number; commission: number; orders: number }> = {}
  
  orders.forEach((order: any) => {
    const vendorItems = order.items.filter(
      (item: any) => item.product?.metadata?.vendor_id === vendorId
    )
    
    if (vendorItems.length > 0) {
      const orderMonth = new Date(order.created_at).toISOString().substring(0, 7) // YYYY-MM
      
      if (!monthlyTotals[orderMonth]) {
        monthlyTotals[orderMonth] = { revenue: 0, commission: 0, orders: 0 }
      }
      
      let orderRevenue = 0
      let orderCommission = 0
      
      vendorItems.forEach((item: any) => {
        const itemRevenue = item.unit_price * item.quantity
        const commissionRate = parseFloat(item.product?.metadata?.commission_rate || '0') / 100
        const itemCommission = itemRevenue * commissionRate
        
        orderRevenue += itemRevenue
        orderCommission += itemCommission
      })
      
      monthlyTotals[orderMonth].revenue += orderRevenue
      monthlyTotals[orderMonth].commission += orderCommission
      monthlyTotals[orderMonth].orders += 1
    }
  })
  
  // Convert to report format
  Object.entries(monthlyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([month, data]) => {
      const [year, monthNum] = month.split('-')
      const monthName = new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      
      reportData.push({
        period: monthName,
        total_orders: data.orders,
        gross_revenue: (data.revenue / 100).toFixed(2),
        commission_rate: '15-25%', // This should be calculated based on actual tier
        commission_amount: (data.commission / 100).toFixed(2),
        net_payout: ((data.revenue - data.commission) / 100).toFixed(2),
        status: 'Pending', // This should be based on actual payout status
        payout_date: '', // This should be based on actual payout date
      })
    })
  
  return reportData
}