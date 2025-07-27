import { Suspense } from "react"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@modules/store/components/refinement-list"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import SearchResults from "../components/search-results"
import VendorFilter from "../components/vendor-filter"

type SearchTemplateProps = {
  query: string
  page?: string
  sortBy?: SortOptions
  vendorId?: string
  countryCode: string
}

const SearchTemplate = ({
  query,
  page,
  sortBy,
  vendorId,
  countryCode,
}: SearchTemplateProps) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <div className="w-full small:w-1/4 small:pr-6">
        <RefinementList sortBy={sort} />
        <div className="mt-6">
          <VendorFilter selectedVendor={vendorId} />
        </div>
      </div>
      
      <div className="w-full small:w-3/4">
        <div className="mb-8">
          <h1 className="text-2xl-semi mb-2">
            {query ? `Search results for "${query}"` : "All Products"}
          </h1>
          {query && (
            <p className="text-base-regular text-ui-fg-subtle">
              Searching across all vendors and products
            </p>
          )}
        </div>
        
        <Suspense fallback={<SkeletonProductGrid />}>
          <SearchResults
            query={query}
            sortBy={sort}
            page={pageNumber}
            vendorId={vendorId}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default SearchTemplate