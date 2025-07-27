'use client'

import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@marketplace/ui'
import { Input, Select, Checkbox } from '@medusajs/ui'

type UnfulfilledItem = {
  id: string
  title: string
  variant: {
    id: string
    title: string
    sku: string
  }
  quantity: number
  unfulfilled_quantity: number
}

type FulfillmentModalProps = {
  isOpen: boolean
  onClose: () => void
  order: any
  unfulfilledItems: UnfulfilledItem[]
  onFulfill: (data: any) => void
  isLoading?: boolean
}

const shippingProviders = [
  { value: 'manual', label: 'Manual Fulfillment' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'ups', label: 'UPS' },
  { value: 'usps', label: 'USPS' },
  { value: 'dhl', label: 'DHL' },
  { value: 'other', label: 'Other' },
]

export default function FulfillmentModal({
  isOpen,
  onClose,
  order,
  unfulfilledItems,
  onFulfill,
  isLoading
}: FulfillmentModalProps) {
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    unfulfilledItems.forEach(item => {
      initial[item.id] = item.unfulfilled_quantity
    })
    return initial
  })
  
  const [shippingProvider, setShippingProvider] = useState('manual')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingCompany, setTrackingCompany] = useState('')
  const [notifyCustomer, setNotifyCustomer] = useState(true)
  const [requireShipping, setRequireShipping] = useState(true)

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = unfulfilledItems.find(i => i.id === itemId)
    if (!item) return
    
    const validQuantity = Math.min(Math.max(0, quantity), item.unfulfilled_quantity)
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: validQuantity
    }))
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const all: Record<string, number> = {}
      unfulfilledItems.forEach(item => {
        all[item.id] = item.unfulfilled_quantity
      })
      setSelectedItems(all)
    } else {
      setSelectedItems({})
    }
  }

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0)
  }

  const handleSubmit = () => {
    const items = Object.entries(selectedItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([item_id, quantity]) => ({ item_id, quantity }))
    
    if (items.length === 0) {
      alert('Please select at least one item to fulfill')
      return
    }
    
    const fulfillmentData: any = {
      items,
      no_notification: !notifyCustomer,
    }
    
    if (requireShipping && shippingProvider !== 'manual') {
      if (!trackingNumber) {
        alert('Please enter a tracking number')
        return
      }
      
      fulfillmentData.tracking_numbers = [trackingNumber]
      fulfillmentData.tracking_company = shippingProvider === 'other' ? trackingCompany : shippingProvider
    }
    
    onFulfill(fulfillmentData)
  }

  const allSelected = unfulfilledItems.every(item => 
    selectedItems[item.id] === item.unfulfilled_quantity
  )

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
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Create Fulfillment
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Items Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Select Items</h4>
                        <label className="flex items-center text-sm">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={handleSelectAll}
                            className="mr-2"
                          />
                          Select all
                        </label>
                      </div>
                      
                      <div className="space-y-3">
                        {unfulfilledItems.map(item => (
                          <div key={item.id} className="border rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                <p className="text-sm text-gray-500">{item.variant.title}</p>
                                <p className="text-xs text-gray-500">SKU: {item.variant.sku}</p>
                              </div>
                              <div className="ml-4 flex items-center gap-2">
                                <label className="text-sm text-gray-600">Qty:</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max={item.unfulfilled_quantity}
                                  value={selectedItems[item.id] || 0}
                                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                                  className="w-20"
                                />
                                <span className="text-sm text-gray-500">/ {item.unfulfilled_quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-600">
                        Total items to fulfill: {getTotalItems()}
                      </p>
                    </div>

                    {/* Shipping Information */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Shipping Information</h4>
                        <label className="flex items-center text-sm">
                          <Checkbox
                            checked={requireShipping}
                            onCheckedChange={(checked) => setRequireShipping(checked === true)}
                            className="mr-2"
                          />
                          Requires shipping
                        </label>
                      </div>
                      
                      {requireShipping && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Shipping Provider
                            </label>
                            <select
                              value={shippingProvider}
                              onChange={(e) => setShippingProvider(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              {shippingProviders.map(provider => (
                                <option key={provider.value} value={provider.value}>
                                  {provider.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          {shippingProvider !== 'manual' && (
                            <>
                              {shippingProvider === 'other' && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Carrier Name
                                  </label>
                                  <Input
                                    type="text"
                                    value={trackingCompany}
                                    onChange={(e) => setTrackingCompany(e.target.value)}
                                    placeholder="Enter carrier name"
                                    className="mt-1"
                                  />
                                </div>
                              )}
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Tracking Number
                                </label>
                                <Input
                                  type="text"
                                  value={trackingNumber}
                                  onChange={(e) => setTrackingNumber(e.target.value)}
                                  placeholder="Enter tracking number"
                                  className="mt-1"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Notification */}
                    <div>
                      <label className="flex items-center text-sm">
                        <Checkbox
                          checked={notifyCustomer}
                          onCheckedChange={(checked) => setNotifyCustomer(checked === true)}
                          className="mr-2"
                        />
                        Send shipment notification to customer
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || getTotalItems() === 0}
                  >
                    {isLoading ? 'Creating...' : 'Create Fulfillment'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="mt-3 sm:mt-0 sm:mr-3"
                  >
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}