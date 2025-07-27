import Medusa from "@medusajs/js-sdk"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const medusa = new Medusa({
  baseUrl: BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})

// Helper function to get admin headers
export function getAdminHeaders(token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  return headers
}

// Custom fetch wrapper for admin endpoints
export async function fetchAdmin(path: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}/admin${path}`
  // Check for vendor token first, then admin token
  const vendorToken = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null
  const adminToken = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  const token = vendorToken || adminToken
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAdminHeaders(token || undefined),
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}