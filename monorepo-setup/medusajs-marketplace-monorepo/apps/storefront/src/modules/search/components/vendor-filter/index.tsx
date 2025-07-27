"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { RadioGroup, Text } from "@medusajs/ui"
import { BuildingStorefront } from "@medusajs/icons"

type Vendor = {
  id: string
  name: string
  product_count?: number
}

type VendorFilterProps = {
  selectedVendor?: string
}

const VendorFilter = ({ selectedVendor }: VendorFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { countryCode } = useParams() as { countryCode: string }
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const response = await fetch("/api/vendors")
      if (response.ok) {
        const data = await response.json()
        setVendors(data.vendors || [])
      }
    } catch (error) {
      console.error("Failed to fetch vendors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVendorChange = (vendorId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (vendorId === "all") {
      params.delete("vendor")
    } else {
      params.set("vendor", vendorId)
    }
    
    // Reset to page 1 when changing vendor
    params.delete("page")
    
    const queryString = params.toString()
    const url = queryString ? `/search?${queryString}` : "/search"
    
    router.push(`/${countryCode}${url}`)
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-ui-bg-subtle rounded mb-4 w-24"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-ui-bg-subtle rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!vendors.length) {
    return null
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BuildingStorefront className="text-ui-fg-subtle" />
        <Text className="text-base-semi">Filter by Vendor</Text>
      </div>
      
      <RadioGroup
        value={selectedVendor || "all"}
        onValueChange={handleVendorChange}
      >
        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-between p-3 rounded-lg border border-ui-border-base hover:border-ui-border-interactive cursor-pointer">
            <div className="flex items-center gap-3">
              <RadioGroup.Item value="all" />
              <Text className="text-base-regular">All Vendors</Text>
            </div>
          </label>
          
          {vendors.map((vendor) => (
            <label
              key={vendor.id}
              className="flex items-center justify-between p-3 rounded-lg border border-ui-border-base hover:border-ui-border-interactive cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <RadioGroup.Item value={vendor.id} />
                <div>
                  <Text className="text-base-regular">{vendor.name}</Text>
                  {vendor.product_count !== undefined && (
                    <Text className="text-small-regular text-ui-fg-muted">
                      {vendor.product_count} products
                    </Text>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export default VendorFilter
