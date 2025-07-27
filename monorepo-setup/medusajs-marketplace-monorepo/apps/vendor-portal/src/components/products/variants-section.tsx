'use client'

import { useState } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button, Input } from '@medusajs/ui'
import { Switch } from '@medusajs/ui'

type Variant = {
  title: string
  sku: string
  barcode?: string
  hs_code?: string
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  weight?: number
  length?: number
  height?: number
  width?: number
  prices: Array<{
    amount: number
    currency_code: string
  }>
}

type VariantsSectionProps = {
  variants: Variant[]
  onChange: (variants: Variant[]) => void
}

export default function VariantsSection({ variants, onChange }: VariantsSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const addVariant = () => {
    const newVariant: Variant = {
      title: `Variant ${variants.length + 1}`,
      sku: '',
      inventory_quantity: 0,
      allow_backorder: false,
      manage_inventory: true,
      prices: [{
        amount: 0,
        currency_code: 'usd'
      }]
    }
    onChange([...variants, newVariant])
    setExpandedIndex(variants.length)
  }

  const removeVariant = (index: number) => {
    if (variants.length <= 1) {
      alert('Product must have at least one variant')
      return
    }
    const newVariants = variants.filter((_, i) => i !== index)
    onChange(newVariants)
    if (expandedIndex === index) {
      setExpandedIndex(null)
    }
  }

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants]
    newVariants[index] = {
      ...newVariants[index],
      [field]: value
    } as Variant
    onChange(newVariants)
  }

  const updatePrice = (variantIndex: number, amount: number) => {
    const newVariants = [...variants]
    if (newVariants[variantIndex] && newVariants[variantIndex].prices && newVariants[variantIndex].prices[0]) {
      newVariants[variantIndex].prices[0].amount = amount
      onChange(newVariants)
    }
  }

  return (
    <div className="space-y-4">
      {variants.map((variant, index) => (
        <div key={index} className="border rounded-lg">
          <div 
            className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <div>
              <h4 className="text-sm font-medium text-gray-900">{variant.title}</h4>
              <p className="text-sm text-gray-500">
                SKU: {variant.sku || 'Not set'} • Stock: {variant.inventory_quantity}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeVariant(index)
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
              <svg
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  expandedIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="px-4 pb-4 border-t">
              <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Variant Title
                  </label>
                  <Input
                    type="text"
                    value={variant.title}
                    onChange={(e) => updateVariant(index, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <Input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Barcode
                  </label>
                  <Input
                    type="text"
                    value={variant.barcode || ''}
                    onChange={(e) => updateVariant(index, 'barcode', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    HS Code
                  </label>
                  <Input
                    type="text"
                    value={variant.hs_code || ''}
                    onChange={(e) => updateVariant(index, 'hs_code', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price (USD)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={(variant.prices?.[0]?.amount ? variant.prices[0].amount / 100 : 0).toFixed(2)}
                    onChange={(e) => updatePrice(index, Math.round(parseFloat(e.target.value) * 100))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Inventory Quantity
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={variant.inventory_quantity}
                    onChange={(e) => updateVariant(index, 'inventory_quantity', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Weight (g)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={variant.weight || 0}
                    onChange={(e) => updateVariant(index, 'weight', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Track Inventory
                    </label>
                    <Switch
                      checked={variant.manage_inventory}
                      onCheckedChange={(checked) => updateVariant(index, 'manage_inventory', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Allow Backorder
                    </label>
                    <Switch
                      checked={variant.allow_backorder}
                      onCheckedChange={(checked) => updateVariant(index, 'allow_backorder', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Length (cm)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={variant.length || 0}
                    onChange={(e) => updateVariant(index, 'length', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Width (cm)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={variant.width || 0}
                    onChange={(e) => updateVariant(index, 'width', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Height (cm)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={variant.height || 0}
                    onChange={(e) => updateVariant(index, 'height', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={addVariant}
        className="w-full"
      >
        <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
        Add Variant
      </Button>
    </div>
  )
}