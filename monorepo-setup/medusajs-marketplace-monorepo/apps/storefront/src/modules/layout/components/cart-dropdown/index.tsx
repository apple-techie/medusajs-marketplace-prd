import { HttpTypes } from "@medusajs/types"

type CartDropdownProps = {
  cart: HttpTypes.StoreCart | null
}

export default function CartDropdown({ cart }: CartDropdownProps) {
  if (!cart || !cart.items?.length) {
    return (
      <div className="cart-dropdown">
        <p>Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="cart-dropdown">
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <span>{item.title}</span>
            <span>Qty: {item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="cart-total">
        Total: {cart.total ? `$${(cart.total / 100).toFixed(2)}` : '$0.00'}
      </div>
    </div>
  )
}
