import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentMethodsTemplate from "@modules/account/components/payment-methods"

export const metadata: Metadata = {
  title: "Payment Methods",
  description: "Manage your saved payment methods",
}

export default async function PaymentMethodsPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  return <PaymentMethodsTemplate customer={customer} />
}