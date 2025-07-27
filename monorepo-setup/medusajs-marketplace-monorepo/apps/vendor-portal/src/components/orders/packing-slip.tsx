'use client'

import { formatCurrency } from '@/lib/utils'

type PackingSlipProps = {
  order: any
  vendor: any
}

export default function PackingSlip({ order, vendor }: PackingSlipProps) {
  return (
    <div className="print:block hidden bg-white p-8">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 20mm;
          }
        }
      `}</style>

      {/* Header */}
      <div className="border-b pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{vendor?.name || 'Vendor'}</h1>
            <p className="text-sm text-gray-600 mt-1">Packing Slip</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Order #{order.display_id}</p>
            <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Ship From:</h3>
          <address className="text-sm text-gray-600 not-italic">
            {vendor?.name}<br />
            {vendor?.address && (
              <>
                {vendor.address.address_1}<br />
                {vendor.address.address_2 && <>{vendor.address.address_2}<br /></>}
                {vendor.address.city}, {vendor.address.province} {vendor.address.postal_code}<br />
                {vendor.address.country_code?.toUpperCase()}
              </>
            )}
          </address>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Ship To:</h3>
          <address className="text-sm text-gray-600 not-italic">
            {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
            {order.shipping_address.address_1}<br />
            {order.shipping_address.address_2 && <>{order.shipping_address.address_2}<br /></>}
            {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}<br />
            {order.shipping_address.country_code.toUpperCase()}
            {order.shipping_address.phone && (
              <><br />Tel: {order.shipping_address.phone}</>
            )}
          </address>
        </div>
      </div>

      {/* Customer Info */}
      <div className="border-t border-b py-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Customer:</span>
            <span className="ml-2 font-medium">{order.customer.email}</span>
          </div>
          <div>
            <span className="text-gray-600">Order Date:</span>
            <span className="ml-2 font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Ship Date:</span>
            <span className="ml-2 font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Items to Ship</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">SKU</th>
              <th className="text-left py-2">Description</th>
              <th className="text-center py-2">Quantity</th>
              <th className="text-right py-2">Unit Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.variant.sku || '-'}</td>
                <td className="py-2">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-gray-600">{item.variant.title}</p>
                  </div>
                </td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  {formatCurrency(item.unit_price, order.currency_code)}
                </td>
                <td className="text-right py-2">
                  {formatCurrency(item.subtotal, order.currency_code)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-right py-2 font-medium">Subtotal:</td>
              <td className="text-right py-2 font-medium">
                {formatCurrency(
                  order.items.reduce((sum: number, item: any) => sum + item.subtotal, 0),
                  order.currency_code
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Notes */}
      <div className="border-t pt-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Shipping Instructions:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Handle with care</p>
              <p>• Keep packages upright</p>
              <p>• Signature required on delivery</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Package Contents:</h3>
            <div className="border border-gray-300 rounded p-4 h-20">
              {/* Space for manual notes */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
        <p>Thank you for your order!</p>
        <p className="mt-1">Questions? Contact us at support@marketplace.com</p>
      </div>
    </div>
  )
}