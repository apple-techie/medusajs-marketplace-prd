import { NextRequest, NextResponse } from 'next/server'
import { sdk } from '@lib/config'
import { getAuthHeaders } from '@lib/data/cookies'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeaders = await getAuthHeaders()
    if (!authHeaders) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await sdk.client.fetch(
      `/store/customers/${params.id}/wishlist`,
      {
        method: 'GET',
        headers: authHeaders,
      }
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error('Wishlist fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeaders = await getAuthHeaders()
    if (!authHeaders) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const response = await sdk.client.fetch(
      `/store/customers/${params.id}/wishlist`,
      {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error('Wishlist add error:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}