import VendorCard from "../vendor-card"
import { Pagination } from "@modules/store/components/pagination"

const VENDORS_PER_PAGE = 12

type VendorsListProps = {
  page: number
  sortBy: string
  vendorType?: string
  countryCode: string
}

export default async function VendorsList({
  page,
  sortBy,
  vendorType,
  countryCode,
}: VendorsListProps) {
  // Fetch vendors from API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/vendors?` +
    new URLSearchParams({
      limit: VENDORS_PER_PAGE.toString(),
      offset: ((page - 1) * VENDORS_PER_PAGE).toString(),
      ...(vendorType && { type: vendorType }),
      ...(sortBy && { order: sortBy }),
    }),
    {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    }
  )

  if (!response.ok) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-large-semi mb-2">Unable to load vendors</h2>
        <p className="text-base-regular text-ui-fg-subtle">
          Please try again later
        </p>
      </div>
    )
  }

  const data = await response.json()
  const vendors = data.vendors || []
  const count = data.count || 0
  const totalPages = Math.ceil(count / VENDORS_PER_PAGE)

  if (!vendors.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-large-semi mb-2">No vendors found</h2>
        <p className="text-base-regular text-ui-fg-subtle">
          Check back soon for new vendors
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor: any) => (
          <VendorCard key={vendor.id} vendor={vendor} countryCode={countryCode} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            page={page}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  )
}