import ItemsTemplate from "./items"
import MultiVendorItemsTemplate from "./multi-vendor-items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import AgeRestrictionNotice from "../components/age-restriction-notice"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  // Check if cart has items from multiple vendors
  const hasMultipleVendors = cart?.items && cart.items.length > 0 && 
    new Set(cart.items.map(item => item.product?.metadata?.vendor_id)).size > 1

  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white py-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <AgeRestrictionNotice cart={cart} />
              {hasMultipleVendors ? (
                <MultiVendorItemsTemplate cart={cart} />
              ) : (
                <ItemsTemplate cart={cart} />
              )}
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white py-6">
                      <Summary cart={cart as any} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
