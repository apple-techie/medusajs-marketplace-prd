import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return basic stats - this can be expanded based on actual requirements
    const stats = {
      totalVendors: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
