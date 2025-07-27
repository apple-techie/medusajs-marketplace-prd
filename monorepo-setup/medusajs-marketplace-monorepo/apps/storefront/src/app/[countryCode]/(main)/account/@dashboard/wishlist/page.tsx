import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import WishlistTemplate from "@modules/account/components/wishlist"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View your saved products",
}

export default async function WishlistPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  return <WishlistTemplate customerId={customer.id} />
}