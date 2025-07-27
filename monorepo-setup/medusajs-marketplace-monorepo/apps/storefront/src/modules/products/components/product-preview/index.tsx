import { Text, Badge } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { BuildingStorefront } from "@medusajs/icons"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Get vendor info from metadata
  const vendorName = product.metadata?.vendor_name as string | undefined
  const vendorId = product.metadata?.vendor_id as string | undefined

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex flex-col gap-2 mt-4">
          {vendorName && (
            <div className="flex items-center gap-1 w-fit">
              <BuildingStorefront className="text-ui-fg-muted w-3.5 h-3.5" />
              <LocalizedClientLink 
                href={`/vendors/${vendorId}`}
                className="text-xsmall-regular text-ui-fg-muted hover:text-ui-fg-base"
              >
                {vendorName}
              </LocalizedClientLink>
            </div>
          )}
          <div className="flex txt-compact-medium justify-between">
            <Text className="text-ui-fg-subtle" data-testid="product-title">
              {product.title}
            </Text>
            <div className="flex items-center gap-x-2">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
