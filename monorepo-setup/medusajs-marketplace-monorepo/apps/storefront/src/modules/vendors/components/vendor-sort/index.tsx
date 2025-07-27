"use client"

import { useRouter, useSearchParams, useParams } from "next/navigation"
import { Select, Text } from "@medusajs/ui"

type VendorSortProps = {
  selectedSort: string
}

const VendorSort = ({ selectedSort }: VendorSortProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { countryCode } = useParams() as { countryCode: string }

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "-name", label: "Name (Z-A)" },
    { value: "-created_at", label: "Newest First" },
    { value: "created_at", label: "Oldest First" },
    { value: "-product_count", label: "Most Products" },
    { value: "product_count", label: "Least Products" },
  ]

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", sort)
    
    const queryString = params.toString()
    const url = `/vendors?${queryString}`
    
    router.push(`/${countryCode}${url}`)
  }

  return (
    <div>
      <Text className="text-base-semi mb-4">Sort By</Text>
      
      <Select value={selectedSort} onValueChange={handleSortChange}>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {sortOptions.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

export default VendorSort