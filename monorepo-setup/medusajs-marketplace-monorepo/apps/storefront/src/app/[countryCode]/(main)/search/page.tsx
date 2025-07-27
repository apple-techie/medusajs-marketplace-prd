import { Metadata } from "next"
import SearchTemplate from "@modules/search/templates/search-template"

export const metadata: Metadata = {
  title: "Search",
  description: "Search for products in our marketplace",
}

type Props = {
  params: { countryCode: string }
  searchParams: {
    q?: string
    page?: string
    sort?: string
    vendor?: string
  }
}

export default async function SearchPage({ params, searchParams }: Props) {
  return (
    <SearchTemplate
      query={searchParams.q || ""}
      page={searchParams.page}
      sortBy={searchParams.sort as any}
      vendorId={searchParams.vendor}
      countryCode={params.countryCode}
    />
  )
}