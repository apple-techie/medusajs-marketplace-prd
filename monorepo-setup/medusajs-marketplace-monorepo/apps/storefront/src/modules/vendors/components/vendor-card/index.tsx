import { Container, Badge } from "@medusajs/ui"
import { BuildingStorefront, MapPin, ShoppingBag } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type VendorCardProps = {
  vendor: {
    id: string
    name: string
    description?: string
    type: "shop" | "brand" | "distributor"
    logo?: string
    cover_image?: string
    location?: string
    product_count?: number
    rating?: number
    metadata?: any
  }
  countryCode: string
}

const VendorCard = ({ vendor, countryCode }: VendorCardProps) => {
  const vendorTypeLabels = {
    shop: "Shop Partner",
    brand: "Brand Partner",
    distributor: "Distributor",
  }

  const vendorTypeColors = {
    shop: "green",
    brand: "blue",
    distributor: "purple",
  } as const

  return (
    <LocalizedClientLink href={`/vendors/${vendor.id}`}>
      <Container className="group h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 -mx-6 -mt-6 mb-4 bg-ui-bg-subtle">
          {vendor.cover_image ? (
            <Image
              src={vendor.cover_image}
              alt={`${vendor.name} cover`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BuildingStorefront className="text-ui-fg-muted w-12 h-12" />
            </div>
          )}
          
          {/* Vendor Type Badge */}
          <div className="absolute top-4 right-4">
            <Badge color={vendorTypeColors[vendor.type]} size="small">
              {vendorTypeLabels[vendor.type]}
            </Badge>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            {vendor.logo ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-ui-bg-subtle flex-shrink-0">
                <Image
                  src={vendor.logo}
                  alt={`${vendor.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-ui-bg-subtle flex items-center justify-center flex-shrink-0">
                <BuildingStorefront className="text-ui-fg-muted" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className="text-base-semi truncate group-hover:text-ui-fg-interactive">
                {vendor.name}
              </h3>
              {vendor.location && (
                <div className="flex items-center gap-1 text-small-regular text-ui-fg-subtle">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{vendor.location}</span>
                </div>
              )}
            </div>
          </div>

          {vendor.description && (
            <p className="text-small-regular text-ui-fg-subtle line-clamp-2">
              {vendor.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-ui-border-base">
            <div className="flex items-center gap-1 text-small-regular text-ui-fg-muted">
              <ShoppingBag className="w-4 h-4" />
              <span>{vendor.product_count || 0} products</span>
            </div>
            
            {vendor.rating && (
              <div className="flex items-center gap-1">
                <span className="text-small-semi">⭐ {vendor.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </LocalizedClientLink>
  )
}

export default VendorCard