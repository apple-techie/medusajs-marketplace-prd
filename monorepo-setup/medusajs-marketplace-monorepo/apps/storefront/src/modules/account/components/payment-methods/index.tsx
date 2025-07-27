"use client"

import { useState } from "react"
import { Container, Button, Text } from "@medusajs/ui"
import { CreditCard, Plus, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

type PaymentMethodsTemplateProps = {
  customer: HttpTypes.StoreCustomer
}

// Mock payment methods for now - in production, this would come from Stripe or your payment provider
type PaymentMethod = {
  id: string
  type: "card" | "bank_account"
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
  is_default: boolean
  created_at: string
}

const PaymentMethodsTemplate = ({ customer }: PaymentMethodsTemplateProps) => {
  const [paymentMethods] = useState<PaymentMethod[]>([
    // Mock data - replace with actual API call
    {
      id: "pm_1",
      type: "card",
      card: {
        brand: "visa",
        last4: "4242",
        exp_month: 12,
        exp_year: 2025,
      },
      is_default: true,
      created_at: new Date().toISOString(),
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleAddPaymentMethod = () => {
    // In production, this would open Stripe's payment method setup
    console.log("Add payment method")
  }

  const handleRemovePaymentMethod = async (methodId: string) => {
    setLoading(true)
    try {
      // In production, call API to remove payment method
      console.log("Remove payment method:", methodId)
    } catch (error) {
      console.error("Failed to remove payment method:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (methodId: string) => {
    setLoading(true)
    try {
      // In production, call API to set default payment method
      console.log("Set default payment method:", methodId)
    } catch (error) {
      console.error("Failed to set default payment method:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCardBrandIcon = (brand: string) => {
    // In production, use actual card brand icons
    return <CreditCard />
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl-semi">Payment Methods</h1>
        <p className="text-base-regular text-ui-fg-subtle">
          Manage your saved payment methods for faster checkout
        </p>
      </div>

      <div className="mb-6">
        <Button onClick={handleAddPaymentMethod} variant="secondary">
          <Plus className="mr-2" />
          Add Payment Method
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <Container className="flex flex-col items-center justify-center p-12">
          <CreditCard className="mb-4 text-ui-fg-muted w-12 h-12" />
          <Text className="text-large-regular mb-2">No payment methods saved</Text>
          <Text className="text-base-regular text-ui-fg-subtle text-center mb-6">
            Add a payment method to make checkout faster and easier
          </Text>
        </Container>
      ) : (
        <div className="flex flex-col gap-4">
          {paymentMethods.map((method) => (
            <Container key={method.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-ui-bg-subtle rounded">
                    {getCardBrandIcon(method.card?.brand || "")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Text className="text-base-semi capitalize">
                        {method.card?.brand} •••• {method.card?.last4}
                      </Text>
                      {method.is_default && (
                        <span className="text-xsmall-regular bg-ui-bg-subtle px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <Text className="text-small-regular text-ui-fg-subtle">
                      Expires {method.card?.exp_month}/{method.card?.exp_year}
                    </Text>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!method.is_default && (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={loading}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleRemovePaymentMethod(method.id)}
                    disabled={loading}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            </Container>
          ))}
        </div>
      )}

      <div className="mt-8 p-6 bg-ui-bg-subtle rounded-lg">
        <h3 className="text-base-semi mb-2">Payment Security</h3>
        <p className="text-small-regular text-ui-fg-subtle">
          Your payment information is encrypted and securely stored. We never store your full card details.
          All transactions are processed through secure payment gateways.
        </p>
      </div>
    </div>
  )
}

export default PaymentMethodsTemplate