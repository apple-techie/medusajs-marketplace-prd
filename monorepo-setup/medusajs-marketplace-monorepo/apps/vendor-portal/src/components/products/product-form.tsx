'use client'

import { useState, useEffect } from 'react'
import { Button, Input } from '@marketplace/ui'
import { Textarea, Select, Switch } from '@medusajs/ui'
import ImageUpload from './image-upload'
import VariantsSection from './variants-section'

type ProductFormProps = {
  product?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    handle: product?.handle || '',
    subtitle: product?.subtitle || '',
    description: product?.description || '',
    status: product?.status || 'draft',
    collection_id: product?.collection_id || '',
    categories: product?.categories?.map((c: any) => c.id) || [],
    type_id: product?.type_id || '',
    tags: product?.tags?.map((t: any) => t.value) || [],
    images: product?.images || [],
    thumbnail: product?.thumbnail || '',
    variants: product?.variants || [{
      title: 'Default',
      sku: '',
      barcode: '',
      hs_code: '',
      inventory_quantity: 0,
      allow_backorder: false,
      manage_inventory: true,
      weight: 0,
      length: 0,
      height: 0,
      width: 0,
      prices: [{
        amount: 0,
        currency_code: 'usd'
      }]
    }],
    metadata: product?.metadata || {},
    discountable: product?.discountable ?? true,
  })

  const [collections, setCollections] = useState([])
  const [categories, setCategories] = useState([])
  const [productTypes, setProductTypes] = useState([])

  useEffect(() => {
    fetchCollections()
    fetchCategories()
    fetchProductTypes()
  }, [])

  const fetchCollections = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/collections`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCollections(data.collections || [])
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/product-categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data.product_categories || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProductTypes = async () => {
    try {
      const token = localStorage.getItem('vendor_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/vendor/product-types`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProductTypes(data.product_types || [])
      }
    } catch (error) {
      console.error('Failed to fetch product types:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate handle from title if not provided
    const handle = formData.handle || formData.title.toLowerCase().replace(/\s+/g, '-')
    
    // Add vendor metadata
    const vendorId = localStorage.getItem('vendor_id')
    const metadata = {
      ...formData.metadata,
      vendor_id: vendorId,
    }
    
    onSubmit({
      ...formData,
      handle,
      metadata,
    })
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Product Title *
              </label>
              <Input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
                Subtitle
              </label>
              <Input
                type="text"
                name="subtitle"
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="handle" className="block text-sm font-medium text-gray-700">
                Handle (URL Slug)
              </label>
              <Input
                type="text"
                name="handle"
                id="handle"
                value={formData.handle}
                onChange={(e) => updateField('handle', e.target.value)}
                placeholder="auto-generated-from-title"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Images
          </h3>
          <ImageUpload
            images={formData.images}
            thumbnail={formData.thumbnail}
            onImagesChange={(images) => updateField('images', images)}
            onThumbnailChange={(thumbnail) => updateField('thumbnail', thumbnail)}
          />
        </div>
      </div>

      {/* Organization */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Organization
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="collection" className="block text-sm font-medium text-gray-700">
                Collection
              </label>
              <select
                id="collection"
                name="collection"
                value={formData.collection_id}
                onChange={(e) => updateField('collection_id', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a collection</option>
                {collections.map((collection: any) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Product Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type_id}
                onChange={(e) => updateField('type_id', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a type</option>
                {productTypes.map((type: any) => (
                  <option key={type.id} value={type.id}>
                    {type.value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discountable
              </label>
              <div className="mt-2">
                <Switch
                  checked={formData.discountable}
                  onCheckedChange={(checked) => updateField('discountable', checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Variants
          </h3>
          <VariantsSection
            variants={formData.variants}
            onChange={(variants) => updateField('variants', variants)}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}