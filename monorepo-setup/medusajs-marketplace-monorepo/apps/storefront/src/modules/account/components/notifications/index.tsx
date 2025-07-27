"use client"

import { useState } from "react"
import { Container, Switch, Button, Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"

type NotificationsTemplateProps = {
  customer: HttpTypes.StoreCustomer
}

type NotificationPreferences = {
  order_updates: boolean
  promotions: boolean
  new_products: boolean
  vendor_updates: boolean
  price_drops: boolean
  newsletter: boolean
}

const NotificationsTemplate = ({ customer }: NotificationsTemplateProps) => {
  // In production, these would be stored in customer metadata
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    order_updates: true,
    promotions: false,
    new_products: true,
    vendor_updates: true,
    price_drops: true,
    newsletter: false,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // In production, save preferences to customer metadata
      await updateCustomer({
        metadata: {
          notification_preferences: preferences,
        },
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Failed to save preferences:", error)
    } finally {
      setSaving(false)
    }
  }

  const notificationOptions = [
    {
      key: "order_updates" as const,
      title: "Order Updates",
      description: "Get notified about order confirmations, shipping updates, and delivery status",
    },
    {
      key: "promotions" as const,
      title: "Promotions & Offers",
      description: "Receive exclusive deals, discounts, and special offers",
    },
    {
      key: "new_products" as const,
      title: "New Products",
      description: "Be the first to know when new products are available",
    },
    {
      key: "vendor_updates" as const,
      title: "Vendor Updates",
      description: "Get updates from your favorite vendors and shops",
    },
    {
      key: "price_drops" as const,
      title: "Price Drops",
      description: "Get notified when items in your wishlist go on sale",
    },
    {
      key: "newsletter" as const,
      title: "Newsletter",
      description: "Receive our weekly newsletter with curated products and stories",
    },
  ]

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl-semi">Notification Preferences</h1>
        <p className="text-base-regular text-ui-fg-subtle">
          Choose which emails and notifications you&apos;d like to receive
        </p>
      </div>

      <Container className="p-6">
        <div className="flex flex-col gap-6">
          {notificationOptions.map((option) => (
            <div
              key={option.key}
              className="flex items-start justify-between gap-4 pb-6 border-b border-ui-border-base last:border-none last:pb-0"
            >
              <div className="flex-1">
                <Text className="text-base-semi mb-1">{option.title}</Text>
                <Text className="text-small-regular text-ui-fg-subtle">
                  {option.description}
                </Text>
              </div>
              <Switch
                checked={preferences[option.key]}
                onCheckedChange={() => handleToggle(option.key)}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div>
            {saved && (
              <Text className="text-small-regular text-ui-fg-interactive">
                Preferences saved successfully
              </Text>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="primary"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </Container>

      <div className="mt-8 p-6 bg-ui-bg-subtle rounded-lg">
        <h3 className="text-base-semi mb-2">Email Frequency</h3>
        <p className="text-small-regular text-ui-fg-subtle mb-4">
          We respect your inbox. You&apos;ll only receive emails for the categories you&apos;ve selected above.
        </p>
        <p className="text-small-regular text-ui-fg-subtle">
          You can unsubscribe from all emails at any time by clicking the unsubscribe link in any email we send you.
        </p>
      </div>
    </div>
  )
}

export default NotificationsTemplate