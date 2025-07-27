'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@medusajs/ui'

type ImageUploadProps = {
  images: string[]
  thumbnail: string
  onImagesChange: (images: string[]) => void
  onThumbnailChange: (thumbnail: string) => void
}

export default function ImageUpload({
  images,
  thumbnail,
  onImagesChange,
  onThumbnailChange,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newImages: string[] = []

    try {
      for (const file of Array.from(files)) {
        // In production, upload to S3 or similar
        // For now, we'll use base64
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })
        newImages.push(base64)
      }

      onImagesChange([...images, ...newImages])
      
      // Set first image as thumbnail if none exists
      if (!thumbnail && newImages.length > 0 && newImages[0]) {
        onThumbnailChange(newImages[0])
      }
    } catch (error) {
      console.error('Failed to upload images:', error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    
    // If removed image was thumbnail, set first remaining image as thumbnail
    if (images[index] === thumbnail) {
      onThumbnailChange(newImages[0] || '')
    }
  }

  const setAsThumbnail = (image: string) => {
    onThumbnailChange(image)
  }

  return (
    <div>
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {image === thumbnail && (
                    <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      Thumbnail
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                    {image !== thumbnail && (
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setAsThumbnail(image)}
                          className="w-full text-xs bg-white text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
                        >
                          Set as thumbnail
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload images</span>
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {uploading && (
        <div className="mt-2 text-sm text-gray-500 text-center">
          Uploading images...
        </div>
      )}
    </div>
  )
}