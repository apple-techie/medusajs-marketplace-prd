import { Metadata } from "next"
import VendorsTemplate from "@modules/vendors/templates/vendors-template"

export const metadata: Metadata = {
  title: "All Vendors",
  description: "Browse all vendors in our marketplace",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    page?: string
    sort?: string
    type?: string
  }>
}

export default async function VendorsPage({ params, searchParams }: Props) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  return (
    <VendorsTemplate
      page={resolvedSearchParams.page}
      sortBy={resolvedSearchParams.sort}
      vendorType={resolvedSearchParams.type}
      countryCode={resolvedParams.countryCode}
    />
  )
}