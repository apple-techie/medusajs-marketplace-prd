'use client'

import { useEffect, useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { useAgeVerification, useCartAgeRestriction } from '@lib/hooks/use-age-verification'
import AgeVerificationModal from '../age-verification'
import AgeVerificationSimple from '../age-verification-simple'

type AgeVerificationGuardProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const AgeVerificationGuard = ({ cart, children }: AgeVerificationGuardProps) => {
  const [showVerification, setShowVerification] = useState(false)
  const { isVerified, verificationData } = useAgeVerification()
  
  // Get product IDs from cart
  const productIds = cart.items?.map(item => item.product_id || '') || []
  const { data: restrictions, isLoading } = useCartAgeRestriction(productIds)

  useEffect(() => {
    if (!isLoading && restrictions?.restricted) {
      // Check session storage for simple verification
      const simpleVerification = sessionStorage.getItem('age_verification_status')
      if (simpleVerification) {
        try {
          const data = JSON.parse(simpleVerification)
          if (data.verified && data.age_threshold >= (restrictions.minimum_age || 21)) {
            return // Already verified
          }
        } catch (e) {
          // Invalid data, continue to show verification
        }
      }
      
      // Check if user is already verified for the required age
      if (!isVerified || (verificationData?.age_threshold || 0) < (restrictions.minimum_age || 21)) {
        setShowVerification(true)
      }
    }
  }, [restrictions, isVerified, verificationData, isLoading])

  const handleVerified = () => {
    setShowVerification(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <>
      {showVerification && restrictions && (
        <AgeVerificationSimple
          onVerified={handleVerified}
          minimumAge={restrictions.minimum_age || 21}
        />
      )}
      {children}
    </>
  )
}

export default AgeVerificationGuard