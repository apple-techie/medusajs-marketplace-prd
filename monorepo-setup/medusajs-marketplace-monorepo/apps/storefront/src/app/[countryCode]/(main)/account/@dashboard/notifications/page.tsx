import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import NotificationsTemplate from "@modules/account/components/notifications"

export const metadata: Metadata = {
  title: "Notification Preferences",
  description: "Manage your email and notification preferences",
}

export default async function NotificationsPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  return <NotificationsTemplate customer={customer} />
}