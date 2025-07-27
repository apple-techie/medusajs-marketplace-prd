"use client"

import { Container, Badge, Button } from "@medusajs/ui"
import { BuildingStorefront, MapPin, ShoppingBag, Star, Share } from "@medusajs/icons"
import Image from "next/image"

type VendorHeaderProps = {
  vendor: {
    id: string
    name: string
    description?: string
    type: string
    logo?: string
    cover_image?: string
    location?: string
    product_count?: number
    rating?: number
    review_count?: number
    metadata?: any
  }
}

const VendorHeader = ({ vendor }: VendorHeaderProps) => {
  const vendorTypeLabels: Record<string, string> = {
    shop: "Shop Partner",
    brand: "Brand Partner",
    distributor: "Distributor",
  }

  const vendorTypeColors: Record<string, any> = {
    shop: "green",
    brand: "blue",
    distributor: "purple",
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vendor.name,
        text: `Check out ${vendor.name} on our marketplace`,
        url: window.location.href,
      })
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-64 lg:h-80 bg-ui-bg-subtle">
        {vendor.cover_image ? (
          <Image
            src={vendor.cover_image}
            alt={`${vendor.name} cover`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-ui-bg-base to-ui-bg-subtle" />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Vendor Info */}
      <div className="content-container relative -mt-20">
        <Container className="p-6 lg:p-8 bg-white shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {vendor.logo ? (
                <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-ui-bg-subtle shadow-md">
                  <Image
                    src={vendor.logo}
                    alt={`${vendor.name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl bg-ui-bg-subtle shadow-md flex items-center justify-center">
                  <BuildingStorefront className="text-ui-fg-muted w-12 h-12" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl-semi lg:text-3xl-semi">{vendor.name}</h1>
                    <Badge 
                      color={vendorTypeColors[vendor.type] || "default"} 
                      size="small"
                    >
                      {vendorTypeLabels[vendor.type] || vendor.type}
                    </Badge>
                  </div>

                  {vendor.location && (
                    <div className="flex items-center gap-2 text-base-regular text-ui-fg-subtle mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{vendor.location}</span>
                    </div>
                  )}

                  {vendor.description && (
                    <p className="text-base-regular text-ui-fg-subtle max-w-2xl">
                      {vendor.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="text-ui-fg-muted" />
                      <span className="text-base-semi">
                        {vendor.product_count || 0} Products
                      </span>
                    </div>

                    {vendor.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-500 fill-current" />
                        <span className="text-base-semi">
                          {vendor.rating.toFixed(1)}
                        </span>
                        {vendor.review_count && (
                          <span className="text-small-regular text-ui-fg-subtle">
                            ({vendor.review_count} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    {vendor.metadata?.established_year && (
                      <div className="text-small-regular text-ui-fg-subtle">
                        Est. {vendor.metadata.established_year}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={handleShare}>
                    <Share />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {vendor.metadata?.specialties && (
            <div className="mt-6 pt-6 border-t border-ui-border-base">
              <h3 className="text-base-semi mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.metadata.specialties.map((specialty: string) => (
                  <Badge key={specialty} size="small">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}

export default VendorHeader
