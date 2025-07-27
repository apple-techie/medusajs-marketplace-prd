import { Metadata } from "next"
import { notFound } from "next/navigation"
import VendorShopTemplate from "@modules/vendors/templates/vendor-shop-template"

type Props = {
  params: Promise<{ 
    countryCode: string
    id: string 
  }>
  searchParams: Promise<{
    page?: string
    sort?: string
    category?: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/vendors/${resolvedParams.id}`,
      {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
      }
    )
    
    if (!response.ok) {
      return {
        title: "Vendor Not Found",
      }
    }

    const { vendor } = await response.json()
    
    return {
      title: `${vendor.name} - Shop`,
      description: vendor.description || `Browse products from ${vendor.name}`,
    }
  } catch (error) {
    return {
      title: "Vendor Shop",
    }
  }
}

export default async function VendorShopPage({ params, searchParams }: Props) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  // Fetch vendor details
  try {
    console.log('Fetching vendor:', resolvedParams.id)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/vendors/${resolvedParams.id}`,
      {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    )

    if (!response.ok) {
      console.error('Vendor fetch failed:', response.status, response.statusText)
      notFound()
    }

    const { vendor } = await response.json()

    return (
      <VendorShopTemplate
        vendor={vendor}
        page={resolvedSearchParams.page}
        sortBy={resolvedSearchParams.sort}
        category={resolvedSearchParams.category}
        countryCode={resolvedParams.countryCode}
      />
    )
  } catch (error) {
    console.error('Error fetching vendor:', error)
    notFound()
  }
}