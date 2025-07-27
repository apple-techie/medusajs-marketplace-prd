import { Suspense } from "react"
import VendorHeader from "../components/vendor-header"
import VendorProducts from "../components/vendor-products"
import RefinementList from "@modules/store/components/refinement-list"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type VendorShopTemplateProps = {
  vendor: {
    id: string
    name: string
    description?: string
    type: string
    logo?: string
    cover_image?: string
    location?: string
    metadata?: any
  }
  page?: string
  sortBy?: string
  category?: string
  countryCode: string
}

const VendorShopTemplate = ({
  vendor,
  page,
  sortBy,
  category,
  countryCode,
}: VendorShopTemplateProps) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = (sortBy || "created_at") as SortOptions

  return (
    <div>
      <VendorHeader vendor={vendor} />
      
      <div className="content-container py-6">
        <div className="flex flex-col small:flex-row small:items-start gap-6">
          {/* Filters sidebar */}
          <div className="w-full small:w-1/4">
            <RefinementList sortBy={sort} />
          </div>

          {/* Products */}
          <div className="w-full small:w-3/4">
            <Suspense fallback={<SkeletonProductGrid />}>
              <VendorProducts
                vendorId={vendor.id}
                page={pageNumber}
                sortBy={sort}
                category={category}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorShopTemplate