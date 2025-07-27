'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Badge } from '@medusajs/ui'
import { formatCurrency } from '@/lib/utils'

type ProductPreviewProps = {
  product: any
  isOpen: boolean
  onClose: () => void
}

export default function ProductPreview({ product, isOpen, onClose }: ProductPreviewProps) {
  if (!product) return null

  const getInventoryCount = () => {
    return product.variants?.reduce((sum: number, variant: any) => {
      return sum + (variant.inventory_quantity || 0)
    }, 0) || 0
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="bg-white">
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Product Preview
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="px-6 py-4">
                    {/* Product Images */}
                    {(product.images?.length > 0 || product.thumbnail) && (
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          {product.thumbnail && (
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={product.thumbnail}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          {product.images?.slice(0, 3).map((image: any, index: number) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={image.url}
                                alt={`${product.title} ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
                        {product.subtitle && (
                          <p className="mt-1 text-lg text-gray-600">{product.subtitle}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge
                          color={product.status === 'published' ? 'green' : 'grey'}
                        >
                          {product.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {getInventoryCount()} in stock
                        </span>
                      </div>

                      {product.description && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Description</h3>
                          <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                            {product.description}
                          </p>
                        </div>
                      )}

                      {/* Variants */}
                      {product.variants && product.variants.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Variants</h3>
                          <div className="space-y-2">
                            {product.variants.map((variant: any) => (
                              <div key={variant.id} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">{variant.title}</p>
                                    {variant.sku && (
                                      <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900">
                                      {variant.prices?.[0] ? formatCurrency(variant.prices[0].amount, variant.prices[0].currency_code) : '-'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {variant.inventory_quantity || 0} in stock
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Details */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        {product.collection && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Collection</p>
                            <p className="text-sm text-gray-900">{product.collection.title}</p>
                          </div>
                        )}
                        {product.type && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Type</p>
                            <p className="text-sm text-gray-900">{product.type.value}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-500">Handle</p>
                          <p className="text-sm text-gray-900">{product.handle}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Discountable</p>
                          <p className="text-sm text-gray-900">{product.discountable ? 'Yes' : 'No'}</p>
                        </div>
                      </div>

                      {/* Tags */}
                      {product.tags && product.tags.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag: any) => (
                              <Badge key={tag.id} color="grey" size="small">
                                {tag.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}