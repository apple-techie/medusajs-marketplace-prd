'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth/auth-guard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const vendorType = pathname.split('/')[2] // Extract vendor type from URL

  const handleLogout = () => {
    localStorage.removeItem('vendor_token')
    localStorage.removeItem('vendor_id')
    localStorage.removeItem('auth_provider')
    router.push('/login')
  }

  const navigation = {
    shop: [
      { name: 'Overview', href: `/dashboard/${vendorType}` },
      { name: 'Referrals', href: `/dashboard/${vendorType}/referrals` },
      { name: 'Commissions', href: `/dashboard/${vendorType}/commissions` },
      { name: 'Marketing Tools', href: `/dashboard/${vendorType}/marketing` },
      { name: 'Analytics', href: `/dashboard/${vendorType}/analytics` },
      { name: 'Reports', href: `/dashboard/${vendorType}/reports` },
    ],
    brand: [
      { name: 'Overview', href: `/dashboard/${vendorType}` },
      { name: 'Products', href: `/dashboard/${vendorType}/products` },
      { name: 'Orders', href: `/dashboard/${vendorType}/orders` },
      { name: 'Inventory', href: `/dashboard/${vendorType}/inventory` },
      { name: 'Analytics', href: `/dashboard/${vendorType}/analytics` },
      { name: 'Reports', href: `/dashboard/${vendorType}/reports` },
    ],
    distributor: [
      { name: 'Overview', href: `/dashboard/${vendorType}` },
      { name: 'Fulfillment', href: `/dashboard/${vendorType}/fulfillment` },
      { name: 'Inventory', href: `/dashboard/${vendorType}/inventory` },
      { name: 'Transfers', href: `/dashboard/${vendorType}/transfers` },
      { name: 'Hub Management', href: `/dashboard/${vendorType}/hub` },
      { name: 'Analytics', href: `/dashboard/${vendorType}/analytics` },
      { name: 'Reports', href: `/dashboard/${vendorType}/reports` },
    ],
  }

  const currentNav = navigation[vendorType as keyof typeof navigation] || []

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-semibold">Vendor Portal</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {vendorType === 'shop' && 'Shop Partner'}
                {vendorType === 'brand' && 'Brand Partner'}
                {vendorType === 'distributor' && 'Distributor Partner'}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <nav className="mt-5 px-2">
            {currentNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1
                    ${isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
    </AuthGuard>
  )
}