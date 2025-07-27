import { getVendorProducts } from "@lib/data/vendors"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductGrid from "@modules/products/components/product-grid"
import { Pagination } from "@modules/store/components/pagination"

const PRODUCTS_PER_PAGE = 12

type VendorProductsProps = {
  vendorId: string
  page: number
  sortBy: SortOptions
  category?: string
  countryCode: string
}

export default async function VendorProducts({
  vendorId,
  page,
  sortBy,
  category,
  countryCode,
}: VendorProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Get vendor products
  const { products, count } = await getVendorProducts({
    vendorId,
    page,
    sortBy,
    category,
    regionId: region.id,
  })

  const totalPages = Math.ceil(count / PRODUCTS_PER_PAGE)

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-large-semi mb-2">No products available</h2>
        <p className="text-base-regular text-ui-fg-subtle">
          This vendor doesn&apos;t have any products listed yet
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl-semi">
          {count} {count === 1 ? "Product" : "Products"}
        </h2>
      </div>
      
      <ProductGrid products={products} region={region} />
      
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}