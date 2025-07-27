'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

interface AgeRestrictionCheck {
  restricted: boolean
  minimum_age: number | null
  requires_id_check: boolean
  restricted_products: Array<{
    product_id: string
    minimum_age: number
    restriction_reason: string
    compliance_category: string
  }>
}

interface VerificationSession {
  session: {
    token: string
    expires_at: string
    age_threshold: number
    method: string
  }
}

interface VerificationResult {
  verified: boolean
  message: string
  session: {
    status: string
    verified_age: number
    age_threshold: number
  }
}

const AGE_VERIFICATION_KEY = 'age_verification_status'
const AGE_VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

async function checkProductRestrictions(productIds: string[]): Promise<AgeRestrictionCheck> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/age-verification/check-products`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_ids: productIds }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to check product restrictions')
  }

  return response.json()
}

async function createVerificationSession(customerId?: string): Promise<VerificationSession> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/age-verification`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: customerId,
        method: 'session',
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to create verification session')
  }

  return response.json()
}

async function verifyAge(token: string, birthDate: Date): Promise<VerificationResult> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/age-verification/verify`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        birth_date: birthDate.toISOString(),
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Age verification failed')
  }

  return response.json()
}

export function useAgeVerification() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [verificationData, setVerificationData] = useState<any>(null)

  useEffect(() => {
    // Check local storage for existing verification
    const stored = localStorage.getItem(AGE_VERIFICATION_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.expires_at && new Date(data.expires_at) > new Date()) {
          setIsVerified(true)
          setVerificationData(data)
        } else {
          // Expired, clear it
          localStorage.removeItem(AGE_VERIFICATION_KEY)
        }
      } catch (e) {
        localStorage.removeItem(AGE_VERIFICATION_KEY)
      }
    }
  }, [])

  const checkRestrictions = useQuery({
    queryKey: ['age-restrictions'],
    queryFn: async () => {
      // This would normally get product IDs from the cart
      // For now, return a placeholder
      return { restricted: false, minimum_age: null, requires_id_check: false, restricted_products: [] }
    },
    enabled: false, // Only run when explicitly called
  })

  const createSession = useMutation({
    mutationFn: (customerId?: string) => createVerificationSession(customerId),
  })

  const verify = useMutation({
    mutationFn: ({ token, birthDate }: { token: string; birthDate: Date }) => 
      verifyAge(token, birthDate),
    onSuccess: (data) => {
      if (data.verified) {
        const verificationData = {
          verified: true,
          verified_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + AGE_VERIFICATION_EXPIRY).toISOString(),
          age_threshold: data.session.age_threshold,
          verified_age: data.session.verified_age,
        }
        localStorage.setItem(AGE_VERIFICATION_KEY, JSON.stringify(verificationData))
        setIsVerified(true)
        setVerificationData(verificationData)
      }
    },
  })

  const clearVerification = () => {
    localStorage.removeItem(AGE_VERIFICATION_KEY)
    setIsVerified(false)
    setVerificationData(null)
  }

  return {
    isVerified,
    verificationData,
    checkRestrictions,
    createSession,
    verify,
    clearVerification,
  }
}

export function useCartAgeRestriction(productIds: string[]) {
  return useQuery({
    queryKey: ['age-restrictions', productIds],
    queryFn: () => checkProductRestrictions(productIds),
    enabled: productIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}