'use client'

import { useState } from 'react'
import { Button, Heading, Text, Checkbox } from '@medusajs/ui'

type AgeVerificationSimpleProps = {
  onVerified: () => void
  minimumAge?: number
}

const AgeVerificationSimple = ({ onVerified, minimumAge = 21 }: AgeVerificationSimpleProps) => {
  const [isChecked, setIsChecked] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = () => {
    if (!isChecked) {
      setError('Please confirm that you meet the age requirement')
      return
    }

    // Store verification in session storage
    const verificationData = {
      verified: true,
      verified_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      age_threshold: minimumAge,
      method: 'checkbox'
    }
    
    sessionStorage.setItem('age_verification_status', JSON.stringify(verificationData))
    onVerified()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <Heading level="h2" className="text-xl font-semibold mb-2">
            Age Verification Required
          </Heading>
          <Text className="text-gray-600 mb-4">
            Your cart contains age-restricted items. You must be at least {minimumAge} years old to purchase these products.
          </Text>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="age-confirm"
              checked={isChecked}
              onCheckedChange={(checked) => {
                setIsChecked(checked as boolean)
                setError('')
              }}
              className="mt-1"
            />
            <label htmlFor="age-confirm" className="text-sm text-gray-700 cursor-pointer">
              I confirm that I am {minimumAge} years of age or older and I am legally allowed to purchase age-restricted products.
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleVerify}
            className="flex-1"
            disabled={!isChecked}
          >
            Continue to Checkout
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Text className="text-xs text-gray-500">
            By proceeding, you acknowledge that providing false information regarding your age is illegal and may result in penalties.
          </Text>
        </div>
      </div>
    </div>
  )
}

export default AgeVerificationSimple