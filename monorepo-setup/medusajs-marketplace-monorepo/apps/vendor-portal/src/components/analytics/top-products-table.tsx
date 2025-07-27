'use client'

import { formatCurrency } from '@/lib/utils'

type TopProductsTableProps = {
  products: Array<{
    id: string
    title: string
    variant_title: string
    quantity_sold: number
    revenue: number
  }>
  currencyCode: string
}

export default function TopProductsTable({ products, currencyCode }: TopProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No product data available</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sold
            </th>
            <th scope="col" className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Revenue
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.slice(0, 5).map((product, index) => (
            <tr key={product.id}>
              <td className="px-2 py-3 text-sm">
                <div>
                  <p className="text-gray-900 font-medium truncate">{product.title}</p>
                  <p className="text-gray-500 text-xs truncate">{product.variant_title}</p>
                </div>
              </td>
              <td className="px-2 py-3 text-sm text-gray-900 text-right">
                {product.quantity_sold}
              </td>
              <td className="px-2 py-3 text-sm text-gray-900 text-right font-medium">
                {formatCurrency(product.revenue, currencyCode)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {products.length > 5 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing top 5 of {products.length} products
          </p>
        </div>
      )}
    </div>
  )
}