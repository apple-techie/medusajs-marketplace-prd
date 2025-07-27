'use client'

import { useState } from 'react'
import { Button, Heading, Text, Input, Label } from '@medusajs/ui'
import { useAgeVerification } from '@lib/hooks/use-age-verification'
import { HttpTypes } from '@medusajs/types'

type AgeVerificationProps = {
  cart: HttpTypes.StoreCart
  onVerified: () => void
  minimumAge?: number
}

const AgeVerificationModal = ({ cart, onVerified, minimumAge = 21 }: AgeVerificationProps) => {
  const [birthDate, setBirthDate] = useState('')
  const [error, setError] = useState('')
  const { createSession, verify } = useAgeVerification()
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateSession = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const customerId = (cart as any).customer?.id
      const sessionData = await createSession.mutateAsync(customerId)
      setSession(sessionData)
    } catch (err) {
      setError('Failed to start age verification process')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!birthDate) {
      setError('Please enter your date of birth')
      return
    }

    if (!session) {
      await handleCreateSession()
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await verify.mutateAsync({
        token: session.session.token,
        birthDate: new Date(birthDate),
      })

      if (result.verified) {
        onVerified()
      } else {
        setError(`You must be at least ${minimumAge} years old to purchase these items`)
      }
    } catch (err) {
      setError('Age verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Start session on mount
  if (!session && !createSession.isPending) {
    handleCreateSession()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <Heading level="h2" className="text-xl font-semibold mb-2">
            Age Verification Required
          </Heading>
          <Text className="text-gray-600">
            You must be {minimumAge} or older to purchase age-restricted items in your cart.
          </Text>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <Label htmlFor="birthdate">Date of Birth</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !birthDate}
            >
              {isLoading ? 'Verifying...' : 'Verify Age'}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Text className="text-xs text-gray-500">
              We are committed to responsible sales. Your information is used solely 
              for age verification and is not stored or shared.
            </Text>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AgeVerificationModal