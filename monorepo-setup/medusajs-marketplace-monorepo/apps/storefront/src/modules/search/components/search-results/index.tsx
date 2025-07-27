import { getProductsList } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductGrid from "@modules/products/components/product-grid"
import { Pagination } from "@modules/store/components/pagination"

const PRODUCTS_PER_PAGE = 12

type SearchResultsProps = {
  query: string
  sortBy: SortOptions
  page: number
  vendorId?: string
  countryCode: string
}

export default async function SearchResults({
  query,
  sortBy,
  page,
  vendorId,
  countryCode,
}: SearchResultsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Build filters
  const filters: any = {}
  
  // Search query filter
  if (query) {
    filters.q = query
  }

  // Vendor filter
  if (vendorId) {
    filters["metadata.vendor_id"] = vendorId
  }

  // Get products with search
  const productsData = await getProductsList({
    page,
    queryParams: filters,
    sortBy,
    countryCode,
  })

  const { products, count } = productsData
  const totalPages = Math.ceil(count / PRODUCTS_PER_PAGE)

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-large-semi mb-2">No products found</h2>
        <p className="text-base-regular text-ui-fg-subtle">
          {query 
            ? `We couldn't find any products matching "${query}"`
            : "No products available at the moment"
          }
        </p>
        {vendorId && (
          <p className="text-small-regular text-ui-fg-muted mt-2">
            Try removing the vendor filter to see more results
          </p>
        )}
      </div>
    )
  }

  return (
    <>
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