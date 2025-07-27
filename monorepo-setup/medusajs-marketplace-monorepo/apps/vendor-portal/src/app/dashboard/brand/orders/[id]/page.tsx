'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  TruckIcon,
  PrinterIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Button } from '@marketplace/ui'
import { Badge } from '@medusajs/ui'
import { formatCurrency } from '@/lib/utils'
import FulfillmentModal from '@/components/orders/fulfillment-modal'
import PackingSlip from '@/components/orders/packing-slip'

type OrderDetail = {
  id: string
  display_id: number
  status: string
  fulfillment_status: string
  payment_status: string
  customer: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  shipping_address: {
    first_name: string
    last_name: string
    address_1: string
    address_2?: string
    city: string
    province: string
    postal_code: string
    country_code: string
    phone?: string
  }
  billing_address: {
    first_name: string
    last_name: string
    address_1: string
    address_2?: string
    city: string
    province: string
    postal_code: string
    country_code: string
  }
  items: Array<{
    id: string
    title: string
    thumbnail?: string
    variant: {
      id: string
      title: string
      sku: string
    }
    quantity: number
    unit_price: number
    subtotal: number
  }>
  fulfillments: Array<{
    id: string
    status: string
    tracking_company?: string
    tracking_number?: string
    tracking_url?: string
    shipped_at?: string
    delivered_at?: string
    items: Array<{
      item_id: string
      quantity: number
    }>
  }>
  total: number
  subtotal: number
  shipping_total: number
  tax_total: number
  discount_total: number
  currency_code: string
  created_at: string
  metadata?: any
}

const statusColors = {
  pending: 'orange',
  completed: 'green',
  canceled: 'red',
  requires_action: 'red',
} as const

const paymentStatusColors = {
  not_paid: 'red',
  awaiting: 'orange',
  captured: 'green',
  refunded: 'grey',
  partially_refunded: 'orange',
} as const

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFulfillmentModal, setShowFulfillmentModal] = useState(false)
  const [fulfilling, setFulfilling] = useState(false)
  const [vendor, setVendor] = useState<any>(null)

  useEffect(() => {
    fetchOrder()
  }, [resolvedParams.id])

  const fetchOrder = async () => {
    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/orders/${resolvedParams.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else {
        router.push('/dashboard/brand/orders')
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFulfillment = async (fulfillmentData: any) => {
    setFulfilling(true)
    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/orders/${resolvedParams.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fulfillmentData),
        }
      )
      
      if (response.ok) {
        await fetchOrder()
        setShowFulfillmentModal(false)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create fulfillment')
      }
    } catch (error) {
      console.error('Failed to create fulfillment:', error)
      alert('Failed to create fulfillment')
    } finally {
      setFulfilling(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      const vendorId = localStorage.getItem('vendor_id')
      const token = localStorage.getItem('vendor_token')
      
      // Cancel order functionality would need to be implemented
      // For now, just show an alert
      alert('Order cancellation is not yet implemented')
      return
    } catch (error) {
      console.error('Failed to cancel order:', error)
    }
  }

  const getUnfulfilledItems = () => {
    if (!order) return []
    
    const fulfilledQuantities: Record<string, number> = {}
    
    order.fulfillments?.forEach(fulfillment => {
      fulfillment.items.forEach(item => {
        fulfilledQuantities[item.item_id] = (fulfilledQuantities[item.item_id] || 0) + item.quantity
      })
    })
    
    return order.items.filter(item => {
      const fulfilled = fulfilledQuantities[item.id] || 0
      return fulfilled < item.quantity
    }).map(item => ({
      ...item,
      unfulfilled_quantity: item.quantity - (fulfilledQuantities[item.id] || 0)
    }))
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  const unfulfilledItems = getUnfulfilledItems()
  const canFulfill = unfulfilledItems.length > 0 && order.status !== 'canceled'

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/brand/orders"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Order #{order.display_id}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
            >
              <PrinterIcon className="h-4 w-4 mr-1" />
              Print
            </Button>
            {canFulfill && (
              <Button
                size="sm"
                onClick={() => setShowFulfillmentModal(true)}
              >
                <TruckIcon className="h-4 w-4 mr-1" />
                Fulfill Items
              </Button>
            )}
            {order.status === 'pending' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelOrder}
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => {
                const fulfilledQty = order.fulfillments?.reduce((sum, f) => {
                  const fItem = f.items.find(i => i.item_id === item.id)
                  return sum + (fItem?.quantity || 0)
                }, 0) || 0
                
                return (
                  <div key={item.id} className="flex items-start space-x-4 py-4 border-b last:border-0">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.variant.title}</p>
                      <p className="text-sm text-gray-500">SKU: {item.variant.sku}</p>
                      {fulfilledQty > 0 && fulfilledQty < item.quantity && (
                        <p className="text-sm text-yellow-600">
                          {fulfilledQty} of {item.quantity} fulfilled
                        </p>
                      )}
                      {fulfilledQty === item.quantity && (
                        <p className="text-sm text-green-600">
                          <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                          Fulfilled
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.unit_price, order.currency_code)} × {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.subtotal, order.currency_code)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Order Totals */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(order.subtotal, order.currency_code)}</span>
              </div>
              {order.discount_total > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-{formatCurrency(order.discount_total, order.currency_code)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{formatCurrency(order.shipping_total, order.currency_code)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatCurrency(order.tax_total, order.currency_code)}</span>
              </div>
              <div className="flex justify-between text-base font-medium pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(order.total, order.currency_code)}</span>
              </div>
            </div>
          </div>

          {/* Fulfillments */}
          {order.fulfillments && order.fulfillments.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fulfillments</h3>
              <div className="space-y-4">
                {order.fulfillments.map((fulfillment) => (
                  <div key={fulfillment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Fulfillment #{fulfillment.id.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {fulfillment.status}
                        </p>
                      </div>
                      <Badge color="blue" size="small">
                        {fulfillment.status}
                      </Badge>
                    </div>
                    
                    {fulfillment.tracking_number && (
                      <div className="mt-3 text-sm">
                        <p className="text-gray-600">
                          Tracking: {fulfillment.tracking_company} - {fulfillment.tracking_number}
                        </p>
                        {fulfillment.tracking_url && (
                          <a
                            href={fulfillment.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Track Package
                          </a>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-1">Items:</p>
                      {fulfillment.items.map((fItem) => {
                        const orderItem = order.items.find(i => i.id === fItem.item_id)
                        return orderItem ? (
                          <p key={fItem.item_id} className="text-sm text-gray-700">
                            • {orderItem.title} ({orderItem.variant.title}) × {fItem.quantity}
                          </p>
                        ) : null
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge 
                  color={statusColors[order.status as keyof typeof statusColors] || 'grey'}
                >
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment</p>
                <Badge 
                  color={paymentStatusColors[order.payment_status as keyof typeof paymentStatusColors] || 'grey'}
                >
                  {order.payment_status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fulfillment</p>
                <p className="text-sm font-medium text-gray-900">{order.fulfillment_status}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {order.customer.first_name} {order.customer.last_name}
                </p>
                <p className="text-sm text-gray-500">{order.customer.email}</p>
                {order.customer.phone && (
                  <p className="text-sm text-gray-500">{order.customer.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
            <address className="text-sm text-gray-600 not-italic">
              {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
              {order.shipping_address.address_1}<br />
              {order.shipping_address.address_2 && (
                <>{order.shipping_address.address_2}<br /></>
              )}
              {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}<br />
              {order.shipping_address.country_code.toUpperCase()}
              {order.shipping_address.phone && (
                <><br />Tel: {order.shipping_address.phone}</>
              )}
            </address>
          </div>
        </div>
      </div>

      {/* Fulfillment Modal */}
      {showFulfillmentModal && (
        <FulfillmentModal
          isOpen={showFulfillmentModal}
          onClose={() => setShowFulfillmentModal(false)}
          order={order}
          unfulfilledItems={unfulfilledItems}
          onFulfill={handleFulfillment}
          isLoading={fulfilling}
        />
      )}

      {/* Packing Slip for Printing */}
      <PackingSlip order={order} vendor={vendor} />
    </div>
  )
}