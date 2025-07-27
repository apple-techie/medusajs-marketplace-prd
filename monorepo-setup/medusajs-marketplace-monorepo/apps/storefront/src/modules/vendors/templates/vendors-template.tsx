import { Suspense } from "react"
import VendorsList from "../components/vendors-list"
import VendorTypeFilter from "../components/vendor-type-filter"
import VendorSort from "../components/vendor-sort"
import { BuildingStorefront } from "@medusajs/icons"

type VendorsTemplateProps = {
  page?: string
  sortBy?: string
  vendorType?: string
  countryCode: string
}

const VendorsTemplate = ({
  page,
  sortBy,
  vendorType,
  countryCode,
}: VendorsTemplateProps) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "name"

  return (
    <div className="content-container py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BuildingStorefront className="w-8 h-8" />
          <h1 className="text-3xl-semi">Marketplace Vendors</h1>
        </div>
        <p className="text-base-regular text-ui-fg-subtle">
          Discover unique products from our curated vendors
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="space-y-6">
            <VendorTypeFilter selectedType={vendorType} />
            <VendorSort selectedSort={sort} />
          </div>
        </div>

        {/* Vendors grid */}
        <div className="w-full lg:w-3/4">
          <Suspense fallback={<VendorsListSkeleton />}>
            <VendorsList
              page={pageNumber}
              sortBy={sort}
              vendorType={vendorType}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

const VendorsListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-ui-bg-subtle rounded-lg h-64"></div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-ui-bg-subtle rounded w-3/4"></div>
            <div className="h-4 bg-ui-bg-subtle rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VendorsTemplate