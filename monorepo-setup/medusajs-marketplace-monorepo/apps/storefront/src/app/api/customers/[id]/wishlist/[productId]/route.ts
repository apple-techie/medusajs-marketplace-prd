import { NextRequest, NextResponse } from 'next/server'
import { sdk } from '@lib/config'
import { getAuthHeaders } from '@lib/data/cookies'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; productId: string } }
) {
  try {
    const authHeaders = await getAuthHeaders()
    if (!authHeaders) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await sdk.client.fetch(
      `/store/customers/${params.id}/wishlist/${params.productId}`,
      {
        method: 'DELETE',
        headers: authHeaders,
      }
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error('Wishlist remove error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}