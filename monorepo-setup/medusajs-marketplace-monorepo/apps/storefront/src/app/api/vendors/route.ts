import { NextRequest, NextResponse } from 'next/server'
import { sdk } from '@lib/config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const limit = searchParams.get('limit') || '20'
    const offset = searchParams.get('offset') || '0'

    // Build query params
    const queryParams: any = {
      limit: parseInt(limit),
      offset: parseInt(offset),
    }

    if (type && type !== 'all') {
      queryParams.type = type
    }

    const response = await sdk.client.fetch('/store/vendors', {
      method: 'GET',
      query: queryParams,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Vendors fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}