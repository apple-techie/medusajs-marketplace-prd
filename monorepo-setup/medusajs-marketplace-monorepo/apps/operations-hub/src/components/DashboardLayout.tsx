'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Overview', href: '/', icon: '📊' },
    { name: 'Orders', href: '/orders', icon: '📦' },
    { name: 'Vendors', href: '/vendors', icon: '🏪' },
    { name: 'Fulfillment', href: '/fulfillment', icon: '🚚' },
    { name: 'Customers', href: '/customers', icon: '👥' },
    { name: 'Products', href: '/products', icon: '🛍️' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Operations Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-indigo-200">Admin User</span>
              <button className="text-sm text-white hover:text-indigo-200">
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
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1
                    ${isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
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
  )
}