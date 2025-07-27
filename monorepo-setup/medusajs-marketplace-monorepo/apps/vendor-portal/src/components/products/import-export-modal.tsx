'use client'

import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Button } from '@marketplace/ui'

type ImportExportModalProps = {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File) => void
  onExport: () => void
}

export default function ImportExportModal({ isOpen, onClose, onImport, onExport }: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setFile(file)
    } else {
      alert('Please upload a CSV file')
    }
  }

  const handleImport = () => {
    if (file) {
      onImport(file)
      setFile(null)
      onClose()
    }
  }

  const handleExport = () => {
    onExport()
    onClose()
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Import/Export Products
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        onClick={() => setActiveTab('import')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'import'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <ArrowUpTrayIcon className="h-5 w-5 inline-block mr-2" />
                        Import
                      </button>
                      <button
                        onClick={() => setActiveTab('export')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'export'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <ArrowDownTrayIcon className="h-5 w-5 inline-block mr-2" />
                        Export
                      </button>
                    </nav>
                  </div>

                  <div className="mt-6">
                    {activeTab === 'import' ? (
                      <div>
                        <div
                          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".csv"
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">CSV file only</p>
                          </div>
                        </div>

                        {file && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                            <p className="text-sm text-gray-700">{file.name}</p>
                            <button
                              onClick={() => setFile(null)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        )}

                        <div className="mt-4 p-4 bg-blue-50 rounded-md">
                          <h4 className="text-sm font-medium text-blue-900">CSV Format Requirements:</h4>
                          <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                            <li>First row must contain column headers</li>
                            <li>Required columns: title, handle, description, price</li>
                            <li>Optional columns: sku, inventory_quantity, images, variant_title</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-700">
                          Export all your products to a CSV file that can be edited and re-imported later.
                        </p>
                        
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <h4 className="text-sm font-medium text-gray-900">Export includes:</h4>
                          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                            <li>All product information (title, description, handle)</li>
                            <li>Variant details (SKU, price, inventory)</li>
                            <li>Product images and metadata</li>
                            <li>Collection and category associations</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {activeTab === 'import' ? (
                    <>
                      <Button
                        type="button"
                        onClick={handleImport}
                        disabled={!file}
                      >
                        Import Products
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="mt-3 sm:mt-0 sm:mr-3"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        onClick={handleExport}
                      >
                        Export Products
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="mt-3 sm:mt-0 sm:mr-3"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}