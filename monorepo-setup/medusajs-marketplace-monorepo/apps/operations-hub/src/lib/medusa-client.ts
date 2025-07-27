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
  } else if (process.env.MEDUSA_ADMIN_SECRET_KEY) {
    // Use admin secret key for server-side operations
    headers["x-medusa-access-token"] = process.env.MEDUSA_ADMIN_SECRET_KEY
  }
  
  return headers
}

// Custom fetch wrapper for admin endpoints
export async function fetchAdmin(path: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}/admin${path}`
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Important for session-based auth
      headers: {
        ...getAdminHeaders(token || undefined),
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      // If unauthorized and not already on login page, redirect to login
      if (response.status === 401 && typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
        localStorage.removeItem("admin_token")
        // Only redirect for critical endpoints, not optional ones like health checks, settings, integrations, etc.
        const optionalEndpoints = ['/health', '/status', '/settings', '/integrations/status', '/security/status', '/system/health']
        const isOptional = optionalEndpoints.some(endpoint => path.includes(endpoint))
        if (!isOptional) {
          window.location.href = "/login"
        }
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  } catch (error) {
    // Re-throw the error for react-query to handle
    throw error
  }
}
