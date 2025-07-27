import React from "react"

// Vendor Management Widget for Medusa Admin
const VendorManagementWidget = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Vendor Management</h2>
      </div>
      <div>
        <p className="text-gray-600 mb-4">
          Manage marketplace vendors, commissions, and payouts.
        </p>
        <div className="space-y-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            View All Vendors
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ml-2">
            Add New Vendor
          </button>
        </div>
      </div>
    </div>
  )
}

// Export the widget configuration for Medusa admin
export const config = {
  zone: ["product.list.before"],
}

export default VendorManagementWidget
