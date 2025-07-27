"use client"

import { useRouter, useSearchParams, useParams } from "next/navigation"
import { RadioGroup, Text } from "@medusajs/ui"
import { Buildings, BuildingStorefront, TruckFast } from "@medusajs/icons"

type VendorTypeFilterProps = {
  selectedType?: string
}

const VendorTypeFilter = ({ selectedType }: VendorTypeFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { countryCode } = useParams() as { countryCode: string }

  const vendorTypes = [
    {
      value: "all",
      label: "All Vendors",
      icon: BuildingStorefront,
      description: "Browse all vendor types",
    },
    {
      value: "shop",
      label: "Shop Partners",
      icon: BuildingStorefront,
      description: "Local retail shops",
    },
    {
      value: "brand",
      label: "Brand Partners",
      icon: Buildings,
      description: "Official brand stores",
    },
    {
      value: "distributor",
      label: "Distributors",
      icon: TruckFast,
      description: "Wholesale distributors",
    },
  ]

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (type === "all") {
      params.delete("type")
    } else {
      params.set("type", type)
    }
    
    // Reset to page 1 when changing type
    params.delete("page")
    
    const queryString = params.toString()
    const url = queryString ? `/vendors?${queryString}` : "/vendors"
    
    router.push(`/${countryCode}${url}`)
  }

  return (
    <div>
      <Text className="text-base-semi mb-4">Vendor Type</Text>
      
      <RadioGroup
        value={selectedType || "all"}
        onValueChange={handleTypeChange}
      >
        <div className="flex flex-col gap-2">
          {vendorTypes.map((type) => {
            const Icon = type.icon
            return (
              <label
                key={type.value}
                className="flex items-start gap-3 p-3 rounded-lg border border-ui-border-base hover:border-ui-border-interactive cursor-pointer"
              >
                <RadioGroup.Item value={type.value} className="mt-1" />
                <Icon className="text-ui-fg-subtle mt-0.5 w-5 h-5" />
                <div className="flex-1">
                  <Text className="text-base-regular">{type.label}</Text>
                  <Text className="text-small-regular text-ui-fg-subtle">
                    {type.description}
                  </Text>
                </div>
              </label>
            )
          })}
        </div>
      </RadioGroup>
    </div>
  )
}

export default VendorTypeFilter